import re
with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

old_params = """                  <li><span className="font-mono text-slate-300">Az</span> = Net occupiable zone floor area</li>
                  <li><span className="font-mono text-slate-300">Ez</span> = Zone air distribution effectiveness</li>
                </ul>"""

new_params = """                  <li><span className="font-mono text-slate-300">Az</span> = Net occupiable zone floor area</li>
                  <li><span className="font-mono text-slate-300">Ez</span> = Zone air distribution effectiveness</li>
                  {useTempAdj && (
                    <>
                      <li><span className="font-mono text-slate-300">T_actual</span> = Actual absolute air temperature</li>
                      <li><span className="font-mono text-slate-300">T_std</span> = Standard absolute air temperature</li>
                    </>
                  )}
                </ul>"""

content = content.replace(old_params, new_params)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
