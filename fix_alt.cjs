const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf-8');

code = code.replace(/if \(status as string !== 'FAIL' && status !== 'INCOMPLETE'\)/g, 'if (status as string !== "FAIL" && status as string !== "INCOMPLETE")');

fs.writeFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', code);
