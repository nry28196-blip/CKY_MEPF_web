const fs = require('fs');

let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// 1. System Population
const sysPopTarget = `<input 
                type="number" min="0" placeholder="Defaults to ΣPz"
                value={systemPopulation}
                onChange={(e) => setSystemPopulation(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
              />`;
const sysPopReplacement = `<ValidatedInput 
                type="number" min={0} placeholder="Defaults to ΣPz"
                max={Math.ceil(zoneResults.reduce((sum, z) => sum + z.result.pz, 0))}
                errorMsg="System Population (Ps) cannot exceed the sum of peak zone populations per 62.1-2025 (D ≤ 1.0)"
                value={systemPopulation}
                onChange={(e) => setSystemPopulation(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-sky-500"
              />`;
content = content.replace(sysPopTarget, sysPopReplacement);

// 2. System Primary Airflow
const sysVpsTarget = `<input 
                type="number" min="0" placeholder="Defaults to ΣVpz-min"
                value={systemPrimaryAirflow}
                onChange={(e) => setSystemPrimaryAirflow(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border border-slate-800 focus:border-sky-500"
              />`;
const sysVpsReplacement = `<ValidatedInput 
                type="number" min={systemResult ? Math.ceil(systemResult.sumVpzMin) : 0} placeholder="Defaults to ΣVpz-min"
                errorMsg="System Primary Airflow (Vps) must be ≥ sum of zone minimum primary airflows (ΣVpz-min)"
                value={systemPrimaryAirflow}
                onChange={(e) => setSystemPrimaryAirflow(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm border focus:outline-none focus:border-sky-500"
              />`;
content = content.replace(sysVpsTarget, sysVpsReplacement);

// 3. Zone Area
const areaTarget = `<input 
                  type="number" min="0" step="10"
                  value={zr.input.area}
                  onChange={(e) => updateZone(zr.input.id, 'area', Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-sky-500"
                />`;
const areaReplacement = `<ValidatedInput 
                  type="number" min={0.1} step="10"
                  errorMsg="Zone Area must be > 0"
                  value={zr.input.area}
                  onChange={(e) => updateZone(zr.input.id, 'area', Number(e.target.value))}
                  className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-sky-500"
                />`;
content = content.replace(areaTarget, areaReplacement);

// 4. Zone Occupants
const occTarget = `<input 
                      type="number" min="0"
                      value={zr.input.occupants}
                      onChange={(e) => updateZone(zr.input.id, 'occupants', Number(e.target.value))}
                      disabled={zr.input.useDefaultOccupancy}
                      className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />`;
const occReplacement = `<ValidatedInput 
                      type="number" min={0}
                      errorMsg="Occupants cannot be negative"
                      value={zr.input.occupants}
                      onChange={(e) => updateZone(zr.input.id, 'occupants', Number(e.target.value))}
                      disabled={zr.input.useDefaultOccupancy}
                      className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />`;
content = content.replace(occTarget, occReplacement);

// 5. Design Vpz
const vpzTarget = `<input 
                      type="number" min="0"
                      value={zr.input.primaryAirflow}
                      onChange={(e) => updateZone(zr.input.id, 'primaryAirflow', Number(e.target.value))}
                      className="w-full bg-amber-950/20 text-white rounded-lg px-3 py-2 text-sm border border-amber-900/50 focus:border-amber-500"
                    />`;
const vpzReplacement = `<ValidatedInput 
                      type="number" min={Math.ceil(zr.result.voz)}
                      errorMsg="Design primary airflow (Vpz) must be ≥ required zone outdoor air (Voz) to maintain Zpz ≤ 1.0"
                      value={zr.input.primaryAirflow}
                      onChange={(e) => updateZone(zr.input.id, 'primaryAirflow', Number(e.target.value))}
                      className="w-full bg-amber-950/20 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-amber-500"
                    />`;
content = content.replace(vpzTarget, vpzReplacement);

// 6. Min Vpz-min
const vpzMinTarget = `<input 
                      type="number" min="0" placeholder="Auto (VAV)"
                      value={zr.input.vpzMin}
                      onChange={(e) => updateZone(zr.input.id, 'vpzMin', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-amber-950/10 text-white rounded-lg px-3 py-2 text-sm border border-amber-900/30 focus:border-amber-500"
                    />`;
const vpzMinReplacement = `<ValidatedInput 
                      type="number" min={Math.ceil(zr.result.voz)} max={zr.input.primaryAirflow > 0 ? zr.input.primaryAirflow : undefined}
                      placeholder="Auto (VAV)"
                      errorMsg="Vpz-min must be ≥ Voz to satisfy ventilation at turndown, and ≤ Design Vpz"
                      value={zr.input.vpzMin}
                      onChange={(e) => updateZone(zr.input.id, 'vpzMin', e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-amber-950/10 text-white rounded-lg px-3 py-2 text-sm border focus:outline-none focus:border-amber-500"
                    />`;
content = content.replace(vpzMinTarget, vpzMinReplacement);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Patched inputs");
