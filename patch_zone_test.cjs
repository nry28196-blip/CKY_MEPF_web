const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621ZoneService.ts', 'utf-8');
code = code.replace(/vbp: number;/g, 'vbp: number | null;');
code = code.replace(/vba: number;/g, 'vba: number | null;');
code = code.replace(/vbz: number;/g, 'vbz: number | null;');
code = code.replace(/voz: number;/g, 'voz: number | null;');
fs.writeFileSync('src/calculations/ventilation/Ashrae621ZoneService.ts', code);
