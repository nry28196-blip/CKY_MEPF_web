const fs = require('fs');

let content = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

const target1 = `      if (zpz > zdMax) {
        zdMax = zpz;
        criticalZoneId = z.zoneId;
      }`;

const replacement1 = `      if (zpz > zdMax) {
        zdMax = zpz;
      }`;

const target2 = `      if (evz < ev) {
        ev = evz;
      }`;

const replacement2 = `      if (evz < ev) {
        ev = evz;
        criticalZoneId = z.zoneId;
      }`;

content = content.replace(target1, replacement1);
content = content.replace(target2, replacement2);

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', content);
console.log("Updated critical zone logic");
