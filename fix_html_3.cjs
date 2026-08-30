const fs = require('fs');
let code = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');

const returnIdx = code.indexOf('return (');
const jsx = code.substring(returnIdx);

let opens = (jsx.match(/<div/g) || []).length;
let closes = (jsx.match(/<\/div>/g) || []).length;
console.log(`Total: open ${opens}, close ${closes}`);

const hoodIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">');
const muaIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">', hoodIdx + 10);
const resultsIdx = code.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full">');

function count(str, name) {
  let o = (str.match(/<div/g) || []).length;
  let c = (str.match(/<\/div>/g) || []).length;
  console.log(`${name}: open ${o}, close ${c}`);
}

count(code.substring(returnIdx, hoodIdx), "Root");
count(code.substring(hoodIdx, muaIdx), "Hood");
count(code.substring(muaIdx, resultsIdx), "MUA");
count(code.substring(resultsIdx), "Results");

