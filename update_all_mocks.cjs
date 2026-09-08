const fs = require('fs');

const rs = `revisionState: {
          standard: 'ASHRAE 62.1',
          edition: '2025',
          baseEdition: '2025',
          publishedAddendaApplied: [],
          publishedErrataApplied: [],
          verificationDate: '2026-01-01',
          source: 'VERIFIED'
        },
        sourceType: 'ASHRAE_PUBLISHED',
        reference: 'Mock Ref',`;

function fixFile(f) {
  let code = fs.readFileSync(f, 'utf-8');
  // clear old mock lines if any
  code = code.replace(/revisionState: \{[^}]+\},\n\s*sourceType: '[^']+',/g, '');
  code = code.replace(/reference: '[^']+',/g, '');

  // insert new
  code = code.replace(/id: 'office',/g, `id: 'office',\n        ${rs}`);
  code = code.replace(/id: 'ez-ceiling',/g, `id: 'ez-ceiling',\n        ${rs}`);

  fs.writeFileSync(f, code);
}

fixFile('src/tests/ventilation/Ventilation.test.ts');
fixFile('src/tests/ventilation/ashrae-621-zone.test.ts');
fixFile('src/tests/ventilation/golden.test.ts');
fixFile('src/tests/ventilation/ashrae-621-numerical.test.ts');

