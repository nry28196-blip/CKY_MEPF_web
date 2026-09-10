import fs from 'fs';
import path from 'path';

function fixFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Change source: 'VERIFIED' to source: 'ASHRAE_PUBLISHED'
    content = content.replace(/source: 'VERIFIED'/g, "source: 'ASHRAE_PUBLISHED'");
    
    // Also some tests might have source: 'NOT_VERIFIED', replace it with 'UNKNOWN' inside revisionState
    content = content.replace(/source: 'NOT_VERIFIED'/g, "source: 'UNKNOWN'");
    
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
