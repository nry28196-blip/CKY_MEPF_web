import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# Replace manualSystemType logic
# We will calculate total flush valve wsfu vs flush tank wsfu
search_state = """  const [manualSystemType, setManualSystemType] = useState<'auto' | 'valve' | 'tank'>('auto');
  const [appliedManualSystemType, setAppliedManualSystemType] = useState<'auto' | 'valve' | 'tank'>('auto');
  const hasFlushometer = (fxs: FixtureRow[]) => fxs.some(f => f.qty > 0 && f.id.includes('_fv'));
  const systemType = appliedManualSystemType === 'auto' 
    ? (hasFlushometer(appliedFixtures) ? 'valve' : 'tank') 
    : appliedManualSystemType;"""

replace_state = """  const determineSystemType = (fxs: FixtureRow[]) => {
    const valveWSFU = fxs.filter(f => f.isFlushometer).reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
    const tankWSFU = fxs.filter(f => !f.isFlushometer).reduce((sum, f) => sum + (f.wsfu * f.qty), 0);
    return valveWSFU > tankWSFU ? 'valve' : 'tank';
  };
  const systemType = determineSystemType(appliedFixtures);"""

content = content.replace(search_state, replace_state)

# Remove the dropdown for manual system type
search_dropdown = """                  <div className="pt-2 border-t border-slate-800">
                    <TooltipLabel 
                      label="IPC Calculation Mode" 
                      tooltip="Override the Hunter's curve calculation mode. Auto uses Flushometer curve if any flush valve fixtures are present."
                      className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" 
                    />
                    <select
                      value={manualSystemType}
                      onChange={(e) => setManualSystemType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs font-mono"
                    >
                      <option value="auto">Auto-detect from fixtures</option>
                      <option value="valve">Force Flush Valves (Commercial)</option>
                      <option value="tank">Force Flush Tanks (Residential)</option>
                    </select>
                  </div>"""

replace_dropdown = """                  <div className="pt-2 border-t border-slate-800">
                    <TooltipLabel 
                      label="IPC Calculation Mode" 
                      tooltip="The system automatically determines the dominant Hunter's Curve based on the predominant WSFU load (Flush Valves vs. Flush Tanks)."
                      className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" 
                    />
                    <div className="w-full bg-slate-950/50 border border-slate-800/50 text-cyan-400 rounded-lg px-3 py-2 text-xs font-mono capitalize">
                      {determineSystemType(fixtures)} System (Auto-detected)
                    </div>
                  </div>"""

content = content.replace(search_dropdown, replace_dropdown)

# Remove manualSystemType from saving state
search_save1 = "setAppliedManualSystemType(manualSystemType);"
replace_save1 = ""
content = content.replace(search_save1, replace_save1)

search_save2 = "manualSystemType: appliedManualSystemType,"
replace_save2 = ""
content = content.replace(search_save2, replace_save2)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
