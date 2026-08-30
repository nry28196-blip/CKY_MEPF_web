const fs = require('fs');

const missingResults = `
          {notAllowed ? (
            <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl flex flex-col items-center justify-center text-center">
               <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
               <h4 className="text-sm font-bold text-red-400 uppercase">Configuration Not Allowed</h4>
               <p className="text-xs text-red-300 mt-2">
                 Per IMC 507, {duty} duty equipment is not permitted under a {hoodType.replace('_', ' ')} hood.
               </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-950/50 p-6 rounded-xl border border-rose-900/30 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10">Required Exhaust</p>
                  <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md z-10">
                    {Math.ceil(exhaustAirflow).toLocaleString()}
                  </p>
                  <p className="text-sm font-bold text-rose-400 uppercase tracking-widest mt-1 z-10">{flowUnit}</p>
                </div>
                
                <div className="bg-slate-950/50 rounded-xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-bl from-sky-500/5 to-transparent" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 z-10 text-center pt-6">Make-Up Air ({totalMuaRatio}%)</p>
                  <p className="text-4xl font-black text-white font-mono tracking-tight drop-shadow-md z-10 text-center mb-4">
                    {Math.round(muaTotalFlow).toLocaleString()}
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-widest ml-1">{flowUnit}</span>
                  </p>
                  
                  <div className="flex-grow flex flex-col justify-end space-y-2 z-10 text-[10px] font-mono w-full px-4 pb-4">
                     <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                        <span className="text-slate-500">Transfer ({muaTransfer}%)</span>
                        <span className="text-slate-300">{Math.round(muaTransferFlow).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                        <span className="text-sky-500/70">Ceiling ({muaCeiling}%)</span>
                        <span className="text-sky-300">{Math.round(muaCeilingFlow).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-slate-800/60 pb-1">
                        <span className="text-indigo-500/70">Front/Perimeter ({muaPerimeter}%)</span>
                        <span className="text-indigo-300">{Math.round(muaPerimeterFlow).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-amber-500/70">Internal ({muaInternal}%)</span>
                        <span className="text-amber-300">{Math.round(muaInternalFlow).toLocaleString()}</span>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Minimum Duct Area</h4>
                   <div className="flex items-end">
                     <span className="text-2xl font-black text-slate-200 font-mono leading-none">{Math.round(ductArea).toLocaleString()}</span>
                     <span className="text-xs font-bold text-slate-500 uppercase ml-2 mb-0.5">{areaUnit}</span>
                   </div>
                   <p className="text-[10px] text-slate-500 mt-2">Required cross-section to maintain {ductVelocity} {velUnit}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Design Guidelines</h4>
                   <ul className="text-[9px] text-slate-400 space-y-1.5 list-disc list-inside">
                     {muaInternal > 10 && <li className="text-amber-400">High internal MUA (&gt;10%) may interfere with thermal plume capture.</li>}
                     {totalMuaRatio < 80 && <li className="text-amber-400">Low total MUA may cause negative building pressure.</li>}
                     {faceVelocity < (isMetric ? 0.25 : 50) && <li className="text-amber-400">Low face velocity may result in poor spill containment.</li>}
                     <li>Duct velocity min 500 FPM (2.54 m/s) per IMC to prevent grease accumulation.</li>
                   </ul>
                </div>
              </div>
            </>
          )}
        </div>
    </div>
  );
}`;

let code = fs.readFileSync('src/components/KitchenVentilationCalc.tsx', 'utf8');
const resultsHeaderEnd = code.indexOf('D: {hoodDepth.toFixed(2)} {lenUnit}\n              </span>\n            </div>\n          </div>');

const topPart = code.substring(0, resultsHeaderEnd + 95);

fs.writeFileSync('src/components/KitchenVentilationCalc.tsx', topPart + missingResults);
console.log('Restored results block');
