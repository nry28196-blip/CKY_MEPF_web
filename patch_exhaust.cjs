const fs = require('fs');
let code = fs.readFileSync('src/components/CommercialLocalExhaustCalc.tsx', 'utf8');

code = code.replace(
  /{result.category\?\.rate \?\? customRate} {result.category\?\.unitType === 'per_unit' \? flowUnit \+ '\/unit' : flowUnit \+ '\/' \+ areaUnit}/g,
  "{selectedId === 'custom' ? customRate : (isMetric ? category.rateMetric : category.rateImp)} {selectedId === 'custom' ? flowUnit : (isMetric ? category.unitLabelMetric : category.unitLabelImp)}"
);

fs.writeFileSync('src/components/CommercialLocalExhaustCalc.tsx', code);
console.log("Patched CommercialLocalExhaustCalc");
