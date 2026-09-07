const fs = require('fs');

const ezDataReplacement = `export const ASHRAE_621_YEAR_EZ_VALUES: Ashrae621Ez[] = [
  { id: 'ez-1', name: 'Ceiling Supply / Ceiling Return (Cooling)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: 'YEAR', configuration: 'Ceiling Supply / Ceiling Return', applicableCondition: 'Cooling', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', revision: 'Base' },
  { id: 'ez-2', name: 'Ceiling Supply / Ceiling Return (Heating, >= 8C diff)', ez: 0.8, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: 'YEAR', configuration: 'Ceiling Supply / Ceiling Return', applicableCondition: 'Heating >= 8C diff', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', revision: 'Base' },
  { id: 'ez-3', name: 'Floor Supply / Ceiling Return (Low Velocity)', ez: 1.2, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: 'YEAR', configuration: 'Floor Supply / Ceiling Return', applicableCondition: 'Low Velocity', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', revision: 'Base' },
  { id: 'ez-4', name: 'Floor Supply / Ceiling Return (High Velocity)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: 'YEAR', configuration: 'Floor Supply / Ceiling Return', applicableCondition: 'High Velocity', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', revision: 'Base' }
];`;

['2019', '2022', '2025'].forEach(year => {
    const path = `src/data/ventilation/ashrae621/${year}/data.ts`;
    if (fs.existsSync(path)) {
        let content = fs.readFileSync(path, 'utf8');
        content = content.replace(/export const ASHRAE_621_\d{4}_EZ_VALUES: Ashrae621Ez\[\] = \[[\s\S]*?\];/g, ezDataReplacement.replace(/YEAR/g, year));
        fs.writeFileSync(path, content);
    }
});

// Remove any duplicate density in tests
const testPath = 'src/tests/ventilation/golden.test.ts';
let testContent = fs.readFileSync(testPath, 'utf8');
testContent = testContent.replace(/density:\s*\{\s*elevation:\s*0,\s*temperature:\s*20\s*\}\s*,\s*density:/g, 'density:');
testContent = testContent.replace(/density: \{\s*elevation: 0,\s*temperature: 20\s*\}\s*\n\s*density:/g, 'density:');
fs.writeFileSync(testPath, testContent);
