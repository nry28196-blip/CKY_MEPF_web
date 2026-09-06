const fs = require('fs');
let code = fs.readFileSync('src/components/PlumbingCalc.tsx', 'utf-8');

code = code.replace(
  '<input type="number" min="0.1" step="0.1" value={availablePressure} onChange={(e) => setAvailablePressure(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />\n                    </div>',
  `<input type="number" min="0.1" step="0.1" value={availablePressure} onChange={(e) => setAvailablePressure(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />
                      {availablePressure !== 0 && availablePressure < 2.0 && (
                        <InputAlert type="warning" message="Low municipal pressure (< 2.0 bar). A booster pump is highly likely to be required." />
                      )}
                      {availablePressure !== 0 && availablePressure > 5.5 && (
                        <InputAlert type="warning" message="High municipal pressure (> 5.5 bar). A pressure reducing valve (PRV) may be required to protect fixtures." />
                      )}
                    </div>`
);

code = code.replace(
  '<input type="number" min="0.1" step="0.1" value={requiredResidual} onChange={(e) => setRequiredResidual(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />\n                    </div>',
  `<input type="number" min="0.1" step="0.1" value={requiredResidual} onChange={(e) => setRequiredResidual(Number(e.target.value) || 0)} className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-xs font-mono border border-slate-800 focus:border-cyan-500" />
                      {requiredResidual !== 0 && requiredResidual < 0.5 && (
                        <InputAlert type="warning" message="Very low residual pressure. Standard fixtures typically require at least 0.5 - 1.0 bar (8-15 psi)." />
                      )}
                      {requiredResidual !== 0 && requiredResidual > 3.0 && (
                        <InputAlert type="warning" message="High residual requirement. Standard fixtures need 1.0-2.0 bar unless specialized (e.g., flushometer)." />
                      )}
                    </div>`
);

// Also boosterResidualPress
code = code.replace(
  '                      {boosterResidualPress !== 0 && (boosterResidualPress < 1.0 || boosterResidualPress > 6.0) && (\n                        <InputAlert type="error" message="Safe range: 1.0 - 6.0 bar" />\n                      )}',
  `                      {boosterResidualPress !== 0 && (boosterResidualPress < 1.0 || boosterResidualPress > 6.0) && (
                        <InputAlert type="error" message="Absolute calculation limits: 1.0 - 6.0 bar" />
                      )}
                      {boosterResidualPress !== 0 && boosterResidualPress >= 1.0 && boosterResidualPress <= 6.0 && boosterResidualPress > 3.0 && (
                        <InputAlert type="warning" message="High residual pressure. Standard fixtures require 1.0 - 2.0 bar." />
                      )}`
);

// boosterFrictionPercent
code = code.replace(
  '                      {boosterFrictionPercent !== 0 && (boosterFrictionPercent < 5 || boosterFrictionPercent > 45) && (\n                        <InputAlert type="error" message="Safe range: 5% - 45%" />\n                      )}',
  `                      {boosterFrictionPercent !== 0 && (boosterFrictionPercent < 5 || boosterFrictionPercent > 45) && (
                        <InputAlert type="error" message="Absolute calculation limits: 5% - 45%" />
                      )}
                      {boosterFrictionPercent !== 0 && boosterFrictionPercent >= 5 && boosterFrictionPercent <= 45 && (boosterFrictionPercent < 10 || boosterFrictionPercent > 30) && (
                        <InputAlert type="warning" message={\`Typical friction allowance is 15-25%. \${boosterFrictionPercent > 30 ? 'High allowance may oversize the pump.' : 'Low allowance may under-size the pump if fittings are numerous.'}\`} />
                      )}`
);

fs.writeFileSync('src/components/PlumbingCalc.tsx', code);
