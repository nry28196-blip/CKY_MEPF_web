const fs = require('fs');

let content = fs.readFileSync('src/lib/DensityCorrectionService.ts', 'utf8');

content = content.replace(
  /density: number; \/\/ kg\/m³/g,
  "density: number; // kg/m³\n  humidityRatioKgKg: number;"
);

content = content.replace(
  /const density = \(pd \/ \(this\.R_DRY_AIR_KJ \* tKelvin\)\) \+ \(pv \/ \(this\.R_VAPOR_KJ \* tKelvin\)\);/,
  "const density = (pd / (this.R_DRY_AIR_KJ * tKelvin)) + (pv / (this.R_VAPOR_KJ * tKelvin));\n    const humidityRatioKgKg = pd > 0 ? 0.621945 * (pv / pd) : 0;"
);

content = content.replace(
  /density,\n      eRho,\n      status,/g,
  "density,\n      humidityRatioKgKg,\n      eRho,\n      status,"
);

content = content.replace(
  /standardDensityKgM3: this\.STANDARD_DENSITY/g,
  "standardDensityKgM3: this.STANDARD_DENSITY,\n        humidityRatioKgKg: res.humidityRatioKgKg"
);

fs.writeFileSync('src/lib/DensityCorrectionService.ts', content);
