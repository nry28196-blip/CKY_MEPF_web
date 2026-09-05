const fs = require('fs');
const files = [
  'src/components/FireCalc.tsx',
  'src/components/ElectricalCalc.tsx',
  'src/components/MechanicalCalc.tsx',
  'src/lib/exportCsv.ts',
  'src/calculations/services/AirDensityService.ts',
  'src/calculations/ventilation/Ashrae621AlternativeSystemService.ts',
  'src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts',
  'src/calculations/validation/VentilationValidator.ts',
  'src/lib/unitConverter.ts'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf-8');
  
  // A generic replace that looks for variable.toFixed and makes it (variable || 0).toFixed
  // But doing it via regex is tricky because of the variable names.
  // Let's do it specifically for the ones found in the grep output.
  
  // FireCalc
  code = code.replace(/totalWaterDemandLpm\.toFixed/g, '(totalWaterDemandLpm || 0).toFixed');
  code = code.replace(/totalWaterDemandGPM\.toFixed/g, '(totalWaterDemandGPM || 0).toFixed');
  code = code.replace(/storageTankVolumeM3\.toFixed/g, '(storageTankVolumeM3 || 0).toFixed');
  code = code.replace(/storageTankVolumeLiters\.toFixed/g, '(storageTankVolumeLiters || 0).toFixed');
  code = code.replace(/totalPumpHeadPsi\.toFixed/g, '(totalPumpHeadPsi || 0).toFixed');
  code = code.replace(/pumpHP\.toFixed/g, '(pumpHP || 0).toFixed');
  code = code.replace(/pumpKW\.toFixed/g, '(pumpKW || 0).toFixed');
  code = code.replace(/jockeyFlowGPM\.toFixed/g, '(jockeyFlowGPM || 0).toFixed');
  code = code.replace(/jockeyHeadPsi\.toFixed/g, '(jockeyHeadPsi || 0).toFixed');

  // ElectricalCalc
  code = code.replace(/current\.toFixed/g, '(current || 0).toFixed');
  code = code.replace(/density\.toFixed/g, '(density || 0).toFixed');
  
  // MechanicalCalc
  code = code.replace(/results\.tons\.toFixed/g, '(results.tons || 0).toFixed');
  code = code.replace(/\(results\.tons\)\.toFixed/g, '(results.tons || 0).toFixed');
  code = code.replace(/diversityFactor\.toFixed/g, '(diversityFactor || 0).toFixed');

  // exportCsv
  code = code.replace(/params\.deMain\.toFixed/g, '(params.deMain || 0).toFixed');
  code = code.replace(/params\.current\.toFixed/g, '(params.current || 0).toFixed');
  code = code.replace(/params\.totalUnits\.toFixed/g, '(params.totalUnits || 0).toFixed');
  code = code.replace(/params\.flowRate\.toFixed/g, '(params.flowRate || 0).toFixed');
  code = code.replace(/params\.pipeDiameter\.toFixed/g, '(params.pipeDiameter || 0).toFixed');
  code = code.replace(/params\.flow\.toFixed/g, '(params.flow || 0).toFixed');
  code = code.replace(/\(params\.flow \/ 60\)\.toFixed/g, '((params.flow || 0) / 60).toFixed');
  code = code.replace(/params\.storage\.toFixed/g, '(params.storage || 0).toFixed');
  
  // unitConverter
  code = code.replace(/\(val \* multiplier\)\.toFixed/g, '((val * multiplier) || 0).toFixed');
  
  fs.writeFileSync(file, code);
}
