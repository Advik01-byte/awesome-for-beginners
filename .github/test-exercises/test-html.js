const fs = require('fs');

function testHTML(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Exercise 1: Basic HTML structure
  if (filePath.includes('Beginner/Exercise_1.html')) {
    const checks = {
      hasDoctype: /<!DOCTYPE\s+html\s*>/i.test(content),
      hasHtmlTags: /<html>[\s\S]*<\/html>/i.test(content),
      hasHeadTags: /<head>[\s\S]*<\/head>/i.test(content),
      hasBodyTags: /<body>[\s\S]*<\/body>/i.test(content),
      hasH1Tag: /<h1[^>]*>Hello World<\/h1>/i.test(content),
      hasPTag: /<p[^>]*>Welcome to the test page<\/p>/i.test(content),
      noMissingCloseTags: !/<h1[^>]*>Hello World(?!.*<\/h1>)/i.test(content),
      properHeadClose: !/<head>[\s\S]*<head>/i.test(content), // Should not have duplicate opening
    };
    
    return checks;
  }
  
  // Exercise 2: Images and links
  if (filePath.includes('Beginner/Exercise_2.html')) {
    const checks = {
      hasDoctype: /<!DOCTYPE\s+html\s*>/i.test(content),
      hasImg: /<img\s+src=["']images\/logo\.png["']/i.test(content),
      hasLink: /<a\s+href=["']https?:\/\//i.test(content), // Must have http(s)
      notHasWwwWithoutProtocol: !/<a\s+href=["']www\./i.test(content),
    };
    
    return checks;
  }
  
  return {};
}

module.exports = testHTML;
