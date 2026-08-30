const fs = require('fs');
const content = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');
const importIdx = content.indexOf('import React,');
console.log(content.substring(0, 1000));
console.log("----");
console.log(content.substring(importIdx - 1000, importIdx));
