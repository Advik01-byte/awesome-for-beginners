const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');
const specs = require('./exercise-specs');

class ExerciseValidator {
  constructor(filePath) {
    this.filePath = path.resolve(filePath);
    this.relativePath = this.getRelativePath(this.filePath);
    this.content = fs.existsSync(this.filePath) ? fs.readFileSync(this.filePath, 'utf8') : '';
    this.spec = specs[this.relativePath];
    this.errors = [];
    this.artifacts = [];
  }

  getRelativePath(filePath) {
    const normalized = path.relative(process.cwd(), path.resolve(filePath)).replace(/\\/g, '/');
    return normalized.startsWith('..') ? filePath.replace(/\\/g, '/') : normalized;
  }

  async validate() {
    if (this.isRootManifest()) {
      this.validateRootManifest();
      return this.errors.length === 0;
    }

    if (this.isLanguageManifest()) {
      this.validateLanguageManifest();
      return this.errors.length === 0;
    }

    if (!this.spec) {
      throw new Error(`No specification found for ${this.relativePath}`);
    }

    this.scannedContent = this.stripComments(this.content, this.spec.language);
    this.validateManifestAlignment();
    this.validateHasMeaningfulContent();

    for (const test of this.spec.tests) {
      this.runTest(test);
    }

    if (this.spec.needsCompile) {
      this.compilationSucceeded = this.compile();
    }

    if (this.spec.runtime && this.compilationSucceeded !== false) {
      await this.runRuntimeChecks();
    }

    this.cleanupArtifacts();

    return this.errors.length === 0;
  }

  isRootManifest() {
    return this.relativePath === 'EXERCISES.md';
  }

  isLanguageManifest() {
    return /exercises\/[^/]+\/[^/]+_exercises\.md$/i.test(this.relativePath);
  }

  validateRootManifest() {
    const linkedReadmes = [...this.content.matchAll(/\((exercises\/[^)]+?_exercises\.md)\)/gi)].map((match) => match[1]);

    if (!linkedReadmes.length) {
      this.errors.push('Root EXERCISES.md does not link to any language exercise manifests');
      return;
    }

