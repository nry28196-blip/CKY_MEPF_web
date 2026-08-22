import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# 1. Add boolean flags at the end of Calculation block
calc_end_str = "const voz = vozBase * densityRatio; // Adjusted zone outdoor airflow"

new_flags = """const voz = vozBase * densityRatio; // Adjusted zone outdoor airflow

  // Validations
  const isExtremeArea = isMetric ? area > 50000 : area > 500000;
  const isExtremeTemp = useTempAdj && (isMetric ? (airTemp < -10 || airTemp > 50) : (airTemp < 14 || airTemp > 122));
  const actualDensity = area > 0 ? (occupants / area) * (isMetric ? 100 : 1000) : 0;
  const isExtremeDensity = !useDefaultDensity && actualDensity > (isMetric ? 215 : 200);"""

content = content.replace(calc_end_str, new_flags)

# 2. Add Area Alert
area_block = """                  <Square className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">{areaUnit}</span>
                </div>
              </div>"""

new_area_block = """                  <Square className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">{areaUnit}</span>
                </div>
                {isExtremeArea && (
                  <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Unusually large area. Verify value.
                  </p>
                )}
              </div>"""

content = content.replace(area_block, new_area_block)

# 3. Add Occupants Alert
occ_block = """                  <Users className={`w-4 h-4 absolute left-3 top-2.5 ${useDefaultDensity ? 'text-slate-600' : 'text-slate-500'}`} />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">People</span>
                </div>
              </div>"""

new_occ_block = """                  <Users className={`w-4 h-4 absolute left-3 top-2.5 ${useDefaultDensity ? 'text-slate-600' : 'text-slate-500'}`} />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">People</span>
                </div>
                {isExtremeDensity && (
                  <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> High occupant density. Verify value.
                  </p>
                )}
              </div>"""

content = content.replace(occ_block, new_occ_block)

# 4. Add Temperature Alert
temp_block = """                  <Thermometer className={`w-4 h-4 absolute left-3 top-2.5 ${!useTempAdj ? 'text-slate-600' : 'text-slate-500'}`} />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">{tempUnit}</span>
                </div>
              </div>"""

new_temp_block = """                  <Thermometer className={`w-4 h-4 absolute left-3 top-2.5 ${!useTempAdj ? 'text-slate-600' : 'text-slate-500'}`} />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 select-none">{tempUnit}</span>
                </div>
                {isExtremeTemp && (
                  <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Extreme temperature value. Verify units.
                  </p>
                )}
              </div>"""

content = content.replace(temp_block, new_temp_block)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
