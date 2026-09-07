const fs = require('fs');

// Fix 2019 and 2022 Ez data
const ezDataReplacement = `export const ASHRAE_621_YEAR_EZ_DATA: Ashrae621Ez[] = [
  { id: 'ez-1', name: 'Ceiling Supply / Ceiling Return (Cooling)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: 'YEAR', configuration: 'Ceiling Supply / Ceiling Return', applicableCondition: 'Cooling', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', revision: 'Base' },
  { id: 'ez-2', name: 'Ceiling Supply / Ceiling Return (Heating, >= 8C diff)', ez: 0.8, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: 'YEAR', configuration: 'Ceiling Supply / Ceiling Return', applicableCondition: 'Heating >= 8C diff', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', revision: 'Base' },
  { id: 'ez-3', name: 'Floor Supply / Ceiling Return (Low Velocity)', ez: 1.2, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: 'YEAR', configuration: 'Floor Supply / Ceiling Return', applicableCondition: 'Low Velocity', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', revision: 'Base' },
  { id: 'ez-4', name: 'Floor Supply / Ceiling Return (High Velocity)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: 'YEAR', configuration: 'Floor Supply / Ceiling Return', applicableCondition: 'High Velocity', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', revision: 'Base' }
];`;

['2019', '2022', '2025'].forEach(year => {
    const path = `src/data/ventilation/ashrae621/${year}/data.ts`;
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, 'utf8');
        content = content.replace(/export const ASHRAE_621_\d{4}_EZ_DATA: Ashrae621Ez\[\] = \[[\s\S]*?\];/g, ezDataReplacement.replace(/YEAR/g, year));
        fs.writeFileSync(path, content);
    }
});

// Fix 2019 and 2022 coefficients
['2019', '2022'].forEach(year => {
    const path = `src/data/ventilation/ashrae622/${year}/data.ts`;
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, 'utf8');
        content = content.replace('occupancyCoefficientIP: 7.5', 'occupancyCoefficientIP: 7.5,\n  localExhaustDeficitCoefficient: 0.25');
        fs.writeFileSync(path, content);
    }
});

// Fix duplicate keys in golden.test.ts
const testPath = 'src/tests/ventilation/golden.test.ts';
let testContent = fs.readFileSync(testPath, 'utf8');
// Replace the block where duplicate density might appear
testContent = testContent.replace(/density:\s*\{\s*elevation:\s*0,\s*temperature:\s*20\s*\}\s*\/\/\s*Standard density\s*,?\s*density:\s*\{\s*elevation:\s*0,\s*temperature:\s*20\s*\}/g, 'density: { elevation: 0, temperature: 20 }');
testContent = testContent.replace(/density: \{\s*elevation: 0,\s*temperature: 20\s*\}\s*\/\/\s*Standard density\s*\n\s*density: \{\s*elevation: 0,\s*temperature: 20\s*\}/g, 'density: { elevation: 0, temperature: 20 }');

// We can just use a regex to find multiple densities in the same object literal and remove one.
// Instead, just remove all lines with // Standard density if it contains density
testContent = testContent.replace(/density: \{ elevation: 0, temperature: 20 \} \/\/ Standard density\n/g, '');
fs.writeFileSync(testPath, testContent);

// Fix unit conversions
const svcPath = 'src/services/UnitConversionService.ts';
let svcContent = fs.readFileSync(svcPath, 'utf8');
svcContent = svcContent.replace(/cfmSqFtToLsSqM/g, 'cfmFt2ToLsM2');
svcContent = svcContent.replace(/lsSqMToCfmSqFt/g, 'lsM2ToCfmFt2');
fs.writeFileSync(svcPath, svcContent);

