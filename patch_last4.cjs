const fs = require('fs');

const files = [
  'src/components/VrfTopologyCanvas.tsx',
  'src/components/UpsSizingCalc.tsx',
  'src/components/Ashrae621VentilationCalc.tsx',
  'src/components/MaterialOptimizerModal.tsx',
  'src/components/TrendVisualizer.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf-8');
  
  // VrfTopologyCanvas.tsx
  code = code.replace(/len\.toFixed/g, '(len || 0).toFixed');
  code = code.replace(/pressureDropStats\.totalDrop\.toFixed/g, '(pressureDropStats.totalDrop || 0).toFixed');
  code = code.replace(/diversityFactor\.toFixed/g, '(diversityFactor || 0).toFixed');
  code = code.replace(/\(vrfResults\.baseOduCharge\)\.toFixed/g, '(vrfResults.baseOduCharge || 0).toFixed');
  code = code.replace(/\(mainPipingLength \* \(refrigerantType === 'R32' \? 0\.050 : 0\.055\)\)\.toFixed/g, '((mainPipingLength * (refrigerantType === \'R32\' ? 0.050 : 0.055)) || 0).toFixed');
  code = code.replace(/\(vrfRooms\.reduce\(\(sum, r\) => sum \+ \(r\.pipeLength \?\? 15\), 0\) \* \(refrigerantType === 'R32' \? 0\.050 : 0\.055\)\)\.toFixed/g, '((vrfRooms.reduce((sum, r) => sum + (r.pipeLength ?? 15), 0) * (refrigerantType === \'R32\' ? 0.050 : 0.055)) || 0).toFixed');

  // UpsSizingCalc.tsx
  code = code.replace(/results\.kva\.toFixed/g, '(results.kva || 0).toFixed');
  code = code.replace(/results\.recommendedKva\.toFixed/g, '(results.recommendedKva || 0).toFixed');
  code = code.replace(/results\.requiredAh\.toFixed/g, '(results.requiredAh || 0).toFixed');
  code = code.replace(/\(results\.recommendedKva - results\.kva\)\.toFixed/g, '((results.recommendedKva - results.kva) || 0).toFixed');
  code = code.replace(/\(results\.standardUps - results\.recommendedKva\)\.toFixed/g, '((results.standardUps - results.recommendedKva) || 0).toFixed');

  // Ashrae621VentilationCalc.tsx
  code = code.replace(/zoneResults\[0\]\.result\.ez\.toFixed/g, '(zoneResults[0].result.ez || 0).toFixed');
  code = code.replace(/densityRatio\.toFixed/g, '(densityRatio || 0).toFixed');
  code = code.replace(/ez\.ez\.toFixed/g, '(ez.ez || 0).toFixed');
  code = code.replace(/zr\.result\.pz\.toFixed/g, '(zr.result.pz || 0).toFixed');
  code = code.replace(/zr\.result\.vbp\.toFixed/g, '(zr.result.vbp || 0).toFixed');
  code = code.replace(/zr\.result\.vba\.toFixed/g, '(zr.result.vba || 0).toFixed');
  code = code.replace(/zr\.result\.vbz\.toFixed/g, '(zr.result.vbz || 0).toFixed');
  code = code.replace(/zr\.result\.voz\.toFixed/g, '(zr.result.voz || 0).toFixed');
  code = code.replace(/\(zr\.result\.voz \* densityRatio\)\.toFixed/g, '((zr.result.voz * densityRatio) || 0).toFixed');
  code = code.replace(/systemResult\.vou\.toFixed/g, '(systemResult.vou || 0).toFixed');
  code = code.replace(/systemResult\.vps\.toFixed/g, '(systemResult.vps || 0).toFixed');
  code = code.replace(/systemResult\.vot\.toFixed/g, '(systemResult.vot || 0).toFixed');
  code = code.replace(/\(systemResult\.votActual \|\| systemResult\.vot\)\.toFixed/g, '((systemResult.votActual || systemResult.vot) || 0).toFixed');
  code = code.replace(/z\.zpz\.toFixed/g, '(z.zpz || 0).toFixed');
  code = code.replace(/z\.voz\.toFixed/g, '(z.voz || 0).toFixed');

  // MaterialOptimizerModal.tsx
  code = code.replace(/\(frictionLossM \/ 10\.197\)\.toFixed/g, '((frictionLossM / 10.197) || 0).toFixed');
  code = code.replace(/\(appliedElevationChange \/ 10\.197\)\.toFixed/g, '((appliedElevationChange / 10.197) || 0).toFixed');
  code = code.replace(/residualBar\.toFixed/g, '(residualBar || 0).toFixed');
  code = code.replace(/\(Hf \* totalLength \/ 10\.197\)\.toFixed/g, '((Hf * totalLength / 10.197) || 0).toFixed');
  code = code.replace(/\(appliedAvailablePressure - totalHeadLossBar\)\.toFixed/g, '((appliedAvailablePressure - totalHeadLossBar) || 0).toFixed');
  code = code.replace(/Math\.abs\(Number\(mat\.result\.elevationLossBar\)\)\.toFixed/g, '(Math.abs(Number(mat.result.elevationLossBar)) || 0).toFixed');

  // TrendVisualizer.tsx (additional ones)
  code = code.replace(/current3P\.toFixed/g, '(current3P || 0).toFixed');
  code = code.replace(/current1P\.toFixed/g, '(current1P || 0).toFixed');
  code = code.replace(/\(a \* b\.value \/ 1000\)\.toFixed/g, '((a * b.value / 1000) || 0).toFixed');
  code = code.replace(/\(area \* b\.value \/ 1000\)\.toFixed/g, '((area * b.value / 1000) || 0).toFixed');
  code = code.replace(/actualKw\.toFixed/g, '(actualKw || 0).toFixed');
  code = code.replace(/finalKw\.toFixed/g, '(finalKw || 0).toFixed');
  code = code.replace(/velFpm\.toFixed/g, '(velFpm || 0).toFixed');

  fs.writeFileSync(file, code);
}
