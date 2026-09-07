const fs = require('fs');
let content = fs.readFileSync('src/components/IAQCalc.tsx', 'utf8');
content = content.replace(/\{designAirflow !== '' && !isNaN\(Number\(designAirflow\)\) \? Number\(designAirflow\)\.toFixed\(1\) : '--'\}/g, 
  "{!isNaN(designAirflow) ? designAirflow.toFixed(1) : '--'}");
content = content.replace(/\{designAirflow && dcvAirflow !== null && Number\(designAirflow\) > 0 \? \(\(\(Number\(designAirflow\) - dcvAirflow\) \/ Number\(designAirflow\)\) \* 100\)\.toFixed\(1\) : '--'\}/g, 
  "{designAirflow > 0 && !isNaN(dcvAirflow) ? (((designAirflow - dcvAirflow) / designAirflow) * 100).toFixed(1) : '--'}");
fs.writeFileSync('src/components/IAQCalc.tsx', content);
