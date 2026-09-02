const fs = require('fs');

let content = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

content = content.replace("let ev = 1.0;", "let ev = Infinity;");

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', content);
console.log("Updated ev initialization");
