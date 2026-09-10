import fs from 'fs';
import path from 'path';

function fixFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // find verificationStatus: 'VERIFIED' and add verificationDate: '2025-01-01' where it makes sense
    // The easiest is just to add it to fakeProvenanceItem in makeVerified:
    content = content.replace(/verificationStatus: 'VERIFIED',/g, "verificationStatus: 'VERIFIED',\n        verificationDate: '2025-01-01',");
    
    // Also, some tests explicitly set verificationStatus without using makeVerified.
    
    fs.writeFileSync(file, content);
}

const tests = [
    'src/tests/ventilation/ashrae-621-zone.test.ts',
    'src/tests/ventilation/Ventilation.test.ts',
    'src/tests/ventilation/golden.test.ts',
    'src/tests/ventilation/ashrae-621-numerical.test.ts',
    'src/tests/ventilation/foundation.test.ts',
    'src/tests/ventilation/exhaust-calculations.test.ts',
    'src/tests/ventilation/data-quality.test.ts',
    'src/tests/ventilation/StandardDataProvider.test.ts'
];

tests.forEach(fixFile);
