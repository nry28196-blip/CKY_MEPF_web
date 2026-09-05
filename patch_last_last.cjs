const fs = require('fs');
const files = [
  'src/components/DuctSizingCalc.tsx',
  'src/components/ElvUpsSizingCalc.tsx',
  'src/components/PressureGauge.tsx',
  'src/components/VoltageDropCalc.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf-8');
  
  // ElvUpsSizingCalc.tsx
  code = code.replace(/results\.requiredAh\.toFixed/g, '(results.requiredAh || 0).toFixed');
  code = code.replace(/results\.kva\.toFixed/g, '(results.kva || 0).toFixed');
  code = code.replace(/\(results\.recommendedKva - results\.kva\)\.toFixed/g, '((results.recommendedKva - results.kva) || 0).toFixed');
  code = code.replace(/\(results\.standardUps - results\.recommendedKva\)\.toFixed/g, '((results.standardUps - results.recommendedKva) || 0).toFixed');
  code = code.replace(/results\.recommendedKva\.toFixed/g, '(results.recommendedKva || 0).toFixed');
  
  // PressureGauge.tsx
  code = code.replace(/interpolate\(t\)\.toFixed/g, '(interpolate(t) || 0).toFixed');

  // VoltageDropCalc.tsx
  code = code.replace(/results\.vd\.toFixed/g, '(results.vd || 0).toFixed');
  code = code.replace(/results\.percentage\.toFixed/g, '(results.percentage || 0).toFixed');
  code = code.replace(/\(\(cableResistance \* powerFactor\) \+ \(cableReactance \* Math\.sin\(Math\.acos\(powerFactor\)\)\)\)\.toFixed/g, '(((cableResistance * powerFactor) + (cableReactance * Math.sin(Math.acos(powerFactor)))) || 0).toFixed');

  // DuctSizingCalc.tsx
  code = code.replace(/velUnitHook\.getDisplayValue\(velRectMain\)\.toFixed/g, '(velUnitHook.getDisplayValue(velRectMain) || 0).toFixed');
  code = code.replace(/velUnitHook\.getDisplayValue\(b\.velocityRect\)\.toFixed/g, '(velUnitHook.getDisplayValue(b.velocityRect) || 0).toFixed');
  code = code.replace(/velUnitHook\.getDisplayValue\(1000\)\.toFixed/g, '(velUnitHook.getDisplayValue(1000) || 0).toFixed');
  code = code.replace(/velUnitHook\.getDisplayValue\(2000\)\.toFixed/g, '(velUnitHook.getDisplayValue(2000) || 0).toFixed');
  code = code.replace(/velUnitHook\.getDisplayValue\(600\)\.toFixed/g, '(velUnitHook.getDisplayValue(600) || 0).toFixed');
  code = code.replace(/velUnitHook\.getDisplayValue\(1200\)\.toFixed/g, '(velUnitHook.getDisplayValue(1200) || 0).toFixed');
  code = code.replace(/velUnitHook\.getDisplayValue\(800\)\.toFixed/g, '(velUnitHook.getDisplayValue(800) || 0).toFixed');
  code = code.replace(/velUnitHook\.getDisplayValue\(1500\)\.toFixed/g, '(velUnitHook.getDisplayValue(1500) || 0).toFixed');
  code = code.replace(/velUnitHook\.getDisplayValue\(400\)\.toFixed/g, '(velUnitHook.getDisplayValue(400) || 0).toFixed');
  code = code.replace(/lenUnitHook\.getDisplayValue\(deMain\)\.toFixed/g, '(lenUnitHook.getDisplayValue(deMain) || 0).toFixed');
  code = code.replace(/lenUnitHook\.getDisplayValue\(b\.de\)\.toFixed/g, '(lenUnitHook.getDisplayValue(b.de) || 0).toFixed');
  code = code.replace(/lenUnitHook\.getDisplayValue\(b\.width\)\.toFixed/g, '(lenUnitHook.getDisplayValue(b.width) || 0).toFixed');
  code = code.replace(/lenUnitHook\.getDisplayValue\(b\.height\)\.toFixed/g, '(lenUnitHook.getDisplayValue(b.height) || 0).toFixed');
  code = code.replace(/lenUnitHook\.getDisplayValue\(widthMain\)\.toFixed/g, '(lenUnitHook.getDisplayValue(widthMain) || 0).toFixed');
  code = code.replace(/lenUnitHook\.getDisplayValue\(ductHeight\)\.toFixed/g, '(lenUnitHook.getDisplayValue(ductHeight) || 0).toFixed');
  code = code.replace(/airflowUnitHook\.getDisplayValue\(b\.cfm\)\.toFixed/g, '(airflowUnitHook.getDisplayValue(b.cfm) || 0).toFixed');
  code = code.replace(/\(widthMain \/ ductHeight\)\.toFixed/g, '((widthMain / ductHeight) || 0).toFixed');
  code = code.replace(/pct\.toFixed/g, '(pct || 0).toFixed');
  code = code.replace(/deMain\.toFixed/g, '(deMain || 0).toFixed');
  code = code.replace(/value\.toFixed/g, '(value || 0).toFixed');
  code = code.replace(/\(sec\.fittingLossCoeff \+ fit\.lossCoefficient\)\.toFixed/g, '((sec.fittingLossCoeff + fit.lossCoefficient) || 0).toFixed');
  code = code.replace(/\(outdoorTemp - indoorTemp\)\.toFixed/g, '((outdoorTemp - indoorTemp) || 0).toFixed');

  fs.writeFileSync(file, code);
}
