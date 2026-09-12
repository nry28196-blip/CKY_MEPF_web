const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621ExhaustService.ts', 'utf-8');
code = code.replace("if (Number.isNaN(input.qty as any)) {", "if (typeof input.qty === 'number' && Number.isNaN(input.qty)) {");
fs.writeFileSync('src/calculations/ventilation/Ashrae621ExhaustService.ts', code);
