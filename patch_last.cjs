const fs = require('fs');

const files = [
  'src/components/StaticPressureCalc.tsx',
  'src/components/EngineeringUnitConverter.tsx',
  'src/components/PowerEquipmentTable.tsx',
  'src/components/VrfLoadDistributionChart.tsx',
  'src/components/SystemPerformanceCalc.tsx',
  'src/components/FireCalc.tsx',
  'src/components/MechanicalCalc.tsx',
  'src/calculations/services/AirDensityService.ts',
  'src/calculations/ventilation/Ashrae621AlternativeSystemService.ts',
  'src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts',
  'src/calculations/validation/VentilationValidator.ts'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf-8');
  
  // A simple regex approach to find variable.toFixed and replace it with (variable || 0).toFixed
  // This is risky if variable is an expression. We can manually target the remaining ones.
  
  // StaticPressureCalc.tsx
  code = code.replace(/secRes\.friction\.velocityPressure\.toFixed/g, '(secRes.friction.velocityPressure || 0).toFixed');
  code = code.replace(/secRes\.friction\.pressureDrop\.toFixed/g, '(secRes.friction.pressureDrop || 0).toFixed');
  code = code.replace(/secRes\.fittingLoss\.toFixed/g, '(secRes.fittingLoss || 0).toFixed');
  code = code.replace(/secRes\.total\.toFixed/g, '(secRes.total || 0).toFixed');
  code = code.replace(/pathRes\.totalPressure\.toFixed/g, '(pathRes.totalPressure || 0).toFixed');
  code = code.replace(/designPressure\.toFixed/g, '(designPressure || 0).toFixed');
  code = code.replace(/result\.maxPressure\.toFixed/g, '(result.maxPressure || 0).toFixed');
  // EngineeringUnitConverter.tsx
  code = code.replace(/computed\.toFixed/g, '(computed || 0).toFixed');
  // PowerEquipmentTable.tsx
  code = code.replace(/totalPower\.toFixed/g, '(totalPower || 0).toFixed');
  // VrfLoadDistributionChart.tsx
  code = code.replace(/d\.data\.value\.toFixed/g, '(d.data.value || 0).toFixed');
  code = code.replace(/totalTons\.toFixed/g, '(totalTons || 0).toFixed');
  // SystemPerformanceCalc.tsx
  code = code.replace(/densityRatio\.toFixed/g, '(densityRatio || 0).toFixed');
  code = code.replace(/result\.totalStaticPressure\.toFixed/g, '(result.totalStaticPressure || 0).toFixed');
  code = code.replace(/result\.fanBrakeHorsepower\.toFixed/g, '(result.fanBrakeHorsepower || 0).toFixed');
  code = code.replace(/result\.motorElectricalPower\.toFixed/g, '(result.motorElectricalPower || 0).toFixed');
  // FireCalc.tsx
  code = code.replace(/singleSprinklerFlowLpm\.toFixed/g, '(singleSprinklerFlowLpm || 0).toFixed');
  code = code.replace(/designAreaSprinklerFlowLpm\.toFixed/g, '(designAreaSprinklerFlowLpm || 0).toFixed');
  code = code.replace(/storageTankVolumeGallons\.toFixed/g, '(storageTankVolumeGallons || 0).toFixed');
  code = code.replace(/\(appliedStandard === 'bs' \? staticHeadBar : staticHeadPsi\)\.toFixed/g, '((appliedStandard === \'bs\' ? staticHeadBar : staticHeadPsi) || 0).toFixed');
  code = code.replace(/\(appliedStandard === 'bs' \? frictionLossBar : frictionLossPsi\)\.toFixed/g, '((appliedStandard === \'bs\' ? frictionLossBar : frictionLossPsi) || 0).toFixed');
  code = code.replace(/totalPumpHeadMeters\.toFixed/g, '(totalPumpHeadMeters || 0).toFixed');
  code = code.replace(/singleSprinklerFlowGPM\.toFixed/g, '(singleSprinklerFlowGPM || 0).toFixed');
  code = code.replace(/designAreaSprinklerFlowGPM\.toFixed/g, '(designAreaSprinklerFlowGPM || 0).toFixed');
  code = code.replace(/\(\(hoseStreamAllowance \/ 3\.7854\)\)\.toFixed/g, '((hoseStreamAllowance / 3.7854) || 0).toFixed');
  code = code.replace(/\(hoseStreamAllowance \/ 3\.7854\)\.toFixed/g, '((hoseStreamAllowance / 3.7854) || 0).toFixed');
  code = code.replace(/\(hoseStreamAllowance \* 3\.7854\)\.toFixed/g, '((hoseStreamAllowance * 3.7854) || 0).toFixed');
  
  // AirDensityService.ts
  code = code.replace(/densityRatio\.toFixed/g, '(densityRatio || 0).toFixed');
  // Ashrae621AlternativeSystemService.ts
  code = code.replace(/zpz\.toFixed/g, '(zpz || 0).toFixed');
  code = code.replace(/ev\.toFixed/g, '(ev || 0).toFixed');
  // Ashrae621SimplifiedSystemService.ts
  code = code.replace(/z\.vpzMin\.toFixed/g, '(z.vpzMin || 0).toFixed');
  code = code.replace(/requiredVpzMin\.toFixed/g, '(requiredVpzMin || 0).toFixed');
  // VentilationValidator.ts
  code = code.replace(/zone\.zp\.toFixed/g, '(zone.zp || 0).toFixed');
  code = code.replace(/system\.ev\.toFixed/g, '(system.ev || 0).toFixed');

  fs.writeFileSync(file, code);
}
