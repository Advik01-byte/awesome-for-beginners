const fs = require('fs');

function testJavaScript(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Exercise 1: Hello World
  if (filePath.includes('Beginner/Exercise_1.js')) {
    const checks = {
      noTypos: !content.includes('consol'), // Should not have typo
      hasCorrectLog: /console\.log\s*\(\s*"Hello,\s*World!"\s*\)/i.test(content),
      hasSecondLog: /console\.log\s*\([^)]*Welcome[^)]*\)/i.test(content),
      correctConcatenation: /console\.log\s*\([^)]*Welcome[^)]*\+\s*name/i.test(content),
    };
    
    return checks;
  }
  
  // Exercise 2: Calculator
  if (filePath.includes('Beginner/Exercise_2.js')) {
    const checks = {
      usesParseInt: /parseInt/i.test(content),
      hasCorrectAddition: /\+\s*(?!.*=)/i.test(content), // + operator, not +=
      storesInVariable: /const\s+\w+\s*=/i.test(content),
    };
    
    return checks;
  }
  
  return {};
}

module.exports = testJavaScript;
