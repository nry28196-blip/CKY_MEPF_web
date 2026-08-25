const fs = require('fs');
let code = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const regexValve = /<Line type="monotone" dataKey="IPC Hunter - Flush Valve \(L\/s\)"/g;
code = code.replace(regexValve, '<Line type="linear" dataKey="IPC Hunter - Flush Valve (L/s)"');

const regexTank = /<Line type="monotone" dataKey="IPC Hunter - Flush Tank \(L\/s\)"/g;
code = code.replace(regexTank, '<Line type="linear" dataKey="IPC Hunter - Flush Tank (L/s)"');

const regexDot = /<ReferenceDot \n                    x=\{currentXValue\} \n                    y=\{currentYValue\} \n                    r=\{6\} /g;
const newDot = `<ReferenceDot 
                    x={currentXValue} 
                    y={currentYValue} 
                    r={6} 
                    label={{ value: 'Calc Value', fill: '#ffffff', position: 'top', fontSize: 11 }}`;
code = code.replace(regexDot, newDot);

fs.writeFileSync('src/components/TrendVisualizer.tsx', code);
