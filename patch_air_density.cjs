const fs = require('fs');
let code = fs.readFileSync('src/calculations/services/AirDensityService.ts', 'utf8');

code = code.replace(
  "standardDensityKgM3: number;",
  "standardDensityKgM3: number;\n  humidityRatioKgKg: number;"
);

code = code.replace(
  "return {",
  "const humidityRatioKgKg = 0.621945 * (pv / pd);\n\n    return {\n      humidityRatioKgKg,"
);

fs.writeFileSync('src/calculations/services/AirDensityService.ts', code);
console.log("Patched AirDensityService");
