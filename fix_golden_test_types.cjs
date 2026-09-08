const fs = require('fs');

const mockRevisionState = `revisionState: {
        standard: 'ASHRAE 62.1',
        edition: '2025',
        baseEdition: '2025',
        publishedAddendaApplied: [],
        publishedErrataApplied: [],
        verificationDate: '2026-01-01',
        source: 'VERIFIED'
      },
      sourceType: 'ASHRAE_PUBLISHED',`;

let code = fs.readFileSync('src/tests/ventilation/golden.test.ts', 'utf-8');

code = code.replace(/id: 'office',\n\s*name: 'Office space',/g, `id: 'office',\n        name: 'Office space',\n        ${mockRevisionState}`);

code = code.replace(/id: 'ez-ceiling',\n\s*name: 'Ceiling Supply\/Return',/g, `id: 'ez-ceiling',\n        name: 'Ceiling Supply/Return',\n        ${mockRevisionState}`);

fs.writeFileSync('src/tests/ventilation/golden.test.ts', code);