    for (const readme of linkedReadmes) {
      if (!fs.existsSync(path.resolve(readme))) {
        this.errors.push(`Missing language exercise manifest referenced from EXERCISES.md: ${readme}`);
      }
    }
  }

  validateLanguageManifest() {
    const filePaths = this.extractExercisePathsFromMarkdown(this.content);

    if (!filePaths.length) {
      this.errors.push(`${this.relativePath} does not list any exercise files`);
      return;
    }

    for (const exercisePath of filePaths) {
      const absolutePath = path.resolve('exercises', exercisePath);
      const normalizedRelativePath = `exercises/${exercisePath}`.replace(/\\/g, '/');

      if (!fs.existsSync(absolutePath)) {
        this.errors.push(`Manifest references a missing exercise file: ${normalizedRelativePath}`);
        continue;
      }

      if (!specs[normalizedRelativePath]) {
        this.errors.push(`No validator specification exists for manifest entry: ${normalizedRelativePath}`);
      }
    }
  }

  extractExercisePathsFromMarkdown(content) {
    const matches = [...content.matchAll(/`([^`]+\.(?:html|css|js|java|cpp|py))`/gi)].map((match) => match[1]);
    return [...new Set(matches)];
  }

  validateManifestAlignment() {
    if (!this.spec.readmePath) {
      return;
    }

    const readmePath = path.resolve(this.spec.readmePath);

    if (!fs.existsSync(readmePath)) {
      this.errors.push(`Referenced README is missing: ${this.spec.readmePath}`);
      return;
    }

    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    const manifestEntry = this.relativePath.replace(/^exercises\//, '');

    if (!readmeContent.includes(manifestEntry)) {
      this.errors.push(`README ${this.spec.readmePath} does not list ${manifestEntry}`);
    }
  }

  validateHasMeaningfulContent() {
    const stripped = this.scannedContent ?? this.stripComments(this.content, this.spec.language);

    if (!stripped.trim()) {
      this.errors.push('File contains only comments or whitespace - exercise incomplete');
    }
  }

  stripComments(content, language) {
    let stripped = content;

    if (language === 'html') {
      stripped = stripped.replace(/<!--[\s\S]*?-->/g, '');
    } else if (language === 'css') {
      stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, '');
    } else if (language === 'javascript' || language === 'java' || language === 'cpp') {
      stripped = stripped
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
    }

    return stripped;
  }

  runTest(test) {
    try {
      const content = this.scannedContent ?? this.content;
      let passed = false;

      if (test.regex) {
        passed = test.regex.test(content);
      } else if (test.fn) {
        passed = test.fn(content);
      }

      if (!passed) {
        this.errors.push(test.error);
      }
    } catch (error) {
      this.errors.push(`${test.check}: ${error.message}`);
    }
  }

  compile() {
    if (this.filePath.endsWith('.java')) {
      const result = this.runCommand('javac', [this.filePath], {
        errorPrefix: 'Compilation failed'
      });
      if (result.status === 0) {
        this.artifacts.push(...this.getJavaClassFiles());
      }
      return result.status === 0;
    }

    if (this.filePath.endsWith('.cpp')) {
      const binaryPath = this.getBinaryPath();
      const result = this.runCommand('g++', ['-std=c++17', this.filePath, '-o', binaryPath], {
        errorPrefix: 'Compilation failed'
      });
      if (result.status === 0) {
        this.artifacts.push(binaryPath);
      }
      return result.status === 0;
    }

    return true;
  }

  async runRuntimeChecks() {
    if (typeof this.spec.runtime === 'function') {
      await this.spec.runtime(this);
      return;
    }

    const runtime = this.spec.runtime;

    if (runtime.exactOutput !== undefined) {
      const result = this.executeProgram(runtime.input ?? '');
      const actual = this.normalizeOutput(result.stdout);
      const expected = this.normalizeOutput(runtime.exactOutput);

      if (actual !== expected) {
        this.errors.push(`Expected exact output "${expected}" but got "${actual}"`);
      }
    }

    if (runtime.echoInput) {
      const token = crypto.randomUUID().replace(/-/g, '');
      const result = this.executeProgram(`${token}\n`);
      const actual = this.normalizeOutput(result.stdout);

      if (!actual.includes(token)) {
        this.errors.push(`Program did not echo input token "${token}"`);
      }
    }

    if (runtime.cases) {
      for (const testCase of runtime.cases) {
        const result = this.executeProgram(testCase.input);
        const actual = this.normalizeOutput(result.stdout);

        if (testCase.output instanceof RegExp) {
          if (!testCase.output.test(actual)) {
            this.errors.push(testCase.description || `Runtime output did not match ${testCase.output}`);
          }
        } else if (testCase.output !== undefined) {
          const expected = this.normalizeOutput(testCase.output);
          if (actual !== expected) {
            this.errors.push(testCase.description || `Expected runtime output "${expected}" but got "${actual}"`);
          }
        }
      }
    }
  }

  executeProgram(input = '') {
    if (this.filePath.endsWith('.java')) {
      const className = path.basename(this.filePath, '.java');
      const dir = path.dirname(this.filePath);
      const result = this.runCommand('java', ['-cp', dir, className], {
        input,
        timeout: 5000,
        errorPrefix: 'Execution failed'
      });

      return result;
    }

    if (this.filePath.endsWith('.cpp')) {
      const result = this.runCommand(this.getBinaryPath(), [], {
        input,
        timeout: 5000,
        errorPrefix: 'Execution failed'
      });

      return result;
    }

    return { stdout: '', stderr: '', status: 0 };
  }

  runCommand(command, args, options = {}) {
    const result = spawnSync(command, args, {
      encoding: 'utf8',
      input: options.input ?? undefined,
      timeout: options.timeout ?? undefined
    });

    if (result.error) {
      this.errors.push(`${options.errorPrefix || 'Command failed'}: ${result.error.message}`);
      return { stdout: '', stderr: result.stderr || '', status: result.status ?? 1 };
    }

    if (result.status !== 0) {
      const stderr = this.normalizeOutput(result.stderr || '');
      const message = stderr ? `: ${stderr}` : '';
      this.errors.push(`${options.errorPrefix || 'Command failed'}${message}`);
    }

    return {
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      status: typeof result.status === 'number' ? result.status : 1
    };
  }

  async runJavaScriptSandbox(source = this.content, testCase = {}) {
    const content = source;
    const logs = [];
    const errors = [];
    const prompts = Array.isArray(testCase.prompts) ? [...testCase.prompts] : [];
    const state = {
      fetchCalls: [],
      express: null,
      documentQueries: [],
      alerts: []
    };

    const makeResponse = (payload) => ({
      json: async () => payload
    });

    const fetchStub = async (...args) => {
      state.fetchCalls.push(args);
      return makeResponse(
        typeof testCase.fetchResponse === 'function'
          ? await testCase.fetchResponse(args)
          : testCase.fetchResponse ?? { title: 'Mock title', id: 1 }
      );
    };

    const expressStub = () => {
      const routes = {
        use: [],
        post: [],
        listen: []
      };

      const app = {
        use(handler) {
          routes.use.push(handler);
        },
        post(route, handler) {
          routes.post.push({ route, handler });
        },
        listen(port, handler) {
          routes.listen.push(port);
          if (typeof handler === 'function') {
            handler();
          }
        }
      };

      state.express = {
        app,
        routes,
        jsonMiddleware: expressStub.json()
      };

      return app;
    };

    expressStub.json = () => ({ __middleware: 'express.json' });

    const context = {
      console: {
        log: (...args) => logs.push(args.map((value) => String(value)).join(' ')),
        error: (...args) => errors.push(args.map((value) => String(value)).join(' '))
      },
      prompt: () => (prompts.length ? String(prompts.shift()) : ''),
      fetch: fetchStub,
      require: (name) => {
        if (name === 'express') {
          return expressStub;
        }

        throw new Error(`Unsupported module: ${name}`);
      },
      alert: (value) => state.alerts.push(String(value)),
      document: {
        querySelector: (selector) => {
          state.documentQueries.push(selector);

          if (selector === '#btn') {
            return {
              addEventListener: (eventName, handler) => {
                state.documentListener = { selector, eventName, handler };
              }
            };
          }

          return null;
        }
      },
      Math: Object.assign(Object.create(Math), {
        random: () => (typeof testCase.random === 'number' ? testCase.random : 0.5)
      }),
      module: { exports: {} },
      exports: {},
      setTimeout,
      clearTimeout,
      setImmediate,
      clearImmediate,
      Promise,
      Buffer
    };

    context.global = context;
    context.globalThis = context;

    const sandbox = vm.createContext(context);
    const unhandledRejections = [];
    const uncaughtExceptions = [];
    const onUnhandledRejection = (reason) => {
      unhandledRejections.push(reason instanceof Error ? reason : new Error(String(reason)));
    };
    const onUncaughtException = (error) => {
      uncaughtExceptions.push(error instanceof Error ? error : new Error(String(error)));
    };

    try {
      process.on('unhandledRejection', onUnhandledRejection);
      process.on('uncaughtException', onUncaughtException);
      const script = new vm.Script(content, { filename: this.filePath });
      script.runInContext(sandbox, { timeout: 5000 });

      if (typeof testCase.awaitMs === 'number' && testCase.awaitMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, testCase.awaitMs));
      } else {
        await new Promise((resolve) => setImmediate(resolve));
      }
    } catch (error) {
      errors.push(error.message);
    } finally {
      process.off('unhandledRejection', onUnhandledRejection);
      process.off('uncaughtException', onUncaughtException);
    }

    for (const error of unhandledRejections.concat(uncaughtExceptions)) {
      errors.push(error.message);
    }

    return {
      logs,
      errors,
      state,
      context: sandbox
    };
  }

  async runPythonScript(testCase = {}) {
    const pythonBinary = process.platform === 'win32' ? 'python' : 'python3';
    const wrapper = `
import json, runpy, sys, types, io, contextlib, os, tempfile

file_path = sys.argv[1]
config = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}

