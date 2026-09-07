const fs = require('fs');

const filesToUpdate = [
    'src/components/MechanicalCalc.tsx',
    'src/components/ResidentialVentilationCalc.tsx',
    'src/components/Ashrae621ExhaustCalc.tsx',
    'src/components/Ashrae621VentilationCalc.tsx',
];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/from '\.\.\/services\/UnitConversionService'/g, "from '../lib/UnitConversionService'");
    fs.writeFileSync(file, content);
});

let testFile = fs.readFileSync('src/tests/ventilation/golden.test.ts', 'utf8');
testFile = testFile.replace(/from '\.\.\/\.\.\/services\/UnitConversionService'/g, "from '../../lib/UnitConversionService'");
fs.writeFileSync('src/tests/ventilation/golden.test.ts', testFile);
