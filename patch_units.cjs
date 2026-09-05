const fs = require('fs');
let code = fs.readFileSync('src/calculations/services/UnitConversionService.ts', 'utf8');

code = code.replace(
  'static mToFt(m: number): number { return m / 0.3048; }',
  `static mToFt(m: number): number { return m / 0.3048; }
  
  static cuFtToCuM(cuFt: number): number { return cuFt * 0.0283168; }
  static cuMToCuFt(cuM: number): number { return cuM / 0.0283168; }`
);

fs.writeFileSync('src/calculations/services/UnitConversionService.ts', code);
