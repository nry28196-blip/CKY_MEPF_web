const fs = require('fs');
let content = fs.readFileSync('src/components/CommercialLocalExhaustCalc.tsx', 'utf8');

const target = `            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10">Required Local Exhaust</p>
            <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md z-10">
              {Math.ceil(result.requiredExhaust).toLocaleString()}
            </p>
            <p className="text-sm font-bold text-rose-400 uppercase tracking-widest mt-1 z-10">{flowUnit}</p>
          </div>
        )}
      </div>`;

const replace = `            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10">Required Local Exhaust</p>
            <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md z-10">
              {Math.ceil(result.requiredExhaust).toLocaleString()}
            </p>
            <p className="text-sm font-bold text-rose-400 uppercase tracking-widest mt-1 z-10">{flowUnit}</p>
          </div>
        )}

        {/* Engineering Audit Trail */}
        {selectedId !== 'none' && (
          <div className="mt-6 pt-4 border-t border-slate-800/60">
            <div className="bg-slate-950/50 rounded-lg border border-slate-800/50 overflow-hidden">
              <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800/50 flex items-center">
                <Activity className="w-3.5 h-3.5 text-sky-400 mr-2" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Engineering Audit Trail</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Governing Code</span>
                  <span className="text-[10px] font-mono text-sky-400 font-bold">ASHRAE 62.1-2022 (Table 6.5)</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Methodology</span>
                  <span className="text-[10px] font-mono text-slate-300">Prescriptive Local Exhaust</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Base Rate</span>
                  <span className="text-[10px] font-mono text-slate-400">{result.category?.rate ?? customRate} {result.category?.unitType === 'per_unit' ? flowUnit + '/unit' : flowUnit + '/' + areaUnit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">Quantity/Area</span>
                  <span className="text-[10px] font-mono text-slate-400">{quantity}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>`;

content = content.replace(target, replace);
fs.writeFileSync('src/components/CommercialLocalExhaustCalc.tsx', content);
console.log("Patched CommercialLocalExhaustCalc");
