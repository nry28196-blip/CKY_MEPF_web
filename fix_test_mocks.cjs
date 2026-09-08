const fs = require('fs');

const fixMocks = (file) => {
  let code = fs.readFileSync(file, 'utf-8');
  
  // add reference
  code = code.replace(/id: 'office',\n\s*name: 'Office space',/g, "id: 'office',\n        name: 'Office space',\n        reference: 'ASHRAE 62.1 Section 6.2.2.1',");
  code = code.replace(/id: 'ez-ceiling',\n\s*name: 'Ceiling Supply\/Return',/g, "id: 'ez-ceiling',\n        name: 'Ceiling Supply/Return',\n        reference: 'ASHRAE 62.1 Section 6.2.2.2',");
  
  // ensure sourceType and revisionState are VERIFIED
  const rs = `revisionState: {
          standard: 'ASHRAE 62.1',
          edition: '2025',
          baseEdition: '2025',
          publishedAddendaApplied: [],
          publishedErrataApplied: [],
          verificationDate: '2026-01-01',
          source: 'VERIFIED'
        },
        sourceType: 'ASHRAE_PUBLISHED',`;
        
  code = code.replace(/id: 'office',\n\s*name: 'Office space',\n\s*reference: 'ASHRAE 62.1 Section 6.2.2.1',/g, `id: 'office',\n        name: 'Office space',\n        reference: 'ASHRAE 62.1 Section 6.2.2.1',\n        ${rs}`);
  code = code.replace(/id: 'ez-ceiling',\n\s*name: 'Ceiling Supply\/Return',\n\s*reference: 'ASHRAE 62.1 Section 6.2.2.2',/g, `id: 'ez-ceiling',\n        name: 'Ceiling Supply/Return',\n        reference: 'ASHRAE 62.1 Section 6.2.2.2',\n        ${rs}`);

  fs.writeFileSync(file, code);
};

fixMocks('src/tests/ventilation/Ventilation.test.ts');
fixMocks('src/tests/ventilation/ashrae-621-zone.test.ts');
// golden.test.ts was already partially modified, let's just make it simple
