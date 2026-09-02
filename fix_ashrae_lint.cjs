const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

code = code.replace(/reference: \`ASHRAE 62\.1-\\\$\{state\.edition\}\`/g, "reference: `ASHRAE 62.1-${edition}`");

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
console.log("Fixed state.edition reference");
