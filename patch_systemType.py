import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# Replace the systemType constant with a state
search_str = """  const hasFlushometer = (fxs: FixtureRow[]) => fxs.some(f => f.qty > 0 && f.id.includes('_fv'));
  const systemType = hasFlushometer(fixtures) ? 'valve' : 'tank';"""

replacement_str = """  const [manualSystemType, setManualSystemType] = useState<'auto' | 'valve' | 'tank'>('auto');
  const [appliedManualSystemType, setAppliedManualSystemType] = useState<'auto' | 'valve' | 'tank'>('auto');
  const hasFlushometer = (fxs: FixtureRow[]) => fxs.some(f => f.qty > 0 && f.id.includes('_fv'));
  const systemType = appliedManualSystemType === 'auto' 
    ? (hasFlushometer(appliedFixtures) ? 'valve' : 'tank') 
    : appliedManualSystemType;"""

content = content.replace(search_str, replacement_str)

# In handleApplyCalculations, apply manualSystemType
search_apply = """    setAppliedStandard(standard);
    setAppliedFixtures(JSON.parse(JSON.stringify(fixtures)));"""

replace_apply = """    setAppliedStandard(standard);
    setAppliedFixtures(JSON.parse(JSON.stringify(fixtures)));
    setAppliedManualSystemType(manualSystemType);"""

content = content.replace(search_apply, replace_apply)

# In useEffect for autoCalculate
search_effect = """      setAppliedStandard(standard);
      setAppliedFixtures(JSON.parse(JSON.stringify(fixtures)));"""

replace_effect = """      setAppliedStandard(standard);
      setAppliedFixtures(JSON.parse(JSON.stringify(fixtures)));
      setAppliedManualSystemType(manualSystemType);"""

content = content.replace(search_effect, replace_effect)

# In useEffect dependency array
search_effect_deps = """autoCalculate, standard, fixtures, designVelocity, slope, occupants,"""
replace_effect_deps = """autoCalculate, standard, fixtures, manualSystemType, designVelocity, slope, occupants,"""

content = content.replace(search_effect_deps, replace_effect_deps)

# In hasPendingChanges
search_pending = """    JSON.stringify(fixtures) !== JSON.stringify(appliedFixtures) ||"""
replace_pending = """    JSON.stringify(fixtures) !== JSON.stringify(appliedFixtures) ||
    manualSystemType !== appliedManualSystemType ||"""

content = content.replace(search_pending, replace_pending)

# In parameters restore
search_restore = """        if (p.fixtures) { setFixtures(p.fixtures); setAppliedFixtures(p.fixtures); }"""
replace_restore = """        if (p.fixtures) { setFixtures(p.fixtures); setAppliedFixtures(p.fixtures); }
        if (p.manualSystemType) { setManualSystemType(p.manualSystemType); setAppliedManualSystemType(p.manualSystemType); }"""

content = content.replace(search_restore, replace_restore)

# Update the UI dropdown
search_ui = """                  ) : (
                    <div className="flex items-center space-x-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Auto Curve:</label>
                      <span className="bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-cyan-400 rounded px-2.5 py-1">
                        {systemType === 'valve' ? "Flushometer Valves" : "Flush Tanks"}
                      </span>
                    </div>
                  )}"""

replace_ui = """                  ) : (
                    <div className="flex items-center space-x-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Demand Curve:</label>
                      <select
                        value={manualSystemType}
                        onChange={(e) => setManualSystemType(e.target.value as 'auto' | 'valve' | 'tank')}
                        className="bg-slate-950 border border-slate-800 text-white rounded px-2.5 py-1 text-[10px] font-mono font-bold outline-none focus:border-cyan-500"
                      >
                        <option value="auto">Auto ({hasFlushometer(fixtures) ? 'Valve' : 'Tank'})</option>
                        <option value="valve">Force Flush Valve (Commercial)</option>
                        <option value="tank">Force Flush Tank (Residential)</option>
                      </select>
                    </div>
                  )}"""

content = content.replace(search_ui, replace_ui)

# Update TrendVisualizer currentParams to include systemType
search_trend = """        currentParams={{
          totalLU: totalLU,
          peakFlowLps: peakFlowLps,
          standard: appliedStandard,"""

replace_trend = """        currentParams={{
          totalLU: totalLU,
          peakFlowLps: peakFlowLps,
          standard: appliedStandard,
          systemType: systemType,"""

content = content.replace(search_trend, replace_trend)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)

