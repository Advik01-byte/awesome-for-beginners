// Complete exercise specifications with exact requirements
const specs = {
  // ========== HTML ==========
  'exercises/html/Beginner/Exercise_1.html': {
    language: 'html',
    tests: [
      { check: 'hasDoctype', regex: /<!DOCTYPE\s+html\s*>/i, error: 'Missing or incorrect DOCTYPE' },
      { check: 'hasHtmlTag', regex: /<html[^>]*>[\s\S]*<\/html>/i, error: 'Missing <html> tags' },
      { check: 'hasHeadTag', regex: /<head[^>]*>[\s\S]*<\/head>/i, error: 'Missing <head> tags' },
      { check: 'hasBodyTag', regex: /<body[^>]*>[\s\S]*<\/body>/i, error: 'Missing <body> tags' },
      { check: 'hasTitleTag', regex: /<title[^>]*>[\s\S]*<\/title>/i, error: 'Missing <title> tag' },
      { check: 'hasH1Tag', regex: /<h1[^>]*>[\s\S]*<\/h1>/i, error: 'Missing <h1> closing tag' },
      { check: 'hasPTag', regex: /<p[^>]*>[\s\S]*<\/p>/i, error: 'Missing <p> closing tag' },
      { check: 'noHeadClosingBug', fn: (content) => !/<head>[\s\S]*<head>/i.test(content), error: 'Has duplicate <head> tag instead of closing </head>' },
      { check: 'balancedTags', fn: (content) => {
        const opens = (content.match(/<(\w+)/g) || []).length;
        const closes = (content.match(/<\/(\w+)>/g) || []).length;
        return opens === closes;
      }, error: 'Mismatched opening/closing tags' }
    ]
  },
  
  'exercises/html/Beginner/Exercise_2.html': {
    language: 'html',
    tests: [
      { check: 'hasDoctype', regex: /<!DOCTYPE\s+html\s*>/i, error: 'Missing DOCTYPE' },
      { check: 'hasImg', regex: /<img[^>]*src=["'][^"']*logo[^"']*["'][^>]*alt=/i, error: 'Missing or incorrect <img> tag with alt attribute' },
      { check: 'hasLink', regex: /<a[^>]*href\s*=\s*["']https?:\/\//i, error: 'Link must start with http:// or https://' },
      { check: 'noWwwWithoutProtocol', fn: (content) => !/<a[^>]*href\s*=\s*["']www\./i.test(content), error: 'Link has www. without http:// protocol' }
    ]
  },
  
  'exercises/html/Intermediate/Exercise_1.html': {
    language: 'html',
    tests: [
      { check: 'hasForm', regex: /<form[^>]*>/i, error: 'Missing <form> tag' },
      { check: 'hasInput', regex: /<input[^>]*type\s*=\s*["']text["']/i, error: 'Missing text input' },
      { check: 'inputHasName', regex: /<input[^>]*name\s*=\s*["']email["']/i, error: 'Input must have name="email"' },
      { check: 'inputHasRequired', regex: /<input[^>]*type\s*=\s*["']text["'][^>]*required/i, error: 'Input must have required attribute' },
      { check: 'hasSubmit', regex: /<input[^>]*type\s*=\s*["']submit["']/i, error: 'Missing submit button' }
    ]
  },
  
  'exercises/html/Intermediate/Exercise_2.html': {
    language: 'html',
    tests: [
      { check: 'hasSection', regex: /<section[^>]*>/i, error: 'Missing <section> tag' },
      { check: 'noSectionInP', fn: (content) => !/<p[^>]*>[\s\S]*<section/i.test(content), error: '<section> cannot be inside <p> tag (invalid nesting)' },
      { check: 'hasH2', regex: /<h2[^>]*>[\s\S]*<\/h2>/i, error: 'Missing <h2> tag' }
    ]
  },
  
  'exercises/html/Advanced/Exercise_1.html': {
    language: 'html',
    tests: [
      { check: 'hasButton', regex: /<button[^>]*id\s*=\s*["']btn["']/i, error: 'Missing button with id="btn"' },
      { check: 'hasScript', regex: /<script[^>]*>[\s\S]*<\/script>/i, error: 'Missing <script> tag' },
      { check: 'correctSelector', regex: /querySelector\s*\(\s*['"]#btn['"]\s*\)/i, error: 'Script must use querySelector("#btn") - note: id is "btn" not "button"' }
    ]
  },
  
  'exercises/html/Advanced/Exercise_2.html': {
    language: 'html',
    tests: [
      { check: 'hasLink', regex: /<link[^>]*rel\s*=\s*["']stylesheet["']/i, error: 'Missing stylesheet link' },
      { check: 'hasViewportMeta', regex: /<meta[^>]*name\s*=\s*["']viewport["']/i, error: 'Missing viewport meta tag' },
      { check: 'correctViewportContent', fn: (content) => /content\s*=\s*["'].*width\s*=\s*device-width/i.test(content), error: 'Viewport meta content incorrect - should contain "width=device-width"' }
    ]
  },
  
  // ========== CSS ==========
  'exercises/css/Beginner/Exercise_1.css': {
    language: 'css',
    tests: [
      { check: 'hasColorProperty', regex: /color\s*:\s*#333/i, error: 'Missing "color: #333;" property' },
      { check: 'noColourSpelling', fn: (content) => !content.includes('colour:'), error: 'Found "colour:" - must be "color:" (American English)' },
      { check: 'hasFontSize', regex: /font-size\s*:\s*16px/i, error: 'Missing "font-size: 16px;"' },
      { check: 'balancedBraces', fn: (content) => (content.match(/{/g) || []).length === (content.match(/}/g) || []).length, error: 'Mismatched curly braces' }
    ]
  },
  
  'exercises/css/Beginner/Exercise_2.css': {
    language: 'css',
    tests: [
      { check: 'hasClassSelector', regex: /\.title\s*{[\s\S]*color\s*:\s*red/i, error: 'Missing .title selector with color: red' },
      { check: 'hasIdSelector', regex: /#title\s*{[\s\S]*color\s*:\s*blue/i, error: 'Missing #title selector with color: blue' }
    ]
  },
  
  'exercises/css/Intermediate/Exercise_1.css': {
    language: 'css',
    tests: [
      { check: 'hasFlexDisplay', regex: /display\s*:\s*flex/i, error: 'Missing "display: flex;" - this is a flexbox exercise' },
      { check: 'noBlockDisplay', fn: (content) => !content.includes('display: block'), error: 'Should use "display: flex" not "display: block"' }
    ]
  },
  
  'exercises/css/Intermediate/Exercise_2.css': {
    language: 'css',
    tests: [
      { check: 'hasMediaQuery', regex: /@media\s+screen\s+and\s*\(\s*max-width\s*:\s*600px\s*\)/i, error: 'Missing or incorrect media query' },
      { check: 'correctWidth', fn: (content) => {
        // Should have width: 100% NOT width: 100vw
        const inMedia = content.match(/@media[\s\S]*?}/);
        return inMedia && inMedia[0].includes('width: 100%') && !inMedia[0].includes('100vw');
      }, error: 'Inside media query, use "width: 100%" not "width: 100vw"' }
    ]
  },
  
  'exercises/css/Advanced/Exercise_1.css': {
    language: 'css',
    tests: [
      { check: 'hasGridDisplay', regex: /display\s*:\s*grid/i, error: 'Missing "display: grid;"' },
      { check: 'hasGridTemplate', regex: /grid-template-(columns|rows)/i, error: 'Missing grid-template-columns or grid-template-rows' }
    ]
  },
  
  'exercises/css/Advanced/Exercise_2.css': {
    language: 'css',
    tests: [
      { check: 'hasKeyframes', regex: /@keyframes/i, error: 'Missing @keyframes animation' },
      { check: 'hasAnimation', regex: /animation\s*:\s*\w+/i, error: 'Missing animation property on element' }
    ]
  },
  
  // ========== JAVASCRIPT ==========
  'exercises/javascript/Beginner/Exercise_1.js': {
    language: 'javascript',
    tests: [
      { check: 'noConsoleTypo', fn: (content) => !content.includes('consol'), error: 'Typo: "consol" should be "console"' },
      { check: 'hasFirstLog', regex: /console\.log\s*\(\s*["']Hello,\s*World!["']\s*\)/i, error: 'Must print "Hello, World!" using console.log()' },
      { check: 'hasSecondLog', regex: /console\.log\s*\([^)]*Welcome[^)]*\+\s*\w+/i, error: 'Second log must concatenate "Welcome" with variable' }
    ]
  },
  
  'exercises/javascript/Beginner/Exercise_2.js': {
    language: 'javascript',
    tests: [
      { check: 'usesParseInt', regex: /parseInt/i, error: 'Must use parseInt() to convert string to number' },
      { check: 'noStringConcatenation', fn: (content) => {
        const hasPrompt = content.includes('prompt');
        const hasParseInt = content.includes('parseInt');
        const sumLine = content.match(/const\s+sum\s*=\s*a\s*\+\s*b/);
        return !hasPrompt || (hasPrompt && hasParseInt);
      }, error: 'With prompt(), must use parseInt() to get numbers, not strings' }
    ]
  },
  
  'exercises/javascript/Intermediate/Exercise_1.js': {
    language: 'javascript',
    tests: [
      { check: 'hasFactorialFunction', regex: /function\s+factorial\s*\(/i, error: 'Missing factorial() function' },
      { check: 'hasBaseCase0', regex: /if\s*\(\s*n\s*===\s*0\s*\)/i, error: 'Must handle base case: n === 0' },
      { check: 'handlesZero', fn: (content) => {
        try {
          const func = new Function(`
            ${content}
            return factorial(0);
          `);
          return func() === 1;
        } catch {
          return false;
        }
      }, error: 'factorial(0) should return 1' }
    ]
  },
  
  'exercises/javascript/Intermediate/Exercise_2.js': {
    language: 'javascript',
    tests: [
      { check: 'noAssignmentOp', fn: (content) => !content.includes('if (user = comp)'), error: 'Bug: using = (assign) instead of === (compare) in if statement' },
      { check: 'hasComparison', regex: /if\s*\(\s*user\s*===\s*comp\s*\)/i, error: 'Must use === for comparison, not =' }
    ]
  },
  
  'exercises/javascript/Advanced/Exercise_1.js': {
    language: 'javascript',
    tests: [
      { check: 'hasAwait', regex: /await/i, error: 'Must use await keyword for async operation' },
      { check: 'usesFetch', regex: /fetch/i, error: 'Must use fetch() to get data' }
    ]
  },
  
  'exercises/javascript/Advanced/Exercise_2.js': {
    language: 'javascript',
    tests: [
      { check: 'requiresExpress', regex: /require\s*\(\s*['"]express['"]\s*\)/i, error: 'Must require("express")' },
      { check: 'hasBodyParser', regex: /app\.use\s*\(\s*express\.json/i, error: 'Must use express.json() middleware' },
      { check: 'hasPostRoute', regex: /app\.post\s*\(/i, error: 'Missing POST route handler' }
    ]
  },
  
  // ========== JAVA ==========
  'exercises/java/Beginner/Exercise_1.java': {
    language: 'java',
    readmePath: 'exercises/java/java_exercises.md',
    needsCompile: true,
    needsRun: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasHelloWorld', regex: /println\s*\(\s*["'].*Hello.*World['"]\s*\)/i, error: 'Must print "Hello, World!"' },
      { check: 'hasPublicClass', regex: /public\s+class\s+Exercise_1/i, error: 'Must have public class Exercise_1' },
      { check: 'hasMainMethod', regex: /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]/i, error: 'Missing main method' }
    ],
    runtime: {
      exactOutput: 'Hello, World!'
    }
  },
  
  'exercises/java/Beginner/Exercise_2.java': {
    language: 'java',
    readmePath: 'exercises/java/java_exercises.md',
    needsCompile: true,
    needsRun: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasInputAPI', regex: /\b(Scanner|BufferedReader|Console)\b/i, error: 'Must read input using Scanner, BufferedReader, or Console' }
    ],
    runtime: {
      echoInput: true
    }
  },
  
  'exercises/java/Intermediate/Exercise_1.java': {
    language: 'java',
    readmePath: 'exercises/java/java_exercises.md',
    needsCompile: true,
    needsRun: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasPalindromeLogic', regex: /\b(reverse|charAt|equalsIgnoreCase|palindrome)\b/i, error: 'Palindrome checker should compare characters or a reversed string' }
    ],
    runtime: {
      cases: [
        { input: 'racecar\n', output: /palindrome|true|yes/i, description: 'racecar should be identified as a palindrome' },
        { input: 'hello\n', output: /not palindrome|false|no/i, description: 'hello should be identified as not a palindrome' }
      ]
    }
  },
  
  'exercises/java/Intermediate/Exercise_2.java': {
    language: 'java',
    readmePath: 'exercises/java/java_exercises.md',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasArrayUsage', regex: /\bnew\s+\w+\s*\[/i, error: 'Array processing exercise should use arrays' },
      { check: 'hasLoop', regex: /\b(for|while)\b/i, error: 'Array processing exercise should use a loop' }
    ]
  },
  
  'exercises/java/Advanced/Exercise_1.java': {
    language: 'java',
    readmePath: 'exercises/java/java_exercises.md',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasThreadingApi', regex: /\b(extends\s+Thread|implements\s+Runnable|new\s+Thread)\b/i, error: 'Multi-threading exercise should use Thread or Runnable' }
    ]
  },
  
  'exercises/java/Advanced/Exercise_2.java': {
    language: 'java',
    readmePath: 'exercises/java/java_exercises.md',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasJdbcApi', regex: /\b(DriverManager|Connection|PreparedStatement|ResultSet)\b/i, error: 'JDBC exercise should use JDBC APIs' }
    ]
  },
  
  // ========== C++ ==========
  'exercises/cpp/Beginner/Exercise_1.cpp': {
    language: 'cpp',
    readmePath: 'exercises/cpp/cpp_exercises.md',
    needsCompile: true,
    needsRun: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasInclude', regex: /#include\s*<iostream>/i, error: 'Missing #include <iostream>' },
      { check: 'hasCout', regex: /std::cout/i, error: 'Must use std::cout to print' },
      { check: 'noNumbersOnly', fn: (content) => !content.match(/cout\s*<<\s*\d+/), error: 'Should print text "Hello, World!" not numbers' }
    ],
    runtime: {
      exactOutput: 'Hello, World!'
    }
  },
  
  'exercises/cpp/Beginner/Exercise_2.cpp': {
    language: 'cpp',
    readmePath: 'exercises/cpp/cpp_exercises.md',
    needsCompile: true,
    needsRun: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasInputAPI', regex: /\b(cin|getline|scanf)\b/i, error: 'Simple I/O should read from input' }
    ],
    runtime: {
      echoInput: true
    }
  },
  
  'exercises/cpp/Intermediate/Exercise_1.cpp': {
    language: 'cpp',
    readmePath: 'exercises/cpp/cpp_exercises.md',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasGuessingLogic', regex: /\b(random|rand|srand|guess|cin|cout)\b/i, error: 'Guess-the-number exercise should use input/output and random or guess logic' }
    ]
  },
  
  'exercises/cpp/Intermediate/Exercise_2.cpp': {
    language: 'cpp',
    readmePath: 'exercises/cpp/cpp_exercises.md',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasVectorUsage', regex: /\bstd::vector\b/i, error: 'Vectors & Loops exercise should use std::vector' },
      { check: 'hasLoop', regex: /\b(for|while)\b/i, error: 'Vectors & Loops exercise should use a loop' }
    ]
  },
  
  'exercises/cpp/Advanced/Exercise_1.cpp': {
    language: 'cpp',
    readmePath: 'exercises/cpp/cpp_exercises.md',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasFstream', regex: /\b(fstream|ifstream|ofstream)\b/i, error: 'File handling exercise should use file stream APIs' }
    ]
  },
  
  'exercises/cpp/Advanced/Exercise_2.cpp': {
    language: 'cpp',
    readmePath: 'exercises/cpp/cpp_exercises.md',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasPointerUsage', regex: /\b(new|delete|nullptr|\*)\b/i, error: 'Pointers & Memory exercise should use pointers or dynamic memory' }
    ]
  }
};

specs['exercises/python/Beginner/Exercise_1.py'] = {
  language: 'python',
  readmePath: 'exercises/python/python_exercises.md',
  tests: [
    { check: 'notEmpty', fn: (content) => content.trim().length > 0, error: 'Exercise file is empty' },
    { check: 'hasHelloWorld', regex: /Hello,\s*World!/i, error: 'Must print "Hello, World!"' },
    { check: 'usesNameVariable', regex: /\bname\b/i, error: 'Must store the name in a variable' }
  ],
  runtime: async (validator) => {
    const result = await validator.runPythonScript({
      timeout: 10000
    });
    const output = validator.normalizeOutput(result.parsed ? result.parsed.stdout : result.stdout);
    const lines = output.split('\n').map((line) => line.trim()).filter(Boolean);

    if (!lines.some((line) => /Hello,\s*World!/i.test(line))) {
      validator.errors.push('Must print "Hello, World!"');
    }

    if (!lines.some((line) => /^(Hello|Hi|Welcome)[, ]+\w+/i.test(line))) {
      validator.errors.push('Must print a personalized greeting using a name variable');
    }
  }
};

specs['exercises/python/Beginner/Exercise_2.py'] = {
  language: 'python',
  readmePath: 'exercises/python/python_exercises.md',
  tests: [
    { check: 'notEmpty', fn: (content) => content.trim().length > 0, error: 'Exercise file is empty' },
    { check: 'hasInput', regex: /\binput\s*\(/i, error: 'Must read two numbers from input' }
  ],
  runtime: async (validator) => {
    const cases = [
      { a: 5 + Math.floor(Math.random() * 10), b: 2 + Math.floor(Math.random() * 5) },
      { a: 12 + Math.floor(Math.random() * 10), b: 3 + Math.floor(Math.random() * 5) }
    ];

    for (const testCase of cases) {
      const result = await validator.runPythonScript({
        inputs: [String(testCase.a), String(testCase.b)],
        timeout: 10000
      });
      const output = validator.normalizeOutput(result.parsed ? result.parsed.stdout : result.stdout);
      const lines = output.split('\n').map((line) => line.trim()).filter(Boolean);

      const expected = [
        String(testCase.a + testCase.b),
        String(testCase.a - testCase.b),
        String(testCase.a * testCase.b),
        String(testCase.a / testCase.b)
      ];

      const found = expected.every((value) => lines.some((line) => line.includes(value)));

      if (!found) {
        validator.errors.push(`Calculator output is incorrect for inputs ${testCase.a}, ${testCase.b}`);
      }
    }
  }
};

specs['exercises/python/Intermediate/Exercise_1.py'] = {
  language: 'python',
  readmePath: 'exercises/python/python_exercises.md',
  tests: [
    { check: 'notEmpty', fn: (content) => content.trim().length > 0, error: 'Exercise file is empty' },
    { check: 'hasFactorial', regex: /\bfactorial\b/i, error: 'Must define a factorial function' }
  ],
  runtime: async (validator) => {
    const zeroCase = await validator.runPythonScript({
      call: 'factorial',
      call_args: [0],
      timeout: 10000
    });
    const fiveCase = await validator.runPythonScript({
      call: 'factorial',
      call_args: [5],
      timeout: 10000
    });

    if (zeroCase.parsed && zeroCase.parsed.call_result && zeroCase.parsed.call_result !== '1') {
      validator.errors.push('factorial(0) should produce 1');
    }

    if (fiveCase.parsed && fiveCase.parsed.call_result && fiveCase.parsed.call_result !== '120') {
      validator.errors.push('factorial(5) should produce 120');
    }

    const zeroOutput = validator.normalizeOutput(zeroCase.parsed ? zeroCase.parsed.stdout : zeroCase.stdout);
    const fiveOutput = validator.normalizeOutput(fiveCase.parsed ? fiveCase.parsed.stdout : fiveCase.stdout);

    if (zeroOutput && !/\b1\b/.test(zeroOutput)) {
      validator.errors.push('factorial(0) should produce 1');
    }

    if (fiveOutput && !/\b120\b/.test(fiveOutput)) {
      validator.errors.push('factorial(5) should produce 120');
    }
  }
};

specs['exercises/python/Intermediate/Exercise_2.py'] = {
  language: 'python',
  readmePath: 'exercises/python/python_exercises.md',
  tests: [
    { check: 'notEmpty', fn: (content) => content.trim().length > 0, error: 'Exercise file is empty' },
    { check: 'hasGameLogic', regex: /rock|paper|scissors/i, error: 'Must implement Rock, Paper, Scissors logic' }
  ],
  runtime: async (validator) => {
    const rounds = [
      { choice: 'rock', random: 0.9, expected: /You win|Win/i },
      { choice: 'paper', random: 0.1, expected: /You win|Win/i },
      { choice: 'scissors', random: 0.5, expected: /Tie/i }
    ];

    for (const round of rounds) {
      const result = await validator.runPythonScript({
        inputs: [round.choice],
        timeout: 10000,
        random: round.random
      });
      const output = validator.normalizeOutput(result.parsed ? result.parsed.stdout : result.stdout);

      if (!round.expected.test(output)) {
        validator.errors.push(`Rock, Paper, Scissors output is incorrect for user choice "${round.choice}"`);
      }
    }
  }
};

specs['exercises/python/Advanced/Exercise_1.py'] = {
  language: 'python',
  readmePath: 'exercises/python/python_exercises.md',
  tests: [
    { check: 'notEmpty', fn: (content) => content.trim().length > 0, error: 'Exercise file is empty' },
    { check: 'usesRequests', regex: /\brequests\b/i, error: 'Must use requests' },
    { check: 'usesBeautifulSoup', regex: /\bBeautifulSoup\b/i, error: 'Must use BeautifulSoup' },
    { check: 'writesCsv', regex: /\bcsv\b/i, error: 'Must write extracted results to CSV' }
  ],
  runtime: async (validator) => {
    const token = `scrape-${Math.random().toString(16).slice(2)}`;
    const result = await validator.runPythonScript({
      timeout: 10000,
      requests_html: `<html><body><article class='item'><h2>${token}</h2><p>Mock description</p></article></body></html>`
    });
    const output = validator.normalizeOutput(result.parsed ? result.parsed.stdout : result.stdout);
    const state = result.parsed ? result.parsed.state : null;

    if (!output.includes(token) && !(state && state.writes.length) && !(state && state.files.some((file) => file.endsWith('.csv')))) {
      validator.errors.push('Web scraper did not produce output or write CSV data');
    }
  }
};

specs['exercises/python/Advanced/Exercise_2.py'] = {
  language: 'python',
  readmePath: 'exercises/python/python_exercises.md',
  tests: [
    { check: 'notEmpty', fn: (content) => content.trim().length > 0, error: 'Exercise file is empty' },
    { check: 'usesFlask', regex: /\bFlask\b/i, error: 'Must use Flask' }
  ],
  runtime: async (validator) => {
    const result = await validator.runPythonScript({
      timeout: 10000
    });
    const state = result.parsed ? result.parsed.state : null;
    const output = validator.normalizeOutput(result.parsed ? result.parsed.stdout : result.stdout);

    if (!state) {
      validator.errors.push('Could not inspect Flask app behavior');
      return;
    }

    if (!output && !state.routes.length) {
      validator.errors.push('Flask app did not register any routes');
    }

    const routeRules = state.routes.map((route) => `${route.rule}:${(route.methods || []).join(',')}`);
    if (!routeRules.some((rule) => rule.startsWith('/todo') || rule.startsWith('/todos'))) {
      validator.errors.push('Flask app must expose todo CRUD routes');
    }

    const routeMethods = state.routes.flatMap((route) => route.methods || []);
    if (!routeMethods.includes('GET') || !routeMethods.includes('POST')) {
      validator.errors.push('Flask todo API must support at least GET and POST');
    }
  }
};

for (const [filePath, spec] of Object.entries(specs)) {
  if (spec.readmePath) {
    continue;
  }

  if (filePath.startsWith('exercises/html/')) {
    spec.readmePath = 'exercises/html/html_exercises.md';
  } else if (filePath.startsWith('exercises/css/')) {
    spec.readmePath = 'exercises/css/css_exercises.md';
  } else if (filePath.startsWith('exercises/javascript/')) {
    spec.readmePath = 'exercises/javascript/javascript_exercises.md';
  }
}

specs['exercises/javascript/Beginner/Exercise_1.js'].runtime = async (validator) => {
  const result = await validator.runJavaScriptSandbox(undefined, { awaitMs: 10 });
  if (result.errors.length) {
    validator.errors.push(...result.errors);
  }

  if (result.logs[0] !== 'Hello, World!') {
    validator.errors.push('First console.log must print "Hello, World!"');
  }

  if (!result.logs.some((line) => /Welcome\s+Alice/i.test(line))) {
    validator.errors.push('Must print a personalized greeting for Alice');
  }
};

specs['exercises/javascript/Beginner/Exercise_2.js'].runtime = async (validator) => {
  const cases = [
    {
      prompts: [String(2 + Math.floor(Math.random() * 8)), String(3 + Math.floor(Math.random() * 8))],
    },
    {
      prompts: [String(10 + Math.floor(Math.random() * 5)), String(4 + Math.floor(Math.random() * 5))],
    }
  ];

  for (const testCase of cases) {
    const expectedSum = Number(testCase.prompts[0]) + Number(testCase.prompts[1]);
    const result = await validator.runJavaScriptSandbox(undefined, testCase);

    if (result.errors.length) {
      validator.errors.push(...result.errors);
    }

    const output = result.logs.join('\n');
    if (!new RegExp(`Sum is:\\s*${expectedSum}\\b`).test(output)) {
      validator.errors.push(`Calculator output is incorrect for inputs ${testCase.prompts.join(', ')}`);
    }
  }
};

specs['exercises/javascript/Intermediate/Exercise_1.js'].runtime = async (validator) => {
  const result = await validator.runJavaScriptSandbox(undefined, { awaitMs: 10 });

  if (result.errors.length) {
    validator.errors.push(...result.errors);
  }

  const factorial = result.context.factorial;
  if (typeof factorial !== 'function') {
    validator.errors.push('factorial() must be defined as a function');
    return;
  }

  if (factorial(0) !== 1) {
    validator.errors.push('factorial(0) should return 1');
  }

  if (factorial(5) !== 120) {
    validator.errors.push('factorial(5) should return 120');
  }
};

specs['exercises/javascript/Intermediate/Exercise_2.js'].runtime = async (validator) => {
  const cases = [
    { prompts: ['rock'], random: 0.9, expected: /You win/i },
    { prompts: ['paper'], random: 0.1, expected: /You win/i },
    { prompts: ['scissors'], random: 0.5, expected: /Tie/i }
  ];

  for (const testCase of cases) {
    const result = await validator.runJavaScriptSandbox(undefined, testCase);

    if (result.errors.length) {
      validator.errors.push(...result.errors);
    }

    const output = result.logs.join('\n');
    if (!testCase.expected.test(output)) {
      validator.errors.push(`Rock, Paper, Scissors output is incorrect for input "${testCase.prompts[0]}"`);
    }
  }
};

specs['exercises/javascript/Advanced/Exercise_1.js'].runtime = async (validator) => {
  const token = `mock-title-${Math.random().toString(16).slice(2)}`;
  const result = await validator.runJavaScriptSandbox(undefined, {
    fetchResponse: { title: token, id: 1 },
    awaitMs: 20
  });

  if (result.errors.length) {
    validator.errors.push(...result.errors);
  }

  if (!result.logs.some((line) => line.includes(token))) {
    validator.errors.push('Fetch exercise must log the fetched JSON title');
  }
};

specs['exercises/javascript/Advanced/Exercise_2.js'].runtime = async (validator) => {
  const result = await validator.runJavaScriptSandbox(undefined, { awaitMs: 10 });

  if (result.errors.length) {
    validator.errors.push(...result.errors);
  }

  if (!result.state.express) {
    validator.errors.push('Express app was not created');
    return;
  }

  const postRoute = result.state.express.routes.post.find((entry) => entry.route === '/todo');
  if (!postRoute) {
    validator.errors.push('POST /todo route was not registered');
    return;
  }

  let sent = null;
  postRoute.handler({ body: { title: 'Task' } }, { send: (value) => { sent = value; } });

  if (sent !== 'ok') {
    validator.errors.push('POST /todo route must send "ok"');
  }
};

specs['exercises/html/Beginner/Exercise_1.html'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  const checks = [
    /<!DOCTYPE\s+html\s*>/i.test(content),
    /<html[^>]*>[\s\S]*<\/html>/i.test(content),
    /<head[^>]*>[\s\S]*<\/head>/i.test(content),
    /<body[^>]*>[\s\S]*<\/body>/i.test(content),
    /<h1[^>]*>[\s\S]*<\/h1>/i.test(content),
    /<p[^>]*>[\s\S]*<\/p>/i.test(content)
  ];

  if (checks.some((check) => !check)) {
    validator.errors.push('HTML structure is incomplete');
  }

  const headCount = (content.match(/<head\b/gi) || []).length;
  const closeHeadCount = (content.match(/<\/head>/gi) || []).length;
  if (headCount !== closeHeadCount || /<head>[\s\S]*<head>/i.test(content)) {
    validator.errors.push('Head tag must be properly opened and closed exactly once');
  }
};

specs['exercises/html/Beginner/Exercise_2.html'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/<img[^>]*src=["'][^"']*logo[^"']*["'][^>]*alt=/i.test(content)) {
    validator.errors.push('Image tag must include logo image and alt text');
  }
  if (!/<a[^>]*href\s*=\s*["']https?:\/\//i.test(content)) {
    validator.errors.push('Link must use an http:// or https:// URL');
  }
};

specs['exercises/html/Intermediate/Exercise_1.html'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/<form[^>]*>/i.test(content) || !/<input[^>]*type\s*=\s*["']text["']/i.test(content) || !/<input[^>]*name\s*=\s*["']email["']/i.test(content) || !/<input[^>]*required/i.test(content)) {
    validator.errors.push('Form validation markup is incomplete');
  }
};

specs['exercises/html/Intermediate/Exercise_2.html'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/<section[^>]*>/i.test(content) || /<p[^>]*>[\s\S]*<section/i.test(content) || !/<h2[^>]*>[\s\S]*<\/h2>/i.test(content)) {
    validator.errors.push('Semantic HTML nesting is incorrect');
  }
};

specs['exercises/html/Advanced/Exercise_1.html'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

  if (!scriptMatch) {
    validator.errors.push('Missing script block');
    return;
  }

  const result = await validator.runJavaScriptSandbox(scriptMatch[1], { awaitMs: 10 });

  if (result.errors.length) {
    validator.errors.push(...result.errors);
  }

  if (!result.state.documentQueries.includes('#btn')) {
    validator.errors.push('Script must query the #btn element');
  }

  if (!result.state.documentListener || result.state.documentListener.eventName !== 'click') {
    validator.errors.push('Click handler was not attached to the button');
  }
};

specs['exercises/html/Advanced/Exercise_2.html'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/<link[^>]*rel\s*=\s*["']stylesheet["']/i.test(content)) {
    validator.errors.push('Stylesheet link is missing');
  }
  if (!/<meta[^>]*name\s*=\s*["']viewport["']/i.test(content) || !/width\s*=\s*device-width/i.test(content)) {
    validator.errors.push('Viewport meta tag is incorrect');
  }
};

specs['exercises/css/Beginner/Exercise_1.css'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/color\s*:\s*#333/i.test(content) || /colour:/i.test(content) || !/font-size\s*:\s*16px/i.test(content)) {
    validator.errors.push('Base styling properties are incorrect');
  }
};

specs['exercises/css/Beginner/Exercise_2.css'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/\.title\s*{[\s\S]*color\s*:\s*red/i.test(content) || !/#title\s*{[\s\S]*color\s*:\s*blue/i.test(content)) {
    validator.errors.push('Specificity exercise rules are incomplete');
    return;
  }

  const titleRuleIndex = content.indexOf('.title');
  const idRuleIndex = content.indexOf('#title');
  if (idRuleIndex < titleRuleIndex) {
    validator.errors.push('#title rule must come after .title rule in this exercise');
  }
};

specs['exercises/css/Intermediate/Exercise_1.css'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/display\s*:\s*flex/i.test(content) || /display\s*:\s*block/i.test(content)) {
    validator.errors.push('Flexbox container must use display: flex');
  }
};

specs['exercises/css/Intermediate/Exercise_2.css'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/@media\s+screen\s+and\s*\(\s*max-width\s*:\s*600px\s*\)/i.test(content) || !/width\s*:\s*100%\b/i.test(content) || /100vw/i.test(content)) {
    validator.errors.push('Responsive media query must use width: 100% at max-width 600px');
  }
};

specs['exercises/css/Advanced/Exercise_1.css'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/display\s*:\s*grid/i.test(content) || !/grid-template-(columns|rows)/i.test(content) || !/grid-area\s*:\s*header/i.test(content) || !/grid-area\s*:\s*content/i.test(content)) {
    validator.errors.push('Grid placement rules are incomplete');
  }
};

specs['exercises/css/Advanced/Exercise_2.css'].runtime = async (validator) => {
  const content = validator.scannedContent ?? validator.content;
  if (!/@keyframes/i.test(content) || !/animation\s*:\s*[a-z-]+\s+\d+s/i.test(content)) {
    validator.errors.push('Animation declarations are incomplete');
  }
};

specs['exercises/java/Beginner/Exercise_1.java'].runtime = async (validator) => {
  const result = validator.executeProgram();
  if (validator.normalizeOutput(result.stdout) !== 'Hello, World!') {
    validator.errors.push('Java Hello World must print exactly "Hello, World!"');
  }
};

specs['exercises/java/Beginner/Exercise_2.java'].runtime = async (validator) => {
  const token = `java-io-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const result = validator.executeProgram(`${token}\n`);
  if (!validator.normalizeOutput(result.stdout).includes(token)) {
    validator.errors.push('Java simple I/O must read and print the provided input');
  }
};

specs['exercises/java/Intermediate/Exercise_1.java'].runtime = async (validator) => {
  const positive = validator.executeProgram('racecar\n');
  const negative = validator.executeProgram('hello\n');
  const positiveOut = validator.normalizeOutput(positive.stdout);
  const negativeOut = validator.normalizeOutput(negative.stdout);

  if (!/palindrome|true|yes/i.test(positiveOut)) {
    validator.errors.push('Palindrome checker must identify racecar as a palindrome');
  }

  if (!/not palindrome|false|no/i.test(negativeOut)) {
    validator.errors.push('Palindrome checker must identify hello as not a palindrome');
  }
};

specs['exercises/java/Intermediate/Exercise_2.java'].runtime = async (validator) => {
  const result = validator.executeProgram();
  if (!validator.normalizeOutput(result.stdout)) {
    validator.errors.push('Array processing exercise should produce observable output');
  }
};

specs['exercises/java/Advanced/Exercise_1.java'].runtime = async (validator) => {
  const result = validator.executeProgram();
  if (!validator.normalizeOutput(result.stdout)) {
    validator.errors.push('Multi-threading exercise should produce observable output');
  }
};

specs['exercises/java/Advanced/Exercise_2.java'].runtime = async (validator) => {
  const result = validator.executeProgram();
  if (!validator.normalizeOutput(result.stdout)) {
    validator.errors.push('JDBC exercise should produce observable output or connection handling');
  }
};

specs['exercises/cpp/Beginner/Exercise_1.cpp'].runtime = async (validator) => {
  const result = validator.executeProgram();
  if (validator.normalizeOutput(result.stdout) !== 'Hello, World!') {
    validator.errors.push('C++ Hello World must print exactly "Hello, World!"');
  }
};

specs['exercises/cpp/Beginner/Exercise_2.cpp'].runtime = async (validator) => {
  const token = `cpp-io-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const result = validator.executeProgram(`${token}\n`);
  if (!validator.normalizeOutput(result.stdout).includes(token)) {
    validator.errors.push('C++ simple I/O must read and print the provided input');
  }
};

specs['exercises/cpp/Intermediate/Exercise_1.cpp'].runtime = async (validator) => {
  const result = validator.executeProgram();
  if (!validator.normalizeOutput(result.stdout)) {
    validator.errors.push('Guess-the-number exercise should produce observable output');
  }
};

specs['exercises/cpp/Intermediate/Exercise_2.cpp'].runtime = async (validator) => {
  const result = validator.executeProgram();
  if (!validator.normalizeOutput(result.stdout)) {
    validator.errors.push('Vectors & Loops exercise should produce observable output');
  }
};

specs['exercises/cpp/Advanced/Exercise_1.cpp'].runtime = async (validator) => {
  const result = validator.executeProgram();
  if (!validator.normalizeOutput(result.stdout)) {
    validator.errors.push('File handling exercise should produce observable output');
  }
};

specs['exercises/cpp/Advanced/Exercise_2.cpp'].runtime = async (validator) => {
  const result = validator.executeProgram();
  if (!validator.normalizeOutput(result.stdout)) {
    validator.errors.push('Pointers & Memory exercise should produce observable output');
  }
};

module.exports = specs;