stdout = io.StringIO()
stderr = io.StringIO()
state = {"inputs": [], "writes": [], "fetch_calls": [], "routes": [], "files": [], "alerts": []}

inputs = list(config.get("inputs", []))
def fake_input(prompt=""):
    state["inputs"].append(prompt)
    if inputs:
        return str(inputs.pop(0))
    return ""

class FakeResponse:
    def __init__(self, text="", json_data=None, status_code=200):
        self.text = text
        self._json = json_data or {}
        self.status_code = status_code
    def json(self):
        return self._json
    def raise_for_status(self):
        return None

def fake_get(url, *args, **kwargs):
    state["fetch_calls"].append(["GET", url])
    payload = config.get("requests_html", "<html><body><div class='item'><h2>Mock title</h2><p>Mock description</p></div></body></html>")
    return FakeResponse(text=payload)

class FakeCursor:
    def execute(self, *args, **kwargs):
        state["writes"].append(["sql", args[0] if args else ""])
    def fetchall(self):
        return []
    def close(self):
        return None

class FakeConnection:
    def cursor(self):
        return FakeCursor()
    def commit(self):
        return None
    def close(self):
        return None

requests_mod = types.SimpleNamespace(get=fake_get, post=lambda *a, **k: FakeResponse(json_data={"ok": True}), put=lambda *a, **k: FakeResponse(json_data={"ok": True}), delete=lambda *a, **k: FakeResponse(json_data={"ok": True}))

