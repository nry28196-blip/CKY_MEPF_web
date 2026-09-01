const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621Service.ts', 'utf8');

// find the extra closing brace and remove it
code = code.replace(/}(\s*\/\*\*\s+\*\sCalculates ASHRAE 62\.1 multi-zone system outdoor air requirements\.)/, "$1");

fs.writeFileSync('src/calculations/ventilation/Ashrae621Service.ts', code);
