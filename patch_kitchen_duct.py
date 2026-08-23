import re

with open('src/components/KitchenVentilationCalc.tsx', 'r') as f:
    content = f.read()

# 1. Add State
state_search = "const [exhaustAirflow, setExhaustAirflow] = useState<number>(0);"
state_replace = """const [exhaustAirflow, setExhaustAirflow] = useState<number>(0);

  // Duct Sizing Velocity
  const [ductVelocity, setDuctVelocity] = useState<number>(isMetric ? 7.6 : 1500);
  const [ductArea, setDuctArea] = useState<number>(0);

  useEffect(() => {
    setDuctVelocity(isMetric ? 7.6 : 1500);
  }, [isMetric]);
"""
content = content.replace(state_search, state_replace)

# 2. Update the calc logic
calc_search = """    if (isMetric) {
      // 1 CFM = 0.4719 L/s
      setExhaustAirflow(totalCfm * 0.471947);
    } else {
      setExhaustAirflow(totalCfm);
    }
  }, [hoodType, duty, equipmentLength, overhang, isMetric]);"""

calc_replace = """    if (isMetric) {
      const flowLs = totalCfm * 0.471947;
      setExhaustAirflow(flowLs);
      const flowM3s = flowLs / 1000;
      const areaM2 = ductVelocity > 0 ? flowM3s / ductVelocity : 0;
      setDuctArea(areaM2 * 10000);
    } else {
      setExhaustAirflow(totalCfm);
      const areaSqFt = ductVelocity > 0 ? totalCfm / ductVelocity : 0;
      setDuctArea(areaSqFt * 144);
    }
  }, [hoodType, duty, equipmentLength, overhang, isMetric, ductVelocity]);"""
content = content.replace(calc_search, calc_replace)

# 3. Add UI to Inputs
input_search = """            <div>
              <TooltipLabel
                label={`Side Overhang (${isMetric ? 'm' : 'ft'})`}
                tooltip="Hood extension beyond the equipment on each side (Standard minimum is 6 inches or 0.15m)."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
              />
              <input
                type="number"
                min="0"
                step="0.05"
                value={overhang}
                onChange={(e) => setOverhang(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>
          </div>"""

input_replace = """            <div>
              <TooltipLabel
                label={`Side Overhang (${isMetric ? 'm' : 'ft'})`}
                tooltip="Hood extension beyond the equipment on each side (Standard minimum is 6 inches or 0.15m)."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
              />
              <input
                type="number"
                min="0"
                step="0.05"
                value={overhang}
                onChange={(e) => setOverhang(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-800/60">
              <TooltipLabel
                label={`Target Duct Velocity (${isMetric ? 'm/s' : 'FPM'})`}
                tooltip="Code compliance typically requires a minimum grease duct velocity (e.g., 1500 FPM or 7.6 m/s) to keep grease particulates entrained."
                className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase"
              />
              <input
                type="number"
                min="1"
                step={isMetric ? "0.1" : "50"}
                value={ductVelocity}
                onChange={(e) => setDuctVelocity(Number(e.target.value))}
                className="w-full bg-slate-950 text-white rounded-lg px-4 py-2 text-sm font-mono focus:outline-none transition-colors border border-slate-800 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
              />
            </div>
          </div>"""
content = content.replace(input_search, input_replace)


# 4. Add Result UI
result_search = """             <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase">Make-Up Air Requirement</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Commercial kitchen exhaust systems typically require dedicated make-up air equal to 80-90% of the exhaust volume to prevent excessive negative building pressure. Check local mechanical codes.
                  </p>
                </div>
             </div>"""

result_replace = """             <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase">Make-Up Air Requirement</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Commercial kitchen exhaust systems typically require dedicated make-up air equal to 80-90% of the exhaust volume to prevent excessive negative building pressure. Check local mechanical codes.
                  </p>
                </div>
             </div>
             
             <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-lg flex items-start space-x-3 mt-4">
                <Wind className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase">Minimum Duct Area</h4>
                  <p className="text-2xl font-black text-white font-mono mt-1 tracking-tight">
                    {Math.round(ductArea).toLocaleString()} <span className="text-sm font-bold text-rose-400 uppercase">{isMetric ? 'cm²' : 'sq.in'}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Estimated cross-sectional area based on the target velocity to ensure code compliance for grease entrainment.
                  </p>
                </div>
             </div>"""
content = content.replace(result_search, result_replace)


with open('src/components/KitchenVentilationCalc.tsx', 'w') as f:
    f.write(content)
