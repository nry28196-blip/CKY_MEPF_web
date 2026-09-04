const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', 'utf-8');

code = code.replace(
  `let sumPz = 0;`,
  `let sumPz = 0;\n    let sumVpz = 0;\n    let sumVpzMin = 0;`
);

code = code.replace(
  `sumRaAz += (z.zoneResult.ra * z.zoneResult.az);`,
  `sumRaAz += (z.zoneResult.ra * z.zoneResult.az);\n      sumVpz += (z.vpz || 0);\n      sumVpzMin += (z.vpzMin || 0);`
);

code = code.replace(
  `sumVpzMin: 0, sumVpz: 0`,
  `sumVpzMin, sumVpz`
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', code);
