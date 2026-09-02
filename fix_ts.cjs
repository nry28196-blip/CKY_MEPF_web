const fs = require('fs');

let content = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

content = content.replace(/z\.vpzMin !== ''/g, 'true');

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', content);
console.log("Fixed TS error");
