import re

with open('src/components/KitchenVentilationCalc.tsx', 'r') as f:
    content = f.read()

# Add display unit state
state_search = "const [exhaustAirflow, setExhaustAirflow] = useState<number>(0);"
state_replace = """const [exhaustAirflow, setExhaustAirflow] = useState<number>(0);
  const [displayUnit, setDisplayUnit] = useState<'CFM' | 'L/s'>(isMetric ? 'L/s' : 'CFM');

  // Sync default when global unit system changes (optional, but good for consistency)
  useEffect(() => {
    setDisplayUnit(isMetric ? 'L/s' : 'CFM');
  }, [isMetric]);
"""
content = content.replace(state_search, state_replace)

# Modify Results UI
# From:
"""
            <div className="text-center z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Exhaust Airflow</p>
              <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md">
                {Math.round(exhaustAirflow).toLocaleString()}
                <span className="text-lg font-bold text-rose-400 ml-2 uppercase tracking-widest">{isMetric ? 'L/s' : 'CFM'}</span>
              </p>
              {isMetric && (
                <p className="text-sm text-slate-500 font-mono mt-2">
                  {Math.round(exhaustAirflow * 3.6).toLocaleString()} m³/h
                </p>
              )}
            </div>
"""

results_search = """            <div className="text-center z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Exhaust Airflow</p>
              <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md">
                {Math.round(exhaustAirflow).toLocaleString()}
                <span className="text-lg font-bold text-rose-400 ml-2 uppercase tracking-widest">{isMetric ? 'L/s' : 'CFM'}</span>
              </p>
              {isMetric && (
                <p className="text-sm text-slate-500 font-mono mt-2">
                  {Math.round(exhaustAirflow * 3.6).toLocaleString()} m³/h
                </p>
              )}
            </div>"""

results_replace = """            <div className="absolute top-4 right-4 z-20 flex bg-slate-900/80 border border-slate-700 p-0.5 rounded-lg text-[9px] font-bold uppercase backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setDisplayUnit('CFM')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  displayUnit === 'CFM' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                CFM
              </button>
              <button
                type="button"
                onClick={() => setDisplayUnit('L/s')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  displayUnit === 'L/s' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                L/s
              </button>
            </div>
            <div className="text-center z-10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Required Exhaust Airflow</p>
              <p className="text-5xl font-black text-white font-mono tracking-tight drop-shadow-md">
                {displayUnit === 'L/s' 
                  ? Math.round(isMetric ? exhaustAirflow : exhaustAirflow * 0.471947).toLocaleString()
                  : Math.round(isMetric ? exhaustAirflow * 2.11888 : exhaustAirflow).toLocaleString()}
                <span className="text-lg font-bold text-rose-400 ml-2 uppercase tracking-widest">{displayUnit}</span>
              </p>
              {displayUnit === 'L/s' && (
                <p className="text-sm text-slate-500 font-mono mt-2">
                  {Math.round((isMetric ? exhaustAirflow : exhaustAirflow * 0.471947) * 3.6).toLocaleString()} m³/h
                </p>
              )}
            </div>"""
content = content.replace(results_search, results_replace)

with open('src/components/KitchenVentilationCalc.tsx', 'w') as f:
    f.write(content)
