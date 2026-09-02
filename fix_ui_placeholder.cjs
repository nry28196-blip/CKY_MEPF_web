const fs = require('fs');

let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

content = content.replace('placeholder="= Vpz"', 'placeholder="Auto (VAV)"');
// Do it for both instances if there are multiple
content = content.replace(/placeholder="= Vpz"/g, 'placeholder="Auto (VAV)"');

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
console.log("Updated UI placeholder");
