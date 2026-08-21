const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const oldLines = `            <Line type="monotone" dataKey="Standard Residential (kW)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="Commercial Office (kW)" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="Tropical Glass Facade (kW)" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />`;

const newLines = `            <Line type="monotone" dataKey="High Efficiency (kW)" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="Current Design (kW)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="Poor Envelope (kW)" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />`;

content = content.replace(oldLines, newLines);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
