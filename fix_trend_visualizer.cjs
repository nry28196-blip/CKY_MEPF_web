const fs = require('fs');
const file = 'src/components/TrendVisualizer.tsx';
let code = fs.readFileSync(file, 'utf8');

const newHunterFunc = `
  const getHuntersFlowGPM = (wsfu: number, type: 'valve' | 'tank') => {
    if (wsfu <= 0) return 0;
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
      return baseGPM + ((wsfu - 500) * 0.15);
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
  };
`;

const trendLoopReplacement = `
          // BS EN 806 loading units: Q_bs = 0.09 * sqrt(LU)
          const q_bs = 0.09 * Math.sqrt(lu);

          // Use shared exact IPC function
          const q_valves_gpm = getHuntersFlowGPM(lu, 'valve');
          const q_ipc_valve = q_valves_gpm * 0.06309; // to L/s
          
          const q_tanks_gpm = getHuntersFlowGPM(lu, 'tank');
          const q_ipc_tank = q_tanks_gpm * 0.06309; // to L/s
`;

// Insert newHunterFunc before trend switch
code = code.replace("const generateData = () => {", newHunterFunc + "\n  const generateData = () => {");

// Replace old hardcoded formulas
const oldTrendFormulas = /\/\/ BS EN 806 loading units: Q_bs = 0\.09 \* Math\.sqrt\(lu\);[\s\S]*?const q_ipc_tank = q_tanks_gpm \* 0\.06309; \/\/ to L\/s/;

code = code.replace(oldTrendFormulas, trendLoopReplacement.trim());

fs.writeFileSync(file, code);
console.log("TrendVisualizer updated");
