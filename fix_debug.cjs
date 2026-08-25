const fs = require('fs');

const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update getHuntersFlowGPM
const oldFuncRegex = /const getHuntersFlowGPM = \(wsfu: number, type: 'valve' \| 'tank'\) => \{[\s\S]*?return 0;\n  \};/;
const newFunc = `const getHuntersFlowGPM = (wsfu: number, type: 'valve' | 'tank'): {gpm: number, log: string} => {
    if (wsfu <= 0) return {gpm: 0, log: 'WSFU is 0 or less.'};
    // IPC 2018 Table E103.3(3) Hunter's Curve Exact Data Points
    const ipcValveData = [
      [0, 0], [5, 15], [10, 27], [15, 31], [20, 35], [25, 38], [30, 42], [35, 44],
      [40, 46], [45, 48], [50, 50], [60, 54], [70, 58], [80, 61.2], [90, 64.3],
      [100, 67.5], [120, 73], [140, 77], [160, 81], [180, 85.5], [200, 90],
      [225, 95.5], [250, 101], [275, 104.5], [300, 108], [400, 127], [500, 143]
    ];
    
    const ipcTankData = [
      [0, 0], [1, 3], [2, 5], [3, 6.5], [4, 8], [5, 9.4], [10, 14.6],
      [15, 17.5], [20, 19.6], [25, 21.5], [30, 23.3], [35, 24.9], [40, 26.3],
      [45, 27.7], [50, 29.1], [60, 32], [70, 35], [80, 38], [90, 41],
      [100, 43.5], [120, 48], [140, 52.5], [160, 57], [180, 61], [200, 65],
      [225, 70], [250, 75], [275, 80], [300, 85], [400, 105], [500, 124]
    ];

    const data = type === 'valve' ? ipcValveData : ipcTankData;

    if (wsfu >= 500) {
      const baseGPM = type === 'valve' ? 143 : 124;
      const extrapolated = baseGPM + ((wsfu - 500) * 0.15); // Standard extrapolation
      const log = \`Extrapolated: WSFU=\${wsfu.toFixed(1)} => \${extrapolated.toFixed(2)} GPM\`;
      console.log(\`Hunter's Curve \${log}\`);
      return {gpm: extrapolated, log};
    }

    for (let i = 0; i < data.length - 1; i++) {
      const [x1, y1] = data[i];
      const [x2, y2] = data[i + 1];
      if (wsfu >= x1 && wsfu <= x2) {
        if (wsfu === x1) {
          const log = \`Exact Match: WSFU=\${wsfu.toFixed(1)} exactly matches IPC row [x: \${x1}, y: \${y1}] => \${y1} GPM\`;
          console.log(\`Hunter's Curve \${log}\`);
          return {gpm: y1, log};
        }
        if (wsfu === x2) {
          const log = \`Exact Match: WSFU=\${wsfu.toFixed(1)} exactly matches IPC row [x: \${x2}, y: \${y2}] => \${y2} GPM\`;
          console.log(\`Hunter's Curve \${log}\`);
          return {gpm: y2, log};
        }
        const interpolated = y1 + ((wsfu - x1) * (y2 - y1) / (x2 - x1));
        const log = \`Interpolated: WSFU=\${wsfu.toFixed(1)} lies between IPC row [x: \${x1}, y: \${y1}] and [x: \${x2}, y: \${y2}] => \${interpolated.toFixed(2)} GPM\`;
        console.log(\`Hunter's Curve \${log}\`);
        return {gpm: interpolated, log};
      }
    }
    return {gpm: 0, log: 'Out of bounds'};
  };`;

code = code.replace(oldFuncRegex, newFunc);

// Fix invocation
code = code.replace(
  "const peakFlowLps = appliedStandard === 'bs' \n    ? (totalLU > 0 ? 0.09 * Math.sqrt(totalLU) : 0)\n    : (getHuntersFlowGPM(totalWSFU, appliedSystemType) * 0.06309);",
  "const hunterDebug = appliedStandard !== 'bs' ? getHuntersFlowGPM(totalWSFU, appliedSystemType) : null;\n  const peakFlowLps = appliedStandard === 'bs' \n    ? (totalLU > 0 ? 0.09 * Math.sqrt(totalLU) : 0)\n    : (hunterDebug?.gpm || 0) * 0.06309;"
);

// Update UI
const oldUIRegex = /\{standard === 'ipc' && \([\s\S]*?\)\}/;
const newUI = `{standard === 'ipc' && hunterDebug && (
                      <div className="mt-2 bg-slate-900/80 border border-slate-700/50 p-2 rounded-lg">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 text-cyan-500/80">IPC Table E103.3(3) Lookup Debug</span>
                        <span className="block text-[10px] text-slate-300 font-mono leading-relaxed">
                          {hunterDebug.log}
                        </span>
                        <span className="block text-[9px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-800/50">
                          *Raw flow = {peakFlowGPM.toFixed(2)} GPM (No implicit multipliers applied)
                        </span>
                      </div>
                    )}`;

code = code.replace(oldUIRegex, newUI);

fs.writeFileSync(file, code);
console.log('Updated PlumbingCalc.tsx');
