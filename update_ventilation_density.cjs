const fs = require('fs');
let content = fs.readFileSync('src/components/VentilationCalc.tsx', 'utf8');

// 1. Add state for altitude
content = content.replace(
  "const [useTempAdj, setUseTempAdj] = useState<boolean>(false);",
  "const [useTempAdj, setUseTempAdj] = useState<boolean>(false);\n  const [altitude, setAltitude] = useState<number>(0); // m or ft\n  const [useAltitudeAdj, setUseAltitudeAdj] = useState<boolean>(false);"
);

// 2. Update Air Density Adjustment Logic
const logicRegex = /\/\/ Air Density Adjustment[\s\S]*?const voz = vozBase \* densityRatio; \/\/ Adjusted zone outdoor airflow/;
const newLogic = `// Air Density Adjustment (Psychrometrics & Altitude)
  const tempUnit = isMetric ? '°C' : '°F';
  const altUnit = isMetric ? 'm' : 'ft';
  const stdTempAbs = isMetric ? 20 + 273.15 : 70 + 459.67;
  const actualTempAbs = isMetric ? airTemp + 273.15 : airTemp + 459.67;
  const tempRatio = useTempAdj ? (actualTempAbs / stdTempAbs) : 1.0; 
  
  // P = P0 * (1 - 2.25577e-5 * h)^5.2559
  const altMeters = isMetric ? altitude : altitude * 0.3048;
  // Lower pressure at altitude means lower density, which means larger volume required for the same mass flow.
  // The volume ratio multiplier is P_sea_level / P_local
  const pressRatio = useAltitudeAdj ? (1.0 / Math.pow(1 - 2.25577e-5 * altMeters, 5.2559)) : 1.0;
  
  const densityRatio = tempRatio * pressRatio; 
  
  const voz = vozBase * densityRatio; // Adjusted zone outdoor airflow`;

content = content.replace(logicRegex, newLogic);

// 3. Update the UI to include Altitude Adjustment
const uiRegex = /<div className="pt-3 border-t border-slate-800\/50">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">/;

const newUi = `<div className="pt-3 border-t border-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <TooltipLabel label={\`Air Temperature (\${tempUnit})\`} tooltip={t("airTempTooltip")} status={useTempAdj ? (isExtremeTemp ? 'warning' : 'success') : null} />
                      <label className="flex items-center text-[10px] font-medium text-slate-400 cursor-pointer hover:text-slate-300">
                        <input
                          type="checkbox"
                          checked={useTempAdj}
                          onChange={(e) => setUseTempAdj(e.target.checked)}
                          className="mr-1.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
                        />
                        Temp Adj.
                      </label>
                    </div>
                    <div className="relative mb-3">
                      <input
                        type="number"
                        disabled={!useTempAdj}
                        value={airTemp === 0 && !useTempAdj ? '' : airTemp}
                        onChange={(e) => {
                          if (useTempAdj) setAirTemp(e.target.value === '' ? 0 : Number(e.target.value));
                        }}
                        className={\`w-full border rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none transition-colors \${
                          !useTempAdj 
                            ? 'bg-slate-900/50 border-slate-800/50 text-slate-600' 
                            : 'bg-slate-950 border-slate-700 text-white focus:border-amber-500/50'
                        }\`}
                      />
                      <Thermometer className={\`w-3.5 h-3.5 absolute left-3 top-2.5 \${useTempAdj ? 'text-amber-500/70' : 'text-slate-700'}\`} />
                    </div>

                    <div className="flex items-center justify-between mb-2 pt-2 border-t border-slate-800/50">
                      <TooltipLabel label={\`Project Altitude (\${altUnit})\`} tooltip="Corrects air density for non-sea-level locations, affecting volumetric flow rates." status={useAltitudeAdj ? 'success' : null} />
                      <label className="flex items-center text-[10px] font-medium text-slate-400 cursor-pointer hover:text-slate-300">
                        <input
                          type="checkbox"
                          checked={useAltitudeAdj}
                          onChange={(e) => setUseAltitudeAdj(e.target.checked)}
                          className="mr-1.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
                        />
                        Altitude Adj.
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        disabled={!useAltitudeAdj}
                        value={altitude === 0 && !useAltitudeAdj ? '' : altitude}
                        onChange={(e) => {
                          if (useAltitudeAdj) setAltitude(e.target.value === '' ? 0 : Number(e.target.value));
                        }}
                        className={\`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors \${
                          !useAltitudeAdj 
                            ? 'bg-slate-900/50 border-slate-800/50 text-slate-600' 
                            : 'bg-slate-950 border-slate-700 text-white focus:border-amber-500/50'
                        }\`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">`;

content = content.replace(uiRegex, newUi);

// 4. Update equation display in VentilationCalc
const eqDisplayRegex = /{useTempAdj && \(\s*<div>\s*<p className="text-xs font-bold text-slate-200">\s*{selectedSpaceId === 'restroom' \? 'Eq 2 — Actual Flow \(Density Adjusted\)' : 'Eq 3 — Actual Flow \(Density Adjusted\)'}\s*<\/p>\s*<code className="text-emerald-400 text-xs font-mono">\s*{selectedSpaceId === 'restroom' \? 'Q_exh\(actual\) = Q_exh × \(T_actual \/ T_std\)' : 'Voz\(actual\) = Voz × \(T_actual \/ T_std\)'}\s*<\/code>\s*<\/div>\s*\)}/;

const newEqDisplay = `{(useTempAdj || useAltitudeAdj) && (
                    <div className="mt-4 bg-slate-950 p-3 rounded border border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {selectedSpaceId === 'restroom' ? 'Eq 2 — Density Corrected Flow' : 'Eq 3 — Density Corrected Flow'}
                      </p>
                      <code className="text-emerald-400 text-[10px] font-mono block">
                        {selectedSpaceId === 'restroom' 
                          ? 'Q_exh(actual) = Q_exh × Vol_Ratio' 
                          : 'Voz(actual) = Voz × Vol_Ratio'}
                      </code>
                      <code className="text-sky-400 text-[10px] font-mono block mt-1">
                        Vol_Ratio = {useTempAdj ? '(T_actual / T_std)' : '1.0'} {useAltitudeAdj ? '× (P_std / P_local)' : ''} = {densityRatio.toFixed(3)}
                      </code>
                    </div>
                  )}`;

content = content.replace(eqDisplayRegex, newEqDisplay);

const eqParamsRegex = /{useTempAdj && \(\s*<>\s*<li><span className="font-mono text-slate-300">T_actual<\/span> = Actual absolute air temperature<\/li>\s*<li><span className="font-mono text-slate-300">T_std<\/span> = Standard absolute air temperature<\/li>\s*<\/>\s*\)}/;
const newEqParams = `{(useTempAdj || useAltitudeAdj) && (
                    <>
                      {useTempAdj && <li><span className="font-mono text-slate-300">T_actual</span> = Actual absolute air temperature</li>}
                      {useTempAdj && <li><span className="font-mono text-slate-300">T_std</span> = Standard absolute air temperature</li>}
                      {useAltitudeAdj && <li><span className="font-mono text-slate-300">P_local</span> = Local barometric pressure at altitude</li>}
                      {useAltitudeAdj && <li><span className="font-mono text-slate-300">P_std</span> = Standard sea-level pressure</li>}
                    </>
                  )}`;
content = content.replace(eqParamsRegex, newEqParams);

fs.writeFileSync('src/components/VentilationCalc.tsx', content);
console.log('Updated VentilationCalc');
