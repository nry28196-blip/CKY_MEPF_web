import re

with open('src/components/KitchenVentilationCalc.tsx', 'r') as f:
    content = f.read()

# Add presets
presets_code = """
  // Quick Presets
  const applyPreset = (dutyType: 'light' | 'medium' | 'heavy' | 'extra', lenImp: number, lenMet: number) => {
    setDuty(dutyType);
    setEquipmentLength(isMetric ? lenMet : lenImp);
  };
"""
content = content.replace('const [exhaustAirflow, setExhaustAirflow] = useState<number>(0);', 'const [exhaustAirflow, setExhaustAirflow] = useState<number>(0);\n' + presets_code)

# Add presets UI
ui_code = """
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Quick Equipment Presets</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => applyPreset('medium', 3, 0.9)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Fryer (Medium)
                </button>
                <button
                  onClick={() => applyPreset('medium', 4, 1.2)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Gas Range (Medium)
                </button>
                <button
                  onClick={() => applyPreset('medium', 4, 1.2)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Griddle (Medium)
                </button>
                <button
                  onClick={() => applyPreset('heavy', 4, 1.2)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Charbroiler (Heavy)
                </button>
                <button
                  onClick={() => applyPreset('extra', 5, 1.5)}
                  className="px-2 py-1 bg-rose-950/30 hover:bg-rose-900/60 text-rose-300 border border-rose-900/30 hover:border-rose-700 text-[10px] font-medium rounded transition-colors"
                >
                  Solid Fuel (Extra)
                </button>
              </div>
            </div>
"""
content = content.replace('<div className="space-y-5">', '<div className="space-y-5">\n' + ui_code)

# Add ASHRAE standard info
ashrae_code = """
             <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-lg flex items-start space-x-3 mt-4">
                <ChefHat className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase">Calculation Standard (ASHRAE 154 / IMC 507)</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    These calculations are based on the unlisted hood formula <span className="font-mono text-rose-400">Q = L × Base Rate</span>, established by <strong>ASHRAE Standard 154</strong> and the <strong>International Mechanical Code (IMC)</strong>. Base extraction rates (CFM per linear foot) are defined by the cooking equipment duty classification and hood canopy configuration.
                  </p>
                </div>
             </div>
"""
content = content.replace('</div>\n             </div>\n          </div>', '</div>\n             </div>\n' + ashrae_code + '          </div>')

with open('src/components/KitchenVentilationCalc.tsx', 'w') as f:
    f.write(content)
