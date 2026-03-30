const fs = require('fs');

function testCSS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Exercise 1: Basic styling
  if (filePath.includes('Beginner/Exercise_1.css')) {
    const checks = {
      hasColorNotColour: /color:\s*#333/i.test(content) && !/colour:/i.test(content),
      hasFontSize: /font-size:\s*16px/i.test(content),
      noSyntaxErrors: !/{[\s\S]*{/.test(content), // No nested braces
      hasClosingBrace: content.match(/{/g)?.length === content.match(/}/g)?.length,
    };
    
    return checks;
  }
  
  // Exercise 2: CSS specificity
  if (filePath.includes('Beginner/Exercise_2.css')) {
    const checks = {
      hasClassSelector: /\.title\s*{[\s\S]*color:\s*red/i.test(content),
      hasIdSelector: /#title\s*{[\s\S]*color:\s*blue/i.test(content),
      idHasHigherSpecificity: content.indexOf('#title') > content.indexOf('.title'),
    };
    
    return checks;
  }
  
  return {};
}

module.exports = testCSS;
