import re

with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

search_str = """              <div className="bg-sky-950/20 border border-sky-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-sky-300 mb-2">Ventilation Rate (ASHRAE 62.1)</h4>
                <p className="text-xs text-slate-300 mb-4">Calculates the required outdoor airflow using the breathing-zone ventilation rate and zone air distribution effectiveness.</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-200">Eq 1 — Breathing Zone Outdoor Airflow</p>
                    <code className="text-emerald-400 text-xs font-mono">Vbz = (Rp × Pz) + (Ra × Az)</code>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Eq 2 — Zone Outdoor Airflow</p>
                    <code className="text-emerald-400 text-xs font-mono">Voz = Vbz / Ez</code>
                  </div>
                  {useTempAdj && (
                    <div>
                      <p className="text-xs font-bold text-slate-200">Eq 3 — Actual Flow (Density Adjusted)</p>
                      <code className="text-emerald-400 text-xs font-mono">Voz(actual) = Voz × (T_actual / T_std)</code>
                    </div>
                  )}
                </div>
                
                <p className="text-xs font-bold text-slate-300 mb-1">FORMULA PARAMETERS</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li><span className="font-mono text-slate-300">Vbz</span> = Breathing zone outdoor airflow</li>
                  <li><span className="font-mono text-slate-300">Voz</span> = Zone outdoor airflow required</li>
                  <li><span className="font-mono text-slate-300">Rp</span> = Outdoor airflow rate required per person</li>
                  <li><span className="font-mono text-slate-300">Pz</span> = Zone population (number of people)</li>
                  <li><span className="font-mono text-slate-300">Ra</span> = Outdoor airflow rate required per unit area</li>
                  <li><span className="font-mono text-slate-300">Az</span> = Net occupiable zone floor area</li>
                  <li><span className="font-mono text-slate-300">Ez</span> = Zone air distribution effectiveness</li>
                  {useTempAdj && (
                    <>
                      <li><span className="font-mono text-slate-300">T_actual</span> = Actual absolute air temperature</li>
                      <li><span className="font-mono text-slate-300">T_std</span> = Standard absolute air temperature</li>
                    </>
                  )}
                </ul>
              </div>"""

replacement_str = """              <div className="bg-sky-950/20 border border-sky-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-sky-300 mb-2">
                  {selectedSpaceId === 'restroom' ? 'Exhaust Rate (ASHRAE 62.1)' : 'Ventilation Rate (ASHRAE 62.1)'}
                </h4>
                <p className="text-xs text-slate-300 mb-4">
                  {selectedSpaceId === 'restroom' 
                    ? 'Calculates the required exhaust airflow using the area-based exhaust rate.'
                    : 'Calculates the required outdoor airflow using the breathing-zone ventilation rate and zone air distribution effectiveness.'}
                </p>
                
                <div className="space-y-3 mb-4">
                  {selectedSpaceId === 'restroom' ? (
                    <div>
                      <p className="text-xs font-bold text-slate-200">Eq 1 — Minimum Exhaust Airflow</p>
                      <code className="text-emerald-400 text-xs font-mono">Q_exh = Ra × Az</code>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Eq 1 — Breathing Zone Outdoor Airflow</p>
                        <code className="text-emerald-400 text-xs font-mono">Vbz = (Rp × Pz) + (Ra × Az)</code>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">Eq 2 — Zone Outdoor Airflow</p>
                        <code className="text-emerald-400 text-xs font-mono">Voz = Vbz / Ez</code>
                      </div>
                    </>
                  )}
                  {useTempAdj && (
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        {selectedSpaceId === 'restroom' ? 'Eq 2 — Actual Flow (Density Adjusted)' : 'Eq 3 — Actual Flow (Density Adjusted)'}
                      </p>
                      <code className="text-emerald-400 text-xs font-mono">
                        {selectedSpaceId === 'restroom' ? 'Q_exh(actual) = Q_exh × (T_actual / T_std)' : 'Voz(actual) = Voz × (T_actual / T_std)'}
                      </code>
                    </div>
                  )}
                </div>
                
                <p className="text-xs font-bold text-slate-300 mb-1">FORMULA PARAMETERS</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  {selectedSpaceId === 'restroom' ? (
                    <>
                      <li><span className="font-mono text-slate-300">Q_exh</span> = Required exhaust airflow</li>
                      <li><span className="font-mono text-slate-300">Ra</span> = Exhaust airflow rate required per unit area</li>
                      <li><span className="font-mono text-slate-300">Az</span> = Net occupiable zone floor area</li>
                    </>
                  ) : (
                    <>
                      <li><span className="font-mono text-slate-300">Vbz</span> = Breathing zone outdoor airflow</li>
                      <li><span className="font-mono text-slate-300">Voz</span> = Zone outdoor airflow required</li>
                      <li><span className="font-mono text-slate-300">Rp</span> = Outdoor airflow rate required per person</li>
                      <li><span className="font-mono text-slate-300">Pz</span> = Zone population (number of people)</li>
                      <li><span className="font-mono text-slate-300">Ra</span> = Outdoor airflow rate required per unit area</li>
                      <li><span className="font-mono text-slate-300">Az</span> = Net occupiable zone floor area</li>
                      <li><span className="font-mono text-slate-300">Ez</span> = Zone air distribution effectiveness</li>
                    </>
                  )}
                  {useTempAdj && (
                    <>
                      <li><span className="font-mono text-slate-300">T_actual</span> = Actual absolute air temperature</li>
                      <li><span className="font-mono text-slate-300">T_std</span> = Standard absolute air temperature</li>
                    </>
                  )}
                </ul>
              </div>"""

if search_str in content:
    content = content.replace(search_str, replacement_str)
    with open('src/components/VentilationCalc.tsx', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("String not found")

