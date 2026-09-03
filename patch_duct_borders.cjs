const fs = require('fs');
let code = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf8');

code = code.replace(/google-pro-border-emerald/g, 'border border-slate-800');

fs.writeFileSync('src/components/DuctSizingCalc.tsx', code);
console.log("Patched DuctSizingCalc");
