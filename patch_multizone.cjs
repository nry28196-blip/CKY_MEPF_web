const fs = require('fs');
const file = 'src/calculations/ventilation/MultiZoneVentilationService.ts';
let code = fs.readFileSync(file, 'utf-8');

// We need to add ps, sumPz, d to MultiZoneSystemResult
code = code.replace(/export interface MultiZoneSystemResult \{/, `export interface MultiZoneSystemResult {\n  ps?: number;\n  sumPz?: number;\n  d?: number;`);

// In the simplified block
code = code.replace(/method: 'simplified',/g, `ps: res.ps,\n         sumPz: res.sumPz,\n         d: res.d,\n         method: 'simplified',`);

// In the alternative block
code = code.replace(/method: 'alternative',/g, `ps: res.ps,\n         sumPz: res.sumPz,\n         d: res.d,\n         method: 'alternative',`);

fs.writeFileSync(file, code);
