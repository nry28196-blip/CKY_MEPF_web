const fs = require('fs');
let code = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const regex = /case 'plumbing_fixtures': \{[\s\S]*?break;\n      \}/;
const replacement = `case 'plumbing_fixtures': {
        const activeLU = Number(currentParams.totalLU) || 20;
        const maxLu = Math.max(150, activeLU * 1.8);
        
        const ipcXValues = [0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 225, 250, 275, 300, 400, 500];
        const xValuesSet = new Set(ipcXValues.filter(x => x <= maxLu));
        xValuesSet.add(activeLU);
        
        const sortedX = Array.from(xValuesSet).sort((a, b) => a - b);
        
        for (const lu of sortedX) {
          const q_bs = 0.09 * Math.sqrt(lu);
          const q_ipc_valve = getHuntersFlowGPM(lu, 'valve') * 0.06309;
          const q_ipc_tank = getHuntersFlowGPM(lu, 'tank') * 0.06309;

          list.push({
            loadingUnits: lu,
            'BS EN 806-3 Standard (L/s)': parseFloat(q_bs.toFixed(3)),
            'IPC Hunter - Flush Valve (L/s)': parseFloat(q_ipc_valve.toFixed(3)),
            'IPC Hunter - Flush Tank (L/s)': parseFloat(q_ipc_tank.toFixed(3)),
          });
        }
        break;
      }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/TrendVisualizer.tsx', code);
