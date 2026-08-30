const fs = require('fs');
let code = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');
const hoodIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">');
const muaIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">', hoodIdx + 10);
const resultsIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full">');
console.log(code.substring(muaIdx, resultsIdx));
