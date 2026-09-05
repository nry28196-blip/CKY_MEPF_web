const fs = require('fs');
const file = 'src/components/TrendVisualizer.tsx';
let code = fs.readFileSync(file, 'utf-8');

// I did: code = code.replace(/hp\)\.toFixed/g, 'hp) || 0).toFixed');
// And it was `parseFloat(Math.max(0.1, hp).toFixed(2)),`
// So it became `parseFloat(Math.max(0.1, hp) || 0).toFixed(2)),` which is bad syntax.
// Wait, `parseFloat(  (Math.max(0.1, hp) || 0).toFixed(2)  )`

code = code.replace(/parseFloat\(Math\.max\(0\.1, hp\) \|\| 0\)\.toFixed\(2\)\),/g, 'parseFloat((Math.max(0.1, hp) || 0).toFixed(2)),');

// There's another one at line 493
code = code.replace(/parseFloat\(Math\.max\(0\.1, hp\) \|\| 0\)\.toFixed\(2\)\),/g, 'parseFloat((Math.max(0.1, hp) || 0).toFixed(2)),'); // replace handles all if /g used but wait I used replace twice. I will just use regex.

fs.writeFileSync(file, code);
