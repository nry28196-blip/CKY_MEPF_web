const fs = require('fs');

const files = [
  'src/components/TrendVisualizer.tsx',
  'src/components/BulkCalc.tsx',
  'src/components/CompareModal.tsx',
  'src/components/Ashrae621ExhaustCalc.tsx',
  'src/components/IAQCalc.tsx',
  'src/components/StaticPressureCalc.tsx',
  'src/components/MechanicalCalc.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf-8');
  
  // TrendVisualizer.tsx
  code = code.replace(/q_ipc_tank\.toFixed/g, '(q_ipc_tank || 0).toFixed');
  code = code.replace(/waterStorage\.toFixed/g, '(waterStorage || 0).toFixed');
  code = code.replace(/septicVolume\.toFixed/g, '(septicVolume || 0).toFixed');
  code = code.replace(/hp\)\.toFixed/g, 'hp) || 0).toFixed');
  code = code.replace(/volLight\.toFixed/g, '(volLight || 0).toFixed');
  code = code.replace(/volOrdinary\.toFixed/g, '(volOrdinary || 0).toFixed');
  code = code.replace(/volExtra\.toFixed/g, '(volExtra || 0).toFixed');
  code = code.replace(/\(\(power \* 1000\) \/ \(120 \* pf\)\)\.toFixed/g, '(((power * 1000) / (120 * pf)) || 0).toFixed');
  code = code.replace(/\(\(power \* 1000\) \/ \(230 \* pf\)\)\.toFixed/g, '(((power * 1000) / (230 * pf)) || 0).toFixed');
  code = code.replace(/\(\(power \* 1000\) \/ \(230 \* pf \* Math\.sqrt\(3\)\)\)\.toFixed/g, '(((power * 1000) / (230 * pf * Math.sqrt(3))) || 0).toFixed');
  code = code.replace(/\(\(power \* 1000\) \/ \(400 \* pf \* Math\.sqrt\(3\)\)\)\.toFixed/g, '(((power * 1000) / (400 * pf * Math.sqrt(3))) || 0).toFixed');
  code = code.replace(/\(\(power \* 1000\) \/ \(480 \* pf \* Math\.sqrt\(3\)\)\)\.toFixed/g, '(((power * 1000) / (480 * pf * Math.sqrt(3))) || 0).toFixed');
  code = code.replace(/q_bs\.toFixed/g, '(q_bs || 0).toFixed');
  code = code.replace(/q_ipc_valve\.toFixed/g, '(q_ipc_valve || 0).toFixed');
  code = code.replace(/potableVol\.toFixed/g, '(potableVol || 0).toFixed');
  code = code.replace(/septicVol\.toFixed/g, '(septicVol || 0).toFixed');
  code = code.replace(/currentVol\.toFixed/g, '(currentVol || 0).toFixed');
  code = code.replace(/\(\(p \* 1000\) \/ \(v \* pf \* Math\.sqrt\(3\)\)\)\.toFixed/g, '(((p * 1000) / (v * pf * Math.sqrt(3))) || 0).toFixed');
  code = code.replace(/\(\(p \* 1000\) \/ \(230 \* pf\)\)\.toFixed/g, '(((p * 1000) / (230 * pf)) || 0).toFixed');
  code = code.replace(/de\.toFixed/g, '(de || 0).toFixed');
  code = code.replace(/\(entry\.value \/ 0\.06309\)\.toFixed/g, '((entry.value / 0.06309) || 0).toFixed');

  // BulkCalc.tsx
  code = code.replace(/\(r\.in2 \* CONVERSIONS\.IN100FT_TO_PAM\)\.toFixed/g, '((r.in2 * CONVERSIONS.IN100FT_TO_PAM) || 0).toFixed');
  code = code.replace(/\(r\.in2 \* CONVERSIONS\.PAM_TO_IN100FT\)\.toFixed/g, '((r.in2 * CONVERSIONS.PAM_TO_IN100FT) || 0).toFixed');
  code = code.replace(/deltaFahrenheitToCelsius\(r\.in2\)\.toFixed/g, '(deltaFahrenheitToCelsius(r.in2) || 0).toFixed');
  code = code.replace(/deltaCelsiusToFahrenheit\(r\.in2\)\.toFixed/g, '(deltaCelsiusToFahrenheit(r.in2) || 0).toFixed');
  code = code.replace(/\(r\.in1 \* CONVERSIONS\.GPM_TO_LPS\)\.toFixed/g, '((r.in1 * CONVERSIONS.GPM_TO_LPS) || 0).toFixed');
  code = code.replace(/\(r\.in2 \* CONVERSIONS\.MM_TO_IN\)\.toFixed/g, '((r.in2 * CONVERSIONS.MM_TO_IN) || 0).toFixed');
  code = code.replace(/r\.out1\.toFixed/g, '(r.out1 || 0).toFixed');
  code = code.replace(/r\.out3\.toFixed/g, '(r.out3 || 0).toFixed');
  code = code.replace(/totalCooling\.toFixed/g, '(totalCooling || 0).toFixed');
  code = code.replace(/\(percent \* 100\)\.toFixed/g, '((percent * 100) || 0).toFixed');

  // CompareModal.tsx
  code = code.replace(/value\.toFixed/g, '(value || 0).toFixed');

  // Ashrae621ExhaustCalc.tsx
  code = code.replace(/e\.result\.ashraeRequired\.toFixed/g, '(e.result.ashraeRequired || 0).toFixed');
  code = code.replace(/e\.result\.imcRequired\.toFixed/g, '(e.result.imcRequired || 0).toFixed');
  code = code.replace(/e\.result\.governingRequired\.toFixed/g, '(e.result.governingRequired || 0).toFixed');

  // IAQCalc.tsx
  code = code.replace(/designAirflow\.toFixed/g, '(designAirflow || 0).toFixed');
  code = code.replace(/dcvAirflow\.toFixed/g, '(dcvAirflow || 0).toFixed');
  code = code.replace(/\(\(\(designAirflow - dcvAirflow\) \/ designAirflow\) \* 100\)\.toFixed/g, '((((designAirflow - dcvAirflow) / designAirflow) * 100) || 0).toFixed');

  // StaticPressureCalc.tsx
  code = code.replace(/\(sec\.fittingLossCoeff \+ fit\.lossCoefficient\)\.toFixed/g, '((sec.fittingLossCoeff + fit.lossCoefficient) || 0).toFixed');

  // MechanicalCalc.tsx
  code = code.replace(/\(val \/ 3\)\.toFixed/g, '((val / 3) || 0).toFixed');
  code = code.replace(/\(outdoorTemp - indoorTemp\)\.toFixed/g, '((outdoorTemp - indoorTemp) || 0).toFixed');
  code = code.replace(/\(\(useAltitudeAdj \? AirDensityService\.getAirProperties\(isMetric \? altitude : UnitConversionService\.ftToM\(altitude\), outdoorTemp, relativeHumidity\)\.densityRatio : 1\.0\) \* 1\.21\)\.toFixed/g, '(((useAltitudeAdj ? AirDensityService.getAirProperties(isMetric ? altitude : UnitConversionService.ftToM(altitude), outdoorTemp, relativeHumidity).densityRatio : 1.0) * 1.21) || 0).toFixed');
  code = code.replace(/\(\(useAltitudeAdj \? AirDensityService\.getAirProperties\(isMetric \? altitude : UnitConversionService\.ftToM\(altitude\), outdoorTemp, relativeHumidity\)\.densityRatio : 1\.0\) \* 3010\)\.toFixed/g, '(((useAltitudeAdj ? AirDensityService.getAirProperties(isMetric ? altitude : UnitConversionService.ftToM(altitude), outdoorTemp, relativeHumidity).densityRatio : 1.0) * 3010) || 0).toFixed');
  code = code.replace(/\(ventilationDetails\.systemResult\.zdMax !== undefined && ventilationDetails\.systemResult\.zdMax !== null \? ventilationDetails\.systemResult\.zdMax : 0\)\.toFixed/g, '((ventilationDetails.systemResult.zdMax !== undefined && ventilationDetails.systemResult.zdMax !== null ? ventilationDetails.systemResult.zdMax : 0) || 0).toFixed');
  code = code.replace(/\(ventilationDetails\.systemResult\.ev !== undefined && ventilationDetails\.systemResult\.ev !== null \? ventilationDetails\.systemResult\.ev : 0\)\.toFixed/g, '((ventilationDetails.systemResult.ev !== undefined && ventilationDetails.systemResult.ev !== null ? ventilationDetails.systemResult.ev : 0) || 0).toFixed');
  code = code.replace(/\(hp \* 0\.8\)\.toFixed/g, '((hp * 0.8) || 0).toFixed');

  fs.writeFileSync(file, code);
}
