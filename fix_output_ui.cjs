const fs = require('fs');
let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const target = `            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">System Population (Ps)</span>
                <span className="font-mono text-white">{Math.round(systemResult.ps)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Sum of Zone Primary Air (ΣVpz)</span>
                <span className="font-mono text-white">{Math.round(systemResult.sumVpz)} {flowUnit}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Uncorrected Outdoor Air (Vou)</span>
                <span className="font-mono text-white">{Math.round(systemResult.vou)} {flowUnit}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">System Primary Fraction (Xs = Vou/ΣVpz)</span>
                <span className="font-mono text-white">{systemResult.xs.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Max Zone Fraction (Zd)</span>
                <span className="font-mono text-amber-400 font-bold">{systemResult.zdMax.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-400">System Vent Efficiency (Ev)</span>
                <span className="font-mono text-sky-400 font-bold">{systemResult.ev.toFixed(2)}</span>
              </div>
            </div>`;

const replacement = `            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">System Population (Ps)</span>
                <span className="font-mono text-white">{Math.round(systemResult.ps)} <span className="text-slate-500 text-xs">(D = {systemResult.d.toFixed(2)})</span></span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">System Min Airflow (Vps)</span>
                <span className="font-mono text-white">{Math.round(systemResult.vps)} {flowUnit}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Uncorrected Outdoor Air (Vou)</span>
                <span className="font-mono text-white">{Math.round(systemResult.vou)} {flowUnit}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">System Primary Fraction (Xs)</span>
                <span className="font-mono text-white">{systemResult.xs.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                <span className="text-slate-400">Max Zone Fraction (Zpz)</span>
                <span className="font-mono text-amber-400 font-bold">{systemResult.zdMax.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-400">System Vent Efficiency (Ev)</span>
                <span className="font-mono text-sky-400 font-bold">{systemResult.ev.toFixed(2)}</span>
              </div>
            </div>`;

if (file.includes('Sum of Zone Primary Air')) {
  file = file.replace(target, replacement);
  fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
  console.log("Fixed Output UI");
} else {
  console.log("Could not find target block");
}
