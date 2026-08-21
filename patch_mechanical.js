const fs = require('fs');

const content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

console.log("File size:", content.length);
