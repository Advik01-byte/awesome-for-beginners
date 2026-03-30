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
    needsCompile: true,
    needsRun: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasHelloWorld', regex: /println\s*\(\s*["'].*Hello.*World['"]\s*\)/i, error: 'Must print "Hello, World!"' },
      { check: 'hasPublicClass', regex: /public\s+class\s+Exercise_1/i, error: 'Must have public class Exercise_1' },
      { check: 'hasMainMethod', regex: /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]/i, error: 'Missing main method' }
    ],
    expectedOutput: 'Hello, World!'
  },
  
  'exercises/java/Beginner/Exercise_2.java': {
    language: 'java',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  },
  
  'exercises/java/Intermediate/Exercise_1.java': {
    language: 'java',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  },
  
  'exercises/java/Intermediate/Exercise_2.java': {
    language: 'java',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  },
  
  'exercises/java/Advanced/Exercise_1.java': {
    language: 'java',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  },
  
  'exercises/java/Advanced/Exercise_2.java': {
    language: 'java',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  },
  
  // ========== C++ ==========
  'exercises/cpp/Beginner/Exercise_1.cpp': {
    language: 'cpp',
    needsCompile: true,
    needsRun: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' },
      { check: 'hasInclude', regex: /#include\s*<iostream>/i, error: 'Missing #include <iostream>' },
      { check: 'hasCout', regex: /std::cout/i, error: 'Must use std::cout to print' },
      { check: 'noComment', fn: (content) => !content.match(/cout\s*<<\s*\d+/), error: 'Should print text "Hello, World!" not numbers' }
    ],
    expectedOutput: 'Hello, World!'
  },
  
  'exercises/cpp/Beginner/Exercise_2.cpp': {
    language: 'cpp',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  },
  
  'exercises/cpp/Intermediate/Exercise_1.cpp': {
    language: 'cpp',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  },
  
  'exercises/cpp/Intermediate/Exercise_2.cpp': {
    language: 'cpp',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  },
  
  'exercises/cpp/Advanced/Exercise_1.cpp': {
    language: 'cpp',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  },
  
  'exercises/cpp/Advanced/Exercise_2.cpp': {
    language: 'cpp',
    needsCompile: true,
    tests: [
      { check: 'noTodo', fn: (content) => !content.includes('TODO'), error: 'File contains TODO comment - exercise incomplete' }
    ]
  }
};

module.exports = specs;
