const fs = require('fs');
let lines = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8').split('\n');
lines.splice(158, 45); // delete lines 159 to 203
fs.writeFileSync('src/components/TrendVisualizer.tsx', lines.join('\n'));
