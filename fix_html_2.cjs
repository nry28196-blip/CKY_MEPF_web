const fs = require('fs');
let code = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');

const hoodIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">');
const muaIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">', hoodIdx + 10);
const resultsIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full">');

let muaBlock = code.substring(muaIdx, resultsIdx) + '        </div>\n'; // ADDING MISSING DIV

// write it back!
const finalCode = code.substring(0, muaIdx) + muaBlock + code.substring(resultsIdx);
fs.writeFileSync('src/components/KitchenVentilationCalc.tsx', finalCode);
console.log('Fixed MUA div');
