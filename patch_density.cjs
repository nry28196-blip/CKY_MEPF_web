const fs = require('fs');

function patchFile(file, target, replacement, importAdd) {
    let code = fs.readFileSync(file, 'utf8');
    if (code.includes(target)) {
        code = code.replace(target, replacement);
        if (importAdd && !code.includes("import { AirDensityService }")) {
            // just put it at the top
            code = importAdd + "\n" + code;
        }
        fs.writeFileSync(file, code);
        console.log("Patched " + file);
    } else {
        console.log("Target not found in " + file);
    }
}

// 1. Ashrae621VentilationCalc.tsx
patchFile('src/components/Ashrae621VentilationCalc.tsx', 
    'const densityRatio = Ashrae621Service.getDensityRatio(altitude, airTemp, isMetric);',
    'const altMeters = isMetric ? altitude : altitude * 0.3048;\n  const tempC = isMetric ? airTemp : (airTemp - 32) * 5/9;\n  const densityRatio = AirDensityService.getAirProperties(altMeters, tempC, 50).densityRatio;',
    "import { AirDensityService } from '../calculations/services/AirDensityService';"
);

// 2. SystemPerformanceCalc.tsx
patchFile('src/components/SystemPerformanceCalc.tsx', 
    'const densityRatio = Ashrae621Service.getDensityRatio(globalAltitude, globalAirTemp, isMetric);',
    'const altMeters = isMetric ? globalAltitude : globalAltitude * 0.3048;\n  const tempC = isMetric ? globalAirTemp : (globalAirTemp - 32) * 5/9;\n  const densityRatio = AirDensityService.getAirProperties(altMeters, tempC, 50).densityRatio;',
    "import { AirDensityService } from '../calculations/services/AirDensityService';"
);

// 3. Ashrae621Service.ts - delete the method
let ashraeCode = fs.readFileSync('src/calculations/ventilation/Ashrae621Service.ts', 'utf8');
ashraeCode = ashraeCode.replace(/static getDensityRatio\([\s\S]*?\}\n/, "");
fs.writeFileSync('src/calculations/ventilation/Ashrae621Service.ts', ashraeCode);
console.log("Patched Ashrae621Service");

