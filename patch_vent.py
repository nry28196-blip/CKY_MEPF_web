import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# Replace the Info Box
old_info = """            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="bg-sky-950/20 border border-sky-900/50 rounded-lg p-3 flex items-start space-x-3">
                <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <p className="font-semibold text-sky-300 mb-1">Breathing Zone Outdoor Air (Vbz) = Rp × Pz + Ra × Az</p>
                  <p>Zone Outdoor Air (Voz) is calculated by dividing Vbz by the zone air distribution effectiveness (Ez = {zoneEz}).</p>
                </div>
              </div>
            </div>"""

new_info = """            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="bg-sky-950/20 border border-sky-900/50 rounded-lg p-4">
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
                </ul>
              </div>
            </div>"""

content = content.replace(old_info, new_info)

# Add Vbz to the results panel
old_res = """                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                  <p className="text-slate-400 text-xs font-medium mb-1">Required Zone Outdoor Air (Voz)</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black text-white tracking-tight">{Math.ceil(voz).toLocaleString()}</span>
                    <span className="text-emerald-400 font-semibold">{flowUnit}</span>
                  </div>
                </div>"""

new_res = """                <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 relative overflow-hidden">
                  <p className="text-slate-400 text-xs font-medium mb-1">Breathing Zone Outdoor Air (Vbz)</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-slate-300">{Math.ceil(vbz).toLocaleString()}</span>
                    <span className="text-slate-500 text-sm font-semibold">{flowUnit}</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Required Zone Outdoor Air (Voz)</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-black text-white tracking-tight">{Math.ceil(voz).toLocaleString()}</span>
                    <span className="text-emerald-400 font-semibold">{flowUnit}</span>
                  </div>
                </div>"""

content = content.replace(old_res, new_res)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
