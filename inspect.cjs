const fs = require('fs');
const content = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');

const hoodIdx = content.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">');
const muaIdx = content.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">', hoodIdx + 10);
const resultsIdx = content.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full">');

console.log('Hood string length:', muaIdx - hoodIdx);
console.log('Hood string ends with:', content.substring(muaIdx - 20, muaIdx));
