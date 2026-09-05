const fs = require('fs');
const content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');
const calculateCoolingLoadMatch = content.match(/const calculateCoolingLoad = \(\) => \{[\s\S]*?return \{[\s\S]*?status\n\s*\};\n\s*\};/);
if (calculateCoolingLoadMatch) {
  console.log(calculateCoolingLoadMatch[0]);
} else {
  console.log('calculateCoolingLoad not found');
}
