const fs = require('fs');
let content = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');

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
              <span className="text-[10px] font-mono text-sky-400 font-bold">IMC & ASHRAE 154</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Methodology</span>
              <span className="text-[10px] font-mono text-slate-300">Net Exhaust Rate by Duty Category</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Base Formula</span>
              <span className="text-[10px] font-mono text-slate-400">Q = Duty Factor × Length</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-wider">Exhaust Airflow</span>
              <span className="text-[10px] font-mono text-slate-400">{Math.ceil(totalExhaust)} {flowUnit}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-800">`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/KitchenVentilationCalc.tsx', content);
console.log("Patched KitchenVentilationCalc");
