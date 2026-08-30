const fs = require('fs');
let code = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');

function checkDivs(block, name) {
  const openCount = (block.match(/<div/g) || []).length;
  const closeCount = (block.match(/<\/div>/g) || []).length;
  console.log(`${name}: open ${openCount}, close ${closeCount}`);
}

const hoodIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">');
const muaIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">', hoodIdx + 10);
const resultsIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full">');

checkDivs(code.substring(hoodIdx, muaIdx), "Hood");
checkDivs(code.substring(muaIdx, resultsIdx), "MUA");
checkDivs(code.substring(resultsIdx), "Results");
