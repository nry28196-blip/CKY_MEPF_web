const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', 'utf-8');

code = code.replace(
  "      sumVpz += (z.vpz || 0);\n      sumVpzMin += (z.vpzMin || 0);",
  "      if (z.vpz !== undefined && !isNaN(z.vpz)) sumVpz += z.vpz;\n      if (z.vpzMin !== undefined && !isNaN(z.vpzMin)) sumVpzMin += z.vpzMin;"
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', code);
