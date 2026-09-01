const fs = require('fs');
let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// Replace import
file = file.replace(/import \{ AirDensityService \} from '\.\.\/calculations\/ventilation\/AirDensityService';\n/, '');

// Replace density calculation
file = file.replace(
  /const elevationM = isMetric \? altitude : altitude \* 0\.3048;\n\s+const tempC = isMetric \? airTemp : \(airTemp - 32\) \* 5 \/ 9;\n\s+const airProps = AirDensityService\.getAirProperties\(elevationM, tempC\);/,
  `const densityRatio = Ashrae621Service.getDensityRatio(altitude, airTemp, isMetric);`
);

// Pass density ratio to Zone input
file = file.replace(
  /isMetric\n\s+\};/,
  `isMetric,\n      densityRatio\n    };`
);

// Pass density ratio to calculateSystemVentilation
// Wait, currently calculateSystemVentilation is not directly called here, it was called in MultiZoneVentilationService, but we updated it to exact method inside Ashrae621Service!
// Let's check how System calculation is done in Ashrae621VentilationCalc.tsx.
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
