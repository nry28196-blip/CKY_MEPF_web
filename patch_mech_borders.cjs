const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

code = code.replace(/google-pro-border-cyan/g, 'border border-slate-800');
code = code.replace(/shadow-cyan-950\/25/g, 'shadow-sm');

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched borders");
