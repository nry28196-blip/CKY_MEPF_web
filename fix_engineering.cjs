const fs = require('fs');
let code = fs.readFileSync('src/components/EngineeringWarning.tsx', 'utf8');

code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/components/EngineeringWarning.tsx', code);
console.log("Fixed engineering warning backslashes");
