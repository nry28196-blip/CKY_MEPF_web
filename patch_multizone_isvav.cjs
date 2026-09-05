const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf-8');

code = code.replace(
  /const res = Ashrae621SimplifiedSystemService\.calculate\(\{\n\s*zones: mappedZones,\n\s*systemPopulation\n\s*\}\);/,
  `const res = Ashrae621SimplifiedSystemService.calculate({
         zones: mappedZones,
         systemPopulation,
         isVAV: inputs.isVAV
       });`
);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', code);
