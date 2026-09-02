const fs = require('fs');

let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const auditTrailInsertion = `                      </div>
                    </div>
                    {ventilationDetails && (
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-[10px] lg:col-span-2">
                        <div className="text-amber-400 font-bold uppercase tracking-wider mb-2 border-b border-slate-800 pb-1 flex justify-between">
                          <span>Ventilation Audit Trail</span>
                          <span className="text-slate-500">{governingStandard} - {ventilationDetails.systemType === 'single' ? 'Single Zone (VRP)' : 'Multi-Zone (VRP)'}</span>
                        </div>
                        
                        {ventilationDetails.systemType === 'single' && ventilationDetails.zoneResults && ventilationDetails.zoneResults.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-300">
                            <div className="text-slate-500">Vbz (Breathing Zone Outdoor Air) Formula <span className="text-[8px] text-slate-600">(ASHRAE 62.1 Eq 6.2.2.1)</span>:</div>
                            <div className="text-right text-slate-400">Rp×Pz + Ra×Az = {Math.round(ventilationDetails.zoneResults[0].result?.vbz || 0)}</div>
                            <div className="text-slate-500">Ez (Zone Air Distribution Effectiveness) <span className="text-[8px] text-slate-600">(Table 6.2.2.2)</span>:</div>
                            <div className="text-right text-slate-400">{ventilationDetails.zoneResults[0].result?.ez || 1.0}</div>
                            <div className="text-slate-500">Voz (Zone Outdoor Air) Formula <span className="text-[8px] text-slate-600">(Eq 6.2.2.3)</span>:</div>
                            <div className="text-right text-slate-400">Vbz / Ez = {Math.round(ventilationDetails.zoneResults[0].result?.voz || 0)}</div>
                          </div>
                        )}

                        {ventilationDetails.systemType === 'multi' && ventilationDetails.systemResult && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-300">
                            <div className="text-slate-500">Vou (Uncorrected Outdoor Air) Formula <span className="text-[8px] text-slate-600">(Eq 6.2.5.3)</span>:</div>
                            <div className="text-right text-slate-400">D×Σ(Rp×Pz) + Σ(Ra×Az) = {Math.round(ventilationDetails.systemResult.vou)}</div>
                            
                            <div className="text-slate-500">Max Zpz (Critical Zone Fraction) <span className="text-[8px] text-slate-600">(Max(Voz/Vpz))</span>:</div>
                            <div className="text-right text-slate-400">{ventilationDetails.systemResult.zd.toFixed(3)}</div>
                            
                            <div className="text-slate-500">Ev (System Vent. Efficiency) Formula <span className="text-[8px] text-slate-600">(Eq 6.2.5.4.1)</span>:</div>
                            <div className="text-right text-slate-400">1 + Xs - Zd = {ventilationDetails.systemResult.ev.toFixed(3)}</div>
                            
                            <div className="text-slate-500">Vot (System Outdoor Air) Formula <span className="text-[8px] text-slate-600">(Eq 6.2.5.1)</span>:</div>
                            <div className="text-right text-slate-400">Vou / Ev = {Math.round(ventilationDetails.systemResult.vot)}</div>
                          </div>
                        )}
                      </div>
                    )}`;

const targetContent = `                        <div className="text-right font-bold text-amber-400 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">{Math.round(results.calculatedTotal)} W</div>
                      </div>
                    </div>`;

if (code.includes(targetContent)) {
  code = code.replace(targetContent, targetContent + "\n" + auditTrailInsertion);
  
  // Clean up any duplicated ventilationDetails blocks if I happened to insert it twice.
  // Wait, my last patch didn't insert it. Let's make sure it's inserted.
  fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
  console.log("Patched MechanicalCalc");
} else {
  console.log("Target not found");
}
