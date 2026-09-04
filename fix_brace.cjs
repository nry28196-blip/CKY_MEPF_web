const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');
const openCount = (content.match(/\{/g) || []).length;
const closeCount = (content.match(/\}/g) || []).length;
console.log('Open:', openCount, 'Close:', closeCount);