class FakeSoup:
    def __init__(self, html, parser):
        self.html = html
    def find_all(self, tag=None, class_=None):
        import re
        if tag == "article" or tag is None:
            return [types.SimpleNamespace(
                get_text=lambda sep=" ", strip=False, _txt=m.group(0): re.sub(r"<[^>]+>", " ", _txt).replace("  ", " ").strip(),
                find=lambda name=None, **kwargs: types.SimpleNamespace(get_text=lambda sep=" ", strip=False, _txt=re.search(r"<%s[^>]*>(.*?)</%s>" % (name or "h2", name or "h2"), m.group(0), re.S).group(1).strip() if re.search(r"<%s[^>]*>(.*?)</%s>" % (name or "h2", name or "h2"), m.group(0), re.S) else ""),
                select_one=lambda selector: types.SimpleNamespace(get_text=lambda sep=" ", strip=False, _txt=m.group(0): re.sub(r"<[^>]+>", " ", _txt).strip())
            ) for m in re.finditer(r"<article[^>]*>(.*?)</article>", self.html, re.S)]
        return []
    def select(self, selector):
        return self.find_all("article")
    def find(self, *args, **kwargs):
        items = self.find_all(*args, **kwargs)
        return items[0] if items else None

bs4_mod = types.SimpleNamespace(BeautifulSoup=FakeSoup)

class FakeFlaskApp:
    def __init__(self, name):
        self.name = name
        self.routes = []
    def route(self, rule, methods=None):
        def decorator(fn):
            self.routes.append({"rule": rule, "methods": methods or ["GET"], "handler": fn})
            state["routes"].append({"rule": rule, "methods": methods or ["GET"]})
            return fn
        return decorator
    def test_client(self):
        app = self
        class Client:
            def open(self, rule, method="GET", json=None):
                for route in app.routes:
                    if route["rule"] == rule and method in route["methods"]:
                        globals()["request"] = types.SimpleNamespace(json=json, get_json=lambda: json)
                        result = route["handler"]()
                        if isinstance(result, tuple):
                            body, status = result
                        else:
                            body, status = result, 200
                        return types.SimpleNamespace(status_code=status, data=str(body).encode())
                return types.SimpleNamespace(status_code=404, data=b"")
            def get(self, rule):
                return self.open(rule, "GET")
            def post(self, rule, json=None):
                return self.open(rule, "POST", json=json)
            def put(self, rule, json=None):
                return self.open(rule, "PUT", json=json)
            def delete(self, rule):
                return self.open(rule, "DELETE")
        return Client()
    def run(self, *args, **kwargs):
        return None

