const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');
console.log(code.match(/const \[systemType, setSystemType\]/)[0]);
