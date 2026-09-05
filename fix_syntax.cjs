const fs = require('fs');
const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

// I replaced `appliedElevationChange / 10.197).toFixed` with `((appliedElevationChange / 10.197) || 0).toFixed`.
// Originally it was `elevationLossBar: (appliedElevationChange / 10.197).toFixed(2),`
// That means it became `elevationLossBar: (((appliedElevationChange / 10.197) || 0).toFixed(2),` which has too many opening parenthesis.

code = code.replace(/elevationLossBar: \(\(\(appliedElevationChange \/ 10\.197\) \|\| 0\)\.toFixed/g, 'elevationLossBar: ((appliedElevationChange / 10.197) || 0).toFixed');

// Also residualBar: residualBar.toFixed(2), wait I didn't replace residualBar! 
code = code.replace(/residualBar: residualBar\.toFixed/g, 'residualBar: (residualBar || 0).toFixed');

// And what about residualBar: ((appliedAvailablePressure - totalHeadLossBar) || 0).toFixed ?
// Originally: `residualBar: (appliedAvailablePressure - totalHeadLossBar).toFixed(2)`
// So `(((appliedAvailablePressure - totalHeadLossBar) || 0).toFixed(2)`
code = code.replace(/residualBar: \(\(\(appliedAvailablePressure - totalHeadLossBar\) \|\| 0\)\.toFixed/g, 'residualBar: ((appliedAvailablePressure - totalHeadLossBar) || 0).toFixed');

fs.writeFileSync(file, code);
