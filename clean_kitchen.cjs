const fs = require('fs');
const content = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');

// The file currently has a correct top part up to the first `return (`
const firstReturnIdx = content.indexOf('  return (');
const logicPart = content.substring(0, firstReturnIdx);

// Now let's just grab the three blocks out of the rest of the file.
// We can use a simpler approach.
const hoodIdx = content.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">');
const muaIdx = content.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">', hoodIdx + 10);
const resultsIdx = content.indexOf('<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full">');

// Since we know they are in the order Hood, MUA, Results in the file right now
// Hood goes from hoodIdx to muaIdx
let hoodBlock = content.substring(hoodIdx, muaIdx).trim();

// MUA goes from muaIdx to resultsIdx
let muaBlock = content.substring(muaIdx, resultsIdx).trim();

// Results goes from resultsIdx to the end, but we only want up to the closing `</>` or `</div>` for Results.
// Let's find `          )}` which ends the notAllowed ternary
const ternaryEnd = content.indexOf(')}', resultsIdx);
// then the closing div
const closingDiv = content.indexOf('</div>', ternaryEnd);
// then the outer closing div for results
const resultsEnd = content.indexOf('</div>', closingDiv + 1);

let resultsBlock = content.substring(resultsIdx, resultsEnd + 6).trim();

const finalCode = logicPart + `  return (
    <div className="space-y-6 animate-fade-in">
      ${hoodBlock}
      ${muaBlock}
      ${resultsBlock}
    </div>
  );
}`;

fs.writeFileSync('src/components/KitchenVentilationCalc.tsx', finalCode);
console.log('Cleaned');
