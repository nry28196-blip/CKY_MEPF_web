const fs = require('fs');
let content = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');
const lines = content.split('\n');

console.log("last lines of file:");
console.log(lines.slice(lines.length - 15).join('\n'));
