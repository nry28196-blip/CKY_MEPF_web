const fs = require('fs');
const content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// match things like `value={outdoorTemp}`
const match = content.match(/<input[^>]*value=\{outdoorTemp\}[^>]*>/);
if (match) {
  console.log('Outdoor Temp input:', match[0]);
}

const matchArea = content.match(/<input[^>]*value=\{area\}[^>]*>/);
if (matchArea) {
  console.log('Area input:', matchArea[0]);
}

