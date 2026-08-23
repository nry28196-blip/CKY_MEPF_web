import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# Fix determineSystemType
search1 = """  const determineSystemType = (fxs: FixtureRow[]) => {
    const valveWSFU = fxs.filter(f => f.isFlushometer).reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
    const tankWSFU = fxs.filter(f => !f.isFlushometer).reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
    return valveWSFU > tankWSFU ? 'valve' : 'tank';
  };"""

replace1 = """  const determineSystemType = (fxs: FixtureRow[]) => {
    const valveWSFU = fxs.filter(f => f.id.includes('_fv')).reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
    const tankWSFU = fxs.filter(f => !f.id.includes('_fv')).reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
    return valveWSFU > tankWSFU ? 'valve' : 'tank';
  };"""

content = content.replace(search1, replace1)

# Remove manualSystemType from dependencies
search2 = """autoCalculate, standard, fixtures, manualSystemType, designVelocity, slope, occupants,"""
replace2 = """autoCalculate, standard, fixtures, designVelocity, slope, occupants,"""
content = content.replace(search2, replace2)

# Remove manualSystemType from hasPendingChanges
search3 = """    JSON.stringify(fixtures) !== JSON.stringify(appliedFixtures) ||
    manualSystemType !== appliedManualSystemType ||
    designVelocity !== appliedDesignVelocity ||"""
replace3 = """    JSON.stringify(fixtures) !== JSON.stringify(appliedFixtures) ||
    designVelocity !== appliedDesignVelocity ||"""
content = content.replace(search3, replace3)

# Replace the Demand Curve dropdown in the results section with a static display
search4 = """                  ) : (
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

replace4 = """                  ) : (
                    <div className="flex items-center space-x-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Demand Curve:</label>
                      <div className="bg-slate-950 border border-slate-800 text-cyan-400 rounded px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {systemType} System
                      </div>
                    </div>
                  )}"""

content = content.replace(search4, replace4)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
