const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf-8');

code = code.replace(
  /const votActual = AirDensityService\.applyDensityCorrection\(res\.vot, densityRatio\);/,
  `const votActual = res.vot !== null ? AirDensityService.applyDensityCorrection(res.vot, densityRatio) : null;`
);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', code);
