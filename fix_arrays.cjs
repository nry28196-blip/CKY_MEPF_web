const fs = require('fs');

const updateArrays = (file) => {
  let code = fs.readFileSync(file, 'utf8');

  // Replace ipcValveData array
  const oldValveRegex = /const ipcValveData = \[[\s\S]*?\];/;
  const newValveData = `const ipcValveData = [
      [0, 0], [5, 15], [10, 27], [15, 31], [20, 35], [25, 38], [30, 42], [35, 44],
      [40, 46], [45, 48], [50, 50], [60, 54], [70, 58], [80, 61.2], [90, 64.3],
      [100, 67.5], [120, 73], [140, 77], [160, 81], [180, 85.5], [200, 90],
      [225, 95.5], [250, 101], [275, 104.5], [300, 108], [400, 127], [500, 143]
    ];`;
  code = code.replace(oldValveRegex, newValveData);

  // Replace ipcTankData array
  const oldTankRegex = /const ipcTankData = \[[\s\S]*?\];/;
  const newTankData = `const ipcTankData = [
      [0, 0], [1, 3], [2, 5], [3, 6.5], [4, 8], [5, 9.4], [10, 14.6],
      [15, 17.5], [20, 19.6], [25, 21.5], [30, 23.3], [35, 24.9], [40, 26.3],
      [45, 27.7], [50, 29.1], [60, 32], [70, 35], [80, 38], [90, 41],
      [100, 43.5], [120, 48], [140, 52.5], [160, 57], [180, 61], [200, 65],
      [225, 70], [250, 75], [275, 80], [300, 85], [400, 105], [500, 124]
    ];`;
  code = code.replace(oldTankRegex, newTankData);

  // Update baseGPM fallback for > 500 WSFU
  // In TrendVisualizer.tsx and PlumbingCalc.tsx
  code = code.replace("const baseGPM = type === 'valve' ? 143 : 112;", "const baseGPM = type === 'valve' ? 143 : 124;");

  fs.writeFileSync(file, code);
  console.log("Updated", file);
};

updateArrays('src/components/PlumbingCalc.tsx');
updateArrays('src/components/TrendVisualizer.tsx');
