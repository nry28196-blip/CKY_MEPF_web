const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

content = content.replace('w-[314px]', 'w-[305px]');
content = content.replace('mt-[11px]', 'mt-[14px]');

fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
