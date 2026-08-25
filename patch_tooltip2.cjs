const fs = require('fs');

const file = 'src/components/TrendVisualizer.tsx';
let code = fs.readFileSync(file, 'utf8');

const tooltipRegex = /<Tooltip\n                  contentStyle=\{\{\n                    backgroundColor: tooltipBg,\n                    borderColor: tooltipBorder,\n                    borderRadius: '12px',\n                    color: tooltipText,\n                  \}\}\n                \/>/g;

code = code.replace(tooltipRegex, '<Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }} />');

fs.writeFileSync(file, code);
console.log("Patched tooltips 2");
