const fs = require('fs');
const content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');
const newContent = content.replace('<ResponsiveContainer width="100%" height="100%">', '<ResponsiveContainer width="100%" height={260}>');
fs.writeFileSync('src/components/TrendVisualizer.tsx', newContent, 'utf8');
