const fs = require('fs');

// 1. Update MultiZoneVentilationService
let multiFile = fs.readFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', 'utf8');

if (!multiFile.includes('votActual: number;')) {
  multiFile = multiFile.replace(
    /vot: number; \/\/ Required System Outdoor Air Intake/,
    'vot: number; // Required System Outdoor Air Intake\n  votActual: number; // Density Corrected'
  );
  
  multiFile = multiFile.replace(
    /import \{ ZoneVentilationResult \} from '.\/Ashrae621Service';/,
    "import { ZoneVentilationResult, Ashrae621Service } from './Ashrae621Service';"
  );
  
  multiFile = multiFile.replace(
    /static calculateMultiZoneSystem\(zones: MultiZoneInput\[\], populationDiversity: number = 1\.0\): MultiZoneSystemResult \{/,
    'static calculateMultiZoneSystem(zones: MultiZoneInput[], populationDiversity: number = 1.0, densityRatio: number = 1.0): MultiZoneSystemResult {'
  );
  
  multiFile = multiFile.replace(
    /const vot = ev > 0 \? vou \/ ev : 0;/,
    `const vot = ev > 0 ? vou / ev : 0;\n    const votActual = Ashrae621Service.applyDensityCorrection(vot, densityRatio);`
  );
  
  multiFile = multiFile.replace(
    /ev,\n\s+vou,\n\s+vot,/,
    'ev,\n      vou,\n      vot,\n      votActual,'
  );
  
  fs.writeFileSync('src/calculations/ventilation/MultiZoneVentilationService.ts', multiFile);
}

// 2. Update SystemPerformanceCalc to use Ashrae621Service density
let sysPerfFile = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf8');
sysPerfFile = sysPerfFile.replace(
  /import \{ AirDensityService \} from '\.\.\/calculations\/ventilation\/AirDensityService';/,
  "import { Ashrae621Service } from '../calculations/ventilation/Ashrae621Service';"
);
sysPerfFile = sysPerfFile.replace(
  /const elevationM = isMetric \? altitude : altitude \* 0\.3048;\n\s+const tempC = isMetric \? airTemp : \(airTemp - 32\) \* 5 \/ 9;\n\s+const airProps = AirDensityService\.getAirProperties\(elevationM, tempC\);/,
  "const densityRatio = Ashrae621Service.getDensityRatio(altitude, airTemp, isMetric);"
);
sysPerfFile = sysPerfFile.replace(
  /densityRatio: airProps\.densityRatio,/,
  "densityRatio,"
);
sysPerfFile = sysPerfFile.replace(
  /airProps\.densityRatio\.toFixed\(3\)/,
  "densityRatio.toFixed(3)"
);
fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', sysPerfFile);

// 3. Update Ashrae621VentilationCalc to pass densityRatio into calculateMultiZoneSystem
let uiFile = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');
uiFile = uiFile.replace(
  /systemResult = MultiZoneVentilationService\.calculateMultiZoneSystem\(multiInputs\);/,
  "systemResult = MultiZoneVentilationService.calculateMultiZoneSystem(multiInputs, 1.0, densityRatio);"
);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', uiFile);
