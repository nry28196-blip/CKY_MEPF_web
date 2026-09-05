const fs = require('fs');
const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/value: \(\(\(septicSludgeVol \/ 1000\) \|\| 0\)\.toFixed/g, 'value: ((septicSludgeVol / 1000) || 0).toFixed');
code = code.replace(/value: \(\(\(septicLiquidVol \/ 1000\) \|\| 0\)\.toFixed/g, 'value: ((septicLiquidVol / 1000) || 0).toFixed');
code = code.replace(/\(\(\(boosterHeadMeters \/ 10\.197\) \|\| 0\)\.toFixed/g, '((boosterHeadMeters / 10.197) || 0).toFixed');

fs.writeFileSync(file, code);
