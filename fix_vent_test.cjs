const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/Ventilation.test.ts', 'utf-8');

const mockBlock = `
const makeVerified = (item) => {
  if (!item) return item;
  return {
    ...item,
    sourceType: 'ASHRAE_PUBLISHED',
    reference: item.reference || 'ASHRAE 62.1 Section 6.2.2.1',
    revisionState: {
      ...item.revisionState,
      standard: 'ASHRAE 62.1',
      edition: '2025',
      baseEdition: '2025',
      source: 'VERIFIED'
    }
  };
};

const verifiedOffice = makeVerified(officeSpaceType);
const verifiedEz = makeVerified(ezConfig);
`;

code = code.replace(/const officeSpaceType =/g, mockBlock + '\n  const officeSpaceType =');
code = code.replace(/ezConfig: ezConfig/g, 'ezConfig: verifiedEz');
code = code.replace(/ezConfig\n/g, 'ezConfig: verifiedEz\n');
code = code.replace(/ezConfig,/g, 'ezConfig: verifiedEz,');
fs.writeFileSync('src/tests/ventilation/Ventilation.test.ts', code);
