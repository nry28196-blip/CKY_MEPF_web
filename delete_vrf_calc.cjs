const fs = require('fs');

let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// The best way to strip functions is using index slicing
const start = content.indexOf('const getVrfCalculations = () => {');
const endStr = 'const vrfResults = MechanicalCoolingEngine.calculateVrfSystem({';
const end = content.indexOf(endStr);

if (start !== -1 && end !== -1 && start < end) {
  content = content.substring(0, start) + content.substring(end);
}

fs.writeFileSync('src/components/MechanicalCalc.tsx', content);

