const fs = require('fs');

const mockStr = `
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
`;

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf-8');
  if (!code.includes('makeVerified(')) {
    code = code.replace(/describe\(/, mockStr + '\ndescribe(');
  }
  
  // golden.test.ts
  code = code.replace(/const spaceType = StandardDataProvider\.get621SpaceTypes\([^)]+\)\.find\([^)]+\)!;/g, match => match + '\n    const verifiedSpaceType = makeVerified(spaceType);');
  code = code.replace(/const ezConfig = StandardDataProvider\.get621EzValues\([^)]+\)\.find\([^)]+\)!;/g, match => match + '\n    const verifiedEz = makeVerified(ezConfig);');
  code = code.replace(/spaceType: spaceType,/g, "spaceType: verifiedSpaceType,");
  code = code.replace(/ezConfig: ezConfig/g, "ezConfig: verifiedEz");
  code = code.replace(/spaceType,\n/g, "spaceType: verifiedSpaceType,\n");
  code = code.replace(/ezConfig\n/g, "ezConfig: verifiedEz\n");

  fs.writeFileSync(file, code);
}

fixFile('src/tests/ventilation/golden.test.ts');
fixFile('src/tests/ventilation/ashrae-621-numerical.test.ts');
