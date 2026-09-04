const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf-8');

code = code.replace(
  "      ps, sumPz, d, vou, vps: vps || 0, xs, ev, vot, status, warning, error, zoneResults, sumVpzMin, sumVpz",
  "      ps, sumPz, d, vou, vps: vps === undefined || isNaN(vps) ? 0 : vps, xs, ev, vot, status, warning, error, zoneResults, sumVpzMin, sumVpz"
);

fs.writeFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', code);
