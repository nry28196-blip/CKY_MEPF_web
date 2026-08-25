const fs = require('fs');

const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf8');

// Inject density calculations
const hookPos = code.indexOf('// Peak water supply flow rate calculation');
if (hookPos !== -1) {
    const calcInject = `
  const totalFixtures = appliedFixtures.reduce((sum, f) => sum + f.qty, 0);
  const wsfuDensity = totalFixtures > 0 ? (totalWSFU / totalFixtures).toFixed(2) : '0.00';
  const luDensity = totalFixtures > 0 ? (totalLU / totalFixtures).toFixed(2) : '0.00';
  
  // Peak water supply flow rate calculation`;
    code = code.replace('// Peak water supply flow rate calculation', calcInject);
}

// Inject density UI panel
const uiRegex = /<div className="flex flex-col gap-3">([\s\S]*?)<\/div>\s*<div className="space-y-2\.5 pt-3\.5 border-t border-slate-800">/;

const uiMatch = code.match(uiRegex);

if (uiMatch) {
    const existingUi = uiMatch[1];
    const newUi = `<div className="grid grid-cols-2 gap-3">
${existingUi}                  
                  <div className="bg-slate-950/40 border border-slate-850 p-3 rounded-xl col-span-2">
                    <span className="block text-[9px] text-slate-500 uppercase font-semibold">
                      {standard === 'bs' ? 'Avg Load Density (LU/fixture)' : 'Demand Density (WSFU/fixture)'}
                    </span>
                    <p className="text-xl font-bold text-emerald-400 mt-0.5 font-mono">
                      {standard === 'bs' ? (
                        <>
                          {luDensity} <span className="text-xs text-slate-400">LU/fix</span>
                        </>
                      ) : (
                        <>
                          {wsfuDensity} <span className="text-xs text-slate-400">WSFU/fix</span>
                        </>
                      )}
                    </p>
                    <span className="block text-[10px] text-slate-500 leading-normal mt-1">
                      {standard === 'bs' ? 'Higher density indicates concentrated flow demands.' : 'Values > 2.0 typically indicate high commercial or flush-valve demand concentration.'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2.5 pt-3.5 border-t border-slate-800">`;
    code = code.replace(uiRegex, newUi);
} else {
    console.error("Could not find UI hook");
}

fs.writeFileSync(file, code);
console.log("Patched density panel");
