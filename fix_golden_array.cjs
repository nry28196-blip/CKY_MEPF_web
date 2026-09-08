const fs = require('fs');

let code = fs.readFileSync('src/tests/ventilation/golden.test.ts', 'utf-8');
code = code.replace(/\{ id: 'zone/g, "{ id: 'zone"); // this is silly
code = code.replace(/\{ id:/g, "{ expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', id:");
fs.writeFileSync('src/tests/ventilation/golden.test.ts', code);

