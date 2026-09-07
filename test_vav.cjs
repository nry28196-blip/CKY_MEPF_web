const fs = require('fs');

let content = fs.readFileSync('src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts', 'utf8');
console.log("Simplified: " + content.includes("VpzMinDesign"));

content = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf8');
console.log("Alternative: " + content.includes("VpzMinDesign"));
