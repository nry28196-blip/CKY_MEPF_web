const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf-8');

if (!code.includes('sumVpzMin: number')) {
  code = code.replace(
    `votActual: number;`,
    `votActual: number;\n  sumVpzMin?: number;\n  sumVpz?: number;`
  );
}

code = code.replace(
  `zones: []`,
  `zones: [],\n         sumVpzMin: res.sumVpzMin,\n         sumVpz: res.sumVpz`
);

code = code.replace(
  `zones: res.zoneResults.map((zr, i) => ({`,
  `sumVpzMin: res.sumVpzMin,\n         sumVpz: res.sumVpz,\n         zones: res.zoneResults.map((zr, i) => ({`
);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', code);
