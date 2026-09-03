const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const oldTabsRegex = /border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950\/10/;
const newTabs = "border-cyan-500 text-cyan-400 font-extrabold bg-cyan-950/10";
code = code.replace(oldTabsRegex, newTabs);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched MechanicalCalc tabs color");
