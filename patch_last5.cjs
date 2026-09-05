const fs = require('fs');

const files = [
  'src/components/KitchenVentilationCalc.tsx',
  'src/components/PlumbingCalc.tsx',
  'src/components/CostCalc.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf-8');
  
  // KitchenVentilationCalc.tsx
  code = code.replace(/hoodLength\.toFixed/g, '(hoodLength || 0).toFixed');
  code = code.replace(/hoodDepth\.toFixed/g, '(hoodDepth || 0).toFixed');

  // PlumbingCalc.tsx
  code = code.replace(/wsfu\.toFixed/g, '(wsfu || 0).toFixed');
  code = code.replace(/extrapolated\.toFixed/g, '(extrapolated || 0).toFixed');
  code = code.replace(/interpolated\.toFixed/g, '(interpolated || 0).toFixed');
  code = code.replace(/\(totalWSFU \/ totalFixtures\)\.toFixed/g, '((totalWSFU / totalFixtures) || 0).toFixed');
  code = code.replace(/\(totalLU \/ totalFixtures\)\.toFixed/g, '((totalLU / totalFixtures) || 0).toFixed');
  code = code.replace(/\(frictionLossM \/ 10\.197\)\.toFixed/g, '((frictionLossM / 10.197) || 0).toFixed');
  code = code.replace(/\(elevationLossM \/ 10\.197\)\.toFixed/g, '((elevationLossM / 10.197) || 0).toFixed');
  code = code.replace(/\(cumFrictionM \/ 10\.197\)\.toFixed/g, '((cumFrictionM / 10.197) || 0).toFixed');
  code = code.replace(/\(cumElevationM \/ 10\.197\)\.toFixed/g, '((cumElevationM / 10.197) || 0).toFixed');
  code = code.replace(/\(Hf \* totalLength \/ 10\.197\)\.toFixed/g, '((Hf * totalLength / 10.197) || 0).toFixed');

  // CostCalc.tsx
  code = code.replace(/totals\.cooling\.toFixed/g, '(totals.cooling || 0).toFixed');
  code = code.replace(/totals\.electrical\.toFixed/g, '(totals.electrical || 0).toFixed');

  fs.writeFileSync(file, code);
}
