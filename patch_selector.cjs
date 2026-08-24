const fs = require('fs');
const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add state variable
code = code.replace(
  "const [appliedStandard, setAppliedStandard] = useState<'ipc' | 'bs'>('ipc');",
  "const [appliedStandard, setAppliedStandard] = useState<'ipc' | 'bs'>('ipc');\n  const [demandCurveOverride, setDemandCurveOverride] = useState<'auto' | 'valve' | 'tank'>('auto');\n  const [appliedDemandCurveOverride, setAppliedDemandCurveOverride] = useState<'auto' | 'valve' | 'tank'>('auto');"
);

// 2. Update determineSystemType
code = code.replace(
  "const determineSystemType = (fxs: FixtureRow[]) => {",
  "const determineSystemType = (fxs: FixtureRow[], override: 'auto' | 'valve' | 'tank' = 'auto') => {\n    if (override !== 'auto') return override;"
);

// 3. Update calls to determineSystemType
code = code.replace(
  "const systemType = determineSystemType(appliedFixtures);",
  "const systemType = determineSystemType(appliedFixtures, appliedDemandCurveOverride);\n  const liveSystemType = determineSystemType(fixtures, demandCurveOverride);"
);
code = code.replace(
  "const appliedSystemType = determineSystemType(appliedFixtures);",
  "const appliedSystemType = determineSystemType(appliedFixtures, appliedDemandCurveOverride);"
);

// 4. Update the UI
const oldUI = `<div className="flex items-center space-x-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Demand Curve:</label>
                      <div className="bg-slate-950 border border-slate-800 text-cyan-400 rounded px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {systemType} System
                      </div>
                    </div>`;
                    
const newUI = `<div className="flex items-center space-x-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Demand Curve:</label>
                      <select
                        value={demandCurveOverride}
                        onChange={(e) => setDemandCurveOverride(e.target.value as 'auto' | 'valve' | 'tank')}
                        className="bg-slate-950 border border-slate-800 text-cyan-400 rounded px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider outline-none cursor-pointer focus:border-cyan-500/50"
                      >
                        <option value="auto">Auto ({determineSystemType(fixtures, 'auto')} System)</option>
                        <option value="valve">Valve System</option>
                        <option value="tank">Tank System</option>
                      </select>
                    </div>`;

code = code.replace(oldUI, newUI);

// 5. Update handleCalculate to save override
const calcRegex = /const handleCalculate = \(\) => \{[\s\S]*?setAppliedStandard\(standard\);/;
code = code.replace(calcRegex, (match) => {
    return match + "\n    setAppliedDemandCurveOverride(demandCurveOverride);";
});

fs.writeFileSync(file, code);
console.log("Patched!");
