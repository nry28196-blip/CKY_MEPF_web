const fs = require('fs');

const createVerifiedMock = `
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

const verifiedOffice = makeVerified(officeSpace);
const verifiedEz = makeVerified(ezCeiling);
`;

const replaceWithVerified = (file) => {
  let code = fs.readFileSync(file, 'utf-8');
  if (code.includes('makeVerified(')) return;
  
  code = code.replace(/const officeSpace = StandardDataProvider.get621SpaceTypes\([^)]+\)\.find\([^)]+\)!;/g, match => match + '\n' + createVerifiedMock);
  
  // Replace spaceType: officeSpace with spaceType: verifiedOffice
  code = code.replace(/spaceType: officeSpace/g, "spaceType: verifiedOffice");
  code = code.replace(/ezConfig: ezCeiling/g, "ezConfig: verifiedEz");
  
  fs.writeFileSync(file, code);
}

replaceWithVerified('src/tests/ventilation/Ventilation.test.ts');
replaceWithVerified('src/tests/ventilation/ashrae-621-zone.test.ts');
replaceWithVerified('src/tests/ventilation/golden.test.ts');
replaceWithVerified('src/tests/ventilation/ashrae-621-numerical.test.ts');

