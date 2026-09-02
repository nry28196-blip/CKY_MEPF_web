const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

const target = `{/* Density Adjusted Zone Voz */}`;
const replace = `{/* Audit Trail */}
            <div className="mt-4 pt-4 border-t border-slate-800/60">
              <details className="group">
                <summary className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer flex items-center hover:text-slate-300 transition-colors">
                  <span className="flex-1">Calculation Audit Trail</span>
                  <span className="text-slate-500 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-3 bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Governing Code</span>
                    <span className="text-[10px] font-mono text-sky-400 font-bold">ASHRAE 62.1-{edition}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Methodology</span>
                    <span className="text-[10px] font-mono text-slate-300">{systemType === 'single' ? 'Single Zone System (VRP)' : 'Multi-Zone System (VRP)'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Rp (People Rate)</span>
                    <span className="text-[10px] font-mono text-slate-400">{zr.result.rp} {isMetric ? 'L/s·person' : 'cfm/person'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Ra (Area Rate)</span>
                    <span className="text-[10px] font-mono text-slate-400">{zr.result.ra} {isMetric ? 'L/s·m²' : 'cfm/ft²'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Pz (Zone Population)</span>
                    <span className="text-[10px] font-mono text-slate-400">{Math.round(zr.result.pz)} <span className="text-slate-600">({zr.result.occupancySource === 'default' ? 'Code Default' : 'User Design'})</span></span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Az (Zone Area)</span>
                    <span className="text-[10px] font-mono text-slate-400">{zr.result.az} {isMetric ? 'm²' : 'ft²'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">Ez (Distribution Eff.)</span>
                    <span className="text-[10px] font-mono text-slate-400">{zr.result.ez}</span>
                  </div>
                </div>
              </details>
            </div>

            {/* Density Adjusted Zone Voz */}`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Patched Ashrae621VentilationCalc for audit trail");
