const fs = require('fs');

let content = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

// The replacement made it: (z.vpzMin !== undefined && z.vpzMin !== null && true)
// Let's just make it clean
content = content.replace(/\(z\.vpzMin !== undefined && z\.vpzMin !== null && true\)/g, '(z.vpzMin !== undefined && z.vpzMin !== null)');

fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', content);
console.log("Cleaned up TS condition");
