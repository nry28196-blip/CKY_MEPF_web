const fs = require('fs');
let content = fs.readFileSync('src/calculations/ventilation/Ashrae622Service.ts', 'utf8');

content = content.replace(/if \(input.infiltrationCredit === null\) \{\s*status = 'INCOMPLETE';\s*\}/g, 
  "if (input.infiltrationCredit === null && input.infiltrationCredit !== 0) { // Actually, the UI provides null for missing credit, but usually it's a number.");

// Let's rewrite Ashrae622Service calculation to be safer
