const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/ashrae62_1_2025.json', 'utf8'));
console.log("Spaces:", data.coefficients.ventilationSpaceTypes.length);
console.log("EZ:", data.coefficients.airDistribution.length);
