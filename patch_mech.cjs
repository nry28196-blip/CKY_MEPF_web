const fs = require('fs');

let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// 1. Add ventilationDetails state
code = code.replace(
  /const \[ventilationLps, setVentilationLps\] = useState<number>\(25\);/,
  `const [ventilationLps, setVentilationLps] = useState<number>(25);
  const [ventilationDetails, setVentilationDetails] = useState<any>(null);
  
  const handleVentilationChange = (flow: number, details?: any) => {
    setVentilationLps(flow);
    if (details) {
      setVentilationDetails(details);
    } else {
      setVentilationDetails(null);
    }
  };`
);

// 2. Change the handler
code = code.replace(
  /<VentilationCalc onVentilationChange=\{setVentilationLps\} governingStandard=\{governingStandard\} \/>/,
  `<VentilationCalc onVentilationChange={handleVentilationChange} governingStandard={governingStandard} />`
);

// 3. Render ventilation details in audit trail
const auditTrailInsertion = `
                    {ventilationDetails && (
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-[10px] lg:col-span-2">
                        <div className="text-amber-400 font-bold uppercase tracking-wider mb-2 border-b border-slate-800 pb-1 flex justify-between">
                          <span>Ventilation Audit Trail (ASHRAE 62.1)</span>
                          <span className="text-slate-500">{ventilationDetails.systemType === 'single' ? 'Single Zone (VRP)' : 'Multi-Zone (VRP)'}</span>
                        </div>
                        
                        {ventilationDetails.systemType === 'single' && ventilationDetails.zoneResults && ventilationDetails.zoneResults.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-300">
                            <div className="text-slate-500">Vbz (Breathing Zone Outdoor Air) Formula:</div>
                            <div className="text-right text-slate-400">Rp×Pz + Ra×Az = {Math.round(ventilationDetails.zoneResults[0].result?.vbz || 0)}</div>
                            <div className="text-slate-500">Ez (Zone Air Distribution Effectiveness):</div>
                            <div className="text-right text-slate-400">{ventilationDetails.zoneResults[0].result?.ez || 1.0}</div>
                            <div className="text-slate-500">Voz (Zone Outdoor Air) Formula:</div>
                            <div className="text-right text-slate-400">Vbz / Ez = {Math.round(ventilationDetails.zoneResults[0].result?.voz || 0)}</div>
                          </div>
                        )}

                        {ventilationDetails.systemType === 'multi' && ventilationDetails.systemResult && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-slate-300">
                            <div className="text-slate-500">Vou (Uncorrected Outdoor Air) Formula:</div>
                            <div className="text-right text-slate-400">D×Σ(Rp×Pz) + Σ(Ra×Az) = {Math.round(ventilationDetails.systemResult.vou)}</div>
                            
                            <div className="text-slate-500">Max Zpz (Critical Zone Fraction):</div>
                            <div className="text-right text-slate-400">{ventilationDetails.systemResult.zd.toFixed(3)}</div>
                            
                            <div className="text-slate-500">Ev (System Vent. Efficiency) Formula:</div>
                            <div className="text-right text-slate-400">1 + Xs - Zd = {ventilationDetails.systemResult.ev.toFixed(3)}</div>
                            
                            <div className="text-slate-500">Vot (System Outdoor Air) Formula:</div>
                            <div className="text-right text-slate-400">Vou / Ev = {Math.round(ventilationDetails.systemResult.vot)}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
`;

code = code.replace(
  /                    <\/div>\n                  <\/div>\n                <\/div>\n              \)\}/,
  auditTrailInsertion + `              )}`
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
console.log("Patched MechanicalCalc");
