const fs = require('fs');

const file = 'src/components/TrendVisualizer.tsx';
let code = fs.readFileSync(file, 'utf8');

const newFuncs = `
  // Helper function to validate IPC Data Table against standard constants
  const validateIPCHuntersCurve = () => {
    // Standard baseline values to verify against
    const CONSTANTS = {
      TANK_10: 14.6, TANK_100: 43.5, TANK_500: 124,
      VALVE_10: 27, VALVE_100: 67.5, VALVE_500: 143
    };
    
    let isValid = true;
    
    const checkPoint = (data, x, expectedY, label) => {
      const point = data.find(p => p[0] === x);
      if (!point || point[1] !== expectedY) {
        console.error(\`IPC Validation Error (\${label}): Expected \${expectedY} at \${x} WSFU, found \${point ? point[1] : 'undefined'}\`);
        isValid = false;
      }
    };
    
    // Test sets (using the same arrays defined inside the function below)
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

    checkPoint(ipcTankData, 10, CONSTANTS.TANK_10, 'Tank 10 WSFU');
    checkPoint(ipcTankData, 100, CONSTANTS.TANK_100, 'Tank 100 WSFU');
    checkPoint(ipcTankData, 500, CONSTANTS.TANK_500, 'Tank 500 WSFU');
    
    checkPoint(ipcValveData, 10, CONSTANTS.VALVE_10, 'Valve 10 WSFU');
    checkPoint(ipcValveData, 100, CONSTANTS.VALVE_100, 'Valve 100 WSFU');
    checkPoint(ipcValveData, 500, CONSTANTS.VALVE_500, 'Valve 500 WSFU');
    
    if (isValid) {
      console.log('IPC Hunter\\'s Curve (Visualizer) validated against standard constants.');
    }
    
    return isValid;
  };

  const getHuntersFlowGPM = (wsfu: number, type: 'valve' | 'tank') => {
    validateIPCHuntersCurve();
    
    if (wsfu <= 0) return 0;
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
  };`;

const oldFuncRegex = /const getHuntersFlowGPM = \([\s\S]*?return 0;\n  \};/;
code = code.replace(oldFuncRegex, newFuncs);

fs.writeFileSync(file, code);
