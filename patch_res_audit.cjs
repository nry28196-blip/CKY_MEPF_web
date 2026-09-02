const fs = require('fs');
let content = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf8');

const target = `<div className="mt-8 pt-6 border-t border-slate-800">`;
const replace = `{/* Engineering Audit Trail */}
      <div className="mt-6 pt-4 border-t border-slate-800/60">
        <div className="bg-slate-950/50 rounded-lg border border-slate-800/50 overflow-hidden">
          <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800/50 flex items-center">
            <Activity className="w-3.5 h-3.5 text-sky-400 mr-2" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Engineering Audit Trail</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Governing Code</span>
              <span className="text-[10px] font-mono text-sky-400 font-bold">ASHRAE 62.2-{edition}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Methodology</span>
              <span className="text-[10px] font-mono text-slate-300">Residential Continuous Whole-Dwelling</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Base Formula</span>
              <span className="text-[10px] font-mono text-slate-400">{isMetric ? 'Q = 0.15A + 3.5(Nb + 1)' : 'Q = 0.03A + 7.5(Nb + 1)'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Total Required (Q)</span>
              <span className="text-[10px] font-mono text-slate-400">{Math.ceil(totalRequired)} {flowUnit}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-800">`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', content);
console.log("Patched ResidentialVentilationCalc");