flask_mod = types.SimpleNamespace(Flask=FakeFlaskApp, jsonify=lambda *a, **k: a[0] if a else k, request=types.SimpleNamespace())

def fake_import(name, *args, **kwargs):
    if name == "requests":
        return requests_mod
    if name == "bs4":
        return bs4_mod
    if name == "flask":
        return flask_mod
    if name == "csv":
        return __import__("csv")
    if name == "os":
        return __import__("os")
    return original_import(name, *args, **kwargs)

import builtins
original_import = builtins.__import__
original_open = builtins.open

def fake_open(file, mode="r", *args, **kwargs):
    if any(flag in mode for flag in ("w", "a", "x", "+")):
        state["files"].append(str(file))
    return original_open(file, mode, *args, **kwargs)

builtins.__import__ = fake_import
builtins.input = fake_input
builtins.open = fake_open
sys.modules["requests"] = requests_mod
sys.modules["bs4"] = bs4_mod
sys.modules["flask"] = flask_mod

try:
    with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
        result = runpy.run_path(file_path, run_name="__main__")

    call_name = config.get("call")
    call_args = config.get("call_args", [])
    call_result = None
    if call_name and call_name in result and callable(result[call_name]):
        call_result = result[call_name](*call_args)
        call_result = repr(call_result)

    globals_summary = sorted([name for name in result.keys() if not name.startswith("__")])
except Exception as exc:
    print(json.dumps({"error": str(exc), "stdout": stdout.getvalue(), "stderr": stderr.getvalue(), "state": state}))
    sys.exit(2)
finally:
    builtins.__import__ = original_import
    builtins.open = original_open

print(json.dumps({"stdout": stdout.getvalue(), "stderr": stderr.getvalue(), "state": state, "globals": globals_summary, "call_result": call_result}))
`;

    const result = spawnSync(pythonBinary, ['-c', wrapper, this.filePath, JSON.stringify(testCase)], {
      encoding: 'utf8',
      timeout: testCase.timeout ?? 10000
    });

    if (result.error) {
      return { stdout: '', stderr: result.error.message, status: 1, parsed: null };
    }

    let parsed = null;
    const stdout = result.stdout || '';
    const lastLine = stdout.trim().split(/\r?\n/).pop();
    if (lastLine) {
      try {
        parsed = JSON.parse(lastLine);
      } catch {
        parsed = null;
      }
    }

    return {
      stdout,
      stderr: result.stderr || '',
      status: typeof result.status === 'number' ? result.status : 1,
      parsed
    };
  }

  normalizeOutput(output) {
    return String(output).replace(/\r\n/g, '\n').trim();
  }

  getBinaryPath() {
    const tempDir = this.ensureTempDir();
    const baseName = path.basename(this.filePath, path.extname(this.filePath));
    return path.join(tempDir, `${baseName}${process.platform === 'win32' ? '.exe' : ''}`);
  }

  getJavaClassFiles() {
    const dir = path.dirname(this.filePath);
    const baseName = path.basename(this.filePath, '.java');

    if (!fs.existsSync(dir)) {
      return [];
    }

    return fs
      .readdirSync(dir)
      .filter((entry) => entry.startsWith(baseName) && entry.endsWith('.class'))
      .map((entry) => path.join(dir, entry));
  }

  ensureTempDir() {
    if (!this.tempDir) {
      this.tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'awesome-for-beginners-'));
    }

    return this.tempDir;
  }

  cleanupArtifacts() {
    for (const artifact of this.artifacts) {
      try {
        if (fs.existsSync(artifact)) {
          fs.unlinkSync(artifact);
        }
      } catch (error) {
        this.errors.push(`Cleanup failed for ${artifact}: ${error.message}`);
      }
    }

    if (this.tempDir) {
      try {
        fs.rmSync(this.tempDir, { recursive: true, force: true });
      } catch (error) {
        this.errors.push(`Cleanup failed for ${this.tempDir}: ${error.message}`);
      }
    }
  }

  getErrors() {
    return this.errors;
  }
}

module.exports = ExerciseValidator;
