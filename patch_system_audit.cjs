const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const target = `{/* Zone Fractions (Zpz) */}`;
const replace = `{/* System Audit Trail */}
          <div className="mt-6 pt-4 border-t border-slate-800/60">
            <details className="group">
              <summary className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer flex items-center hover:text-slate-300 transition-colors">
                <span className="flex-1">System Engineering Audit Trail</span>
                <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Governing Code</span>
                  <span className="text-[10px] font-mono text-sky-400 font-bold">ASHRAE 62.1-{edition}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Vou (Uncorrected) Formula</span>
                  <span className="text-[10px] font-mono text-slate-400">D × Σ(Rp×Pz) + Σ(Ra×Az)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Diversity Ratio (D)</span>
                  <span className="text-[10px] font-mono text-slate-400">Ps / ΣPz = {systemResult.d.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Xs (System Primary Fraction)</span>
                  <span className="text-[10px] font-mono text-slate-400">Vou / Vps = {systemResult.xs.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Zd (Max Zone Fraction)</span>
                  <span className="text-[10px] font-mono text-slate-400">Max(Zpz) = {systemResult.zdMax.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Ev (Ventilation Efficiency) Formula</span>
                  <span className="text-[10px] font-mono text-slate-400">1 + Xs - Zd</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Vot (System Outdoor Air) Formula</span>
                  <span className="text-[10px] font-mono text-slate-400">Vou / Ev</span>
                </div>
              </div>
            </details>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Zone Fractions (Zpz)</h4>`;

content = content.replace(`<div className="mt-6 pt-4 border-t border-slate-800/60">\n             <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3">Zone Fractions (Zpz)</h4>`, replace);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Patched Ashrae621VentilationCalc for System Audit Trail");
