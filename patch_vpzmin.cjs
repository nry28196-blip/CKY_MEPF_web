const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

code = code.replace(
  /: Math.max\(z.primaryAirflow \* 0.3, z.zoneResult.voz\);/g,
  ": z.primaryAirflow;"
);

// We need to fix the comments as well
code = code.replace(
  /\/\/ 62\.1-2025: If Vpz-min is not provided, correctly derive it as max\(30% of Vpz, Voz\) for VAV safety/g,
  "// If Vpz-min is not provided, default to Vpz (assumes Constant Volume). Do not use an arbitrary 30% VAV rule."
);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', code);
console.log("Patched Vpz-min logic");
