const fs = require('fs');
let code = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const oldLineRegex = /\/\/ Hunter's flush valve \(commercial\) loading curves[\s\S]*?const q_ipc_tank = q_tanks_gpm \* 0\.06309; \/\/ to L\/s/;
const newLineLogic = `const q_ipc_valve = getHuntersFlowGPM(lu, 'valve') * 0.06309;
          const q_ipc_tank = getHuntersFlowGPM(lu, 'tank') * 0.06309;`;

code = code.replace(oldLineRegex, newLineLogic);

const oldBarRegex = /let q_valves_gpm = 0;[\s\S]*?const q_ipc_tank = q_tanks_gpm \* 0\.06309;/;
const newBarLogic = `const q_ipc_valve = getHuntersFlowGPM(lu, 'valve') * 0.06309;
        const q_ipc_tank = getHuntersFlowGPM(lu, 'tank') * 0.06309;`;

code = code.replace(oldBarRegex, newBarLogic);

fs.writeFileSync('src/components/TrendVisualizer.tsx', code);
