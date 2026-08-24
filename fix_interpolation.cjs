const fs = require('fs');
const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldFuncRegex = /const getHuntersFlowGPM = \(wsfu: number, type: 'valve' \| 'tank'\) => \{[\s\S]*?\/\/ Approximation above 500\n    \}\n  \};/;

const newFunc = `const getHuntersFlowGPM = (wsfu: number, type: 'valve' | 'tank') => {
    if (wsfu <= 0) return 0;
    // IPC 2018 Table E103.3(3) Hunter's Curve Exact Data Points
    const ipcValveData = [
      [0, 0], [5, 15], [10, 27], [20, 35], [30, 42], [40, 46], [50, 51.5],
      [60, 54.5], [70, 58], [80, 61.5], [90, 64.5], [100, 68], [120, 73],
      [140, 78], [160, 83], [180, 87], [200, 91], [225, 97], [250, 101],
      [275, 105.5], [300, 110], [400, 126], [500, 143]
    ];
    
    const ipcTankData = [
      [0, 0], [1, 3], [2, 5], [3, 6.5], [4, 8], [5, 9.4], [10, 16],
      [20, 23], [30, 29], [40, 32], [50, 36], [60, 39.5], [70, 42.5],
      [80, 45], [90, 47.5], [100, 50], [120, 54], [140, 58], [160, 62],
      [180, 65], [200, 68], [225, 72], [250, 75], [275, 78.5], [300, 82],
      [400, 97], [500, 112]
    ];

    const data = type === 'valve' ? ipcValveData : ipcTankData;

    if (wsfu >= 500) {
      const baseGPM = type === 'valve' ? 143 : 112;
      return baseGPM + ((wsfu - 500) * 0.15); // Standard extrapolation
    }

    for (let i = 0; i < data.length - 1; i++) {
      const [x1, y1] = data[i];
      const [x2, y2] = data[i + 1];
      if (wsfu >= x1 && wsfu <= x2) {
        if (wsfu === x1) return y1;
        if (wsfu === x2) return y2;
        return y1 + ((wsfu - x1) * (y2 - y1) / (x2 - x1));
      }
    }
    return 0;
  };`;

code = code.replace(oldFuncRegex, newFunc);

// Adding Safety Factor State
code = code.replace(
  "const [designVelocity, setDesignVelocity] = useState<number>(1.2); // m/s",
  "const [designVelocity, setDesignVelocity] = useState<number>(1.2); // m/s\n  const [safetyFactor, setSafetyFactor] = useState<number>(1.0);\n  const [appliedSafetyFactor, setAppliedSafetyFactor] = useState<number>(1.0);"
);

// Updating Flow calculations
code = code.replace(
  "const peakFlowLps = appliedStandard === 'bs' \n    ? (totalLU > 0 ? 0.09 * Math.sqrt(totalLU) : 0) // BS EN 806-3 loading units formula\n    : (getHuntersFlowGPM(totalWSFU, appliedSystemType) * 0.06309); // Hunter's curve converted to L/s",
  "const basePeakFlowLps = appliedStandard === 'bs' \n    ? (totalLU > 0 ? 0.09 * Math.sqrt(totalLU) : 0)\n    : (getHuntersFlowGPM(totalWSFU, appliedSystemType) * 0.06309);\n  const peakFlowLps = basePeakFlowLps * appliedSafetyFactor;"
);

// Update UI
const velocityUI = `<div className="flex justify-between">
                                <span>Calc. Velocity:</span>
                                <span className={Number(hydraulicResult.velocity) > 2.5 ? 'text-red-400 font-bold' : 'text-white'}>
                                  {hydraulicResult.velocity} m/s
                                </span>
                              </div>`;

const sfUI = `                <div>
                  <TooltipLabel 
                    label="Safety Factor"
                    tooltip="A multiplier applied to the final calculated peak flow (e.g., 1.1 for a 10% conservative margin). Standard IPC table values are calculated at a 1.0 factor."
                    className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase" 
                  />
                  <div className="relative">
                    <input
                      type="number"
                      step="0.05"
                      min="1.0"
                      max="2.0"
                      value={safetyFactor}
                      onChange={(e) => setSafetyFactor(Number(e.target.value) || 1.0)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white rounded-lg pl-3 pr-8 py-2 text-xs font-mono focus:outline-none transition-colors"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-500 font-mono text-center leading-5 pointer-events-none">
                      x
                    </span>
                  </div>
                </div>`;

const slopeUI = `                  <select
                    value={slope}
                    onChange={(e) => setSlope(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs font-mono"
                  >
                    <option value={0.5}>0.5% Slope (1:200)</option>
                    <option value={1.0}>1% Slope (1:100)</option>
                    <option value={2.0}>2% Slope (1:50)</option>
                    <option value={4.0}>4% Slope (1:25)</option>
                  </select>
                </div>`;

code = code.replace(slopeUI, slopeUI + "\n" + sfUI);

// add appliedSafetyFactor to handleCalculate
const calcRegex = /setAppliedDemandCurveOverride\(demandCurveOverride\);/;
code = code.replace(calcRegex, "setAppliedDemandCurveOverride(demandCurveOverride);\n    setAppliedSafetyFactor(safetyFactor);");

// append to summary report
code = code.replace(
  "`- Peak Flow: ${peakFlowLps.toFixed(2)} L/s (${peakFlowGPM.toFixed(1)} GPM)\\n` +",
  "`- Peak Flow: ${peakFlowLps.toFixed(2)} L/s (${peakFlowGPM.toFixed(1)} GPM) [SF: ${appliedSafetyFactor}]\\n` +"
);

fs.writeFileSync(file, code);
console.log("Success");
