const fs = require('fs');
let altCode = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf-8');

if (!altCode.includes('sumVpzMin?: number')) {
  altCode = altCode.replace(
    `error?: string;`,
    `error?: string;\n  sumVpzMin?: number;\n  sumVpz?: number;`
  );
  
  altCode = altCode.replace(
    `ps, sumPz, d, vou, vps: vps || 0, xs, ev, vot, status, warning, error, zoneResults`,
    `ps, sumPz, d, vou, vps: vps || 0, xs, ev, vot, status, warning, error, zoneResults, sumVpzMin, sumVpz`
  );
  
  altCode = altCode.replace(
    `ps: 0, sumPz: 0, d: 1, vou: 0, vps: 0, xs: 0, ev: 1, vot: 0, status, warning, zoneResults: []`,
    `ps: 0, sumPz: 0, d: 1, vou: 0, vps: 0, xs: 0, ev: 1, vot: 0, status, warning, zoneResults: [], sumVpzMin: 0, sumVpz: 0`
  );
  
  fs.writeFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', altCode);
}

let simpCode = fs.readFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', 'utf-8');

if (!simpCode.includes('sumVpzMin?: number')) {
  simpCode = simpCode.replace(
    `error?: string;`,
    `error?: string;\n  sumVpzMin?: number;\n  sumVpz?: number;`
  );
  
  simpCode = simpCode.replace(
    `ps, sumPz, d, sumRpPz, sumRaAz, vou, ev, vot, status, warning, error`,
    `ps, sumPz, d, sumRpPz, sumRaAz, vou, ev, vot, status, warning, error, sumVpzMin: 0, sumVpz: 0` // Simplified doesn't really have sumVpzMin, but I'll add them as 0 to satisfy the type.
  );
  
  simpCode = simpCode.replace(
    `ps: 0, sumPz: 0, d: 1, sumRpPz: 0, sumRaAz: 0, vou: 0, ev: 1, vot: 0, status, warning`,
    `ps: 0, sumPz: 0, d: 1, sumRpPz: 0, sumRaAz: 0, vou: 0, ev: 1, vot: 0, status, warning, sumVpzMin: 0, sumVpz: 0`
  );
  
  fs.writeFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', simpCode);
}
