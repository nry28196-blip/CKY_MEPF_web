const fs = require('fs');
let code = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf8');

code = code.replace(
  /text-red-500'\n\s*\}>\n\s*\{b\.status === 'danger'/g,
  `text-red-500'\n                              }\>\n                              {b.status === 'danger'`
);

// Wait, the actual text in the file:
// 1117-                            <span className={\`block text-xs font-bold font-mono mt-0.5 \${b.status === 'optimal' ? 'text-emerald-400' : b.status === 'warning' ? 'text-amber-400' : 'text-red-500' }>`
// Wait, my sed changed it to text-red-500' }>
fs.writeFileSync('src/components/DuctSizingCalc.tsx', code);
