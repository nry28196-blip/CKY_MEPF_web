const fs = require('fs');
const file = 'src/calculations/validation/VentilationValidator.ts';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/system\.\(ev \|\| 0\)\.toFixed/g, '(system.ev || 0).toFixed');

fs.writeFileSync(file, code);
