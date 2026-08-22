import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

old_block = """                )}
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS PANEL */}"""

new_block = """                )}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <TooltipLabel label={`Air Temperature (${tempUnit})`} tooltip="Adjust calculations to reflect actual air density based on temperature, converting Standard volume to Actual volume." />
                  <label className="flex items-center text-xs text-slate-400 cursor-pointer hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={useTempAdj}
                      onChange={(e) => setUseTempAdj(e.target.checked)}
                      className="mr-2 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900"
                    />
                    Adjust Density
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    disabled={!useTempAdj}
                    value={airTemp === 0 && !useTempAdj ? '' : airTemp}
                    onChange={(e) => {
                      if (useTempAdj) setAirTemp(e.target.value === '' ? 0 : Number(e.target.value));
                    }}
                    className={`w-full border rounded-lg px-3 py-2 pl-9 text-sm focus:outline-none transition-colors ${
                      !useTempAdj 
                        ? 'bg-slate-900/50 border-slate-800/50 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  <Thermometer className={`w-4 h-4 absolute left-3 top-2.5 ${!useTempAdj ? 'text-slate-600' : 'text-slate-500'}`} />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">{tempUnit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS PANEL */}"""

content = content.replace(old_block, new_block)

# Add formula to info box
old_info = """                  <div>
                    <p className="text-xs font-bold text-slate-200">Eq 2 — Zone Outdoor Airflow</p>
                    <code className="text-emerald-400 text-xs font-mono">Voz = Vbz / Ez</code>
                  </div>
                </div>"""

new_info = """                  <div>
                    <p className="text-xs font-bold text-slate-200">Eq 2 — Zone Outdoor Airflow</p>
                    <code className="text-emerald-400 text-xs font-mono">Voz = Vbz / Ez</code>
                  </div>
                  {useTempAdj && (
                    <div>
                      <p className="text-xs font-bold text-slate-200">Eq 3 — Actual Flow (Density Adjusted)</p>
                      <code className="text-emerald-400 text-xs font-mono">Voz(actual) = Voz × (T_actual / T_std)</code>
                    </div>
                  )}
                </div>"""

content = content.replace(old_info, new_info)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
