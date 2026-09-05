const fs = require('fs');
const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

// I replaced `septicSludgeVol / 1000).toFixed` with `((septicSludgeVol / 1000) || 0).toFixed`.
// Originally: `value: (septicSludgeVol / 1000).toFixed(2),`
// Now: `value: (((septicSludgeVol / 1000) || 0).toFixed(2),`
code = code.replace(/value: \(\(\(\(septicSludgeVol \/ 1000\) \|\| 0\)\.toFixed/g, 'value: ((septicSludgeVol / 1000) || 0).toFixed');
code = code.replace(/value: \(\(\(\(septicLiquidVol \/ 1000\) \|\| 0\)\.toFixed/g, 'value: ((septicLiquidVol / 1000) || 0).toFixed');

// I also did:
// boosterHeadMeters / 10.197).toFixed -> ((boosterHeadMeters / 10.197) || 0).toFixed
// Let's search for "(((" and fix them just in case:
code = code.replace(/\(\(\(\(boosterHeadMeters \/ 10\.197\) \|\| 0\)\.toFixed/g, '((boosterHeadMeters / 10.197) || 0).toFixed');
code = code.replace(/\(\(\(\(boosterShaftPower \|\| 0\)\)\.toFixed/g, '(boosterShaftPower || 0).toFixed');

fs.writeFileSync(file, code);
