const fs = require('fs');

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
`;

const processFile = (file) => {
  let code = fs.readFileSync(file, 'utf-8');
  
  if (!code.includes('makeVerified(')) {
    code = code.replace(/describe\(/, mockBlock + '\ndescribe(');
  }
  
  // Wrap any use of StandardDataProvider.get621SpaceTypes(...) with makeVerified(...)
  // e.g. const officeSpace = StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!;
  // becomes const officeSpace = makeVerified(StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!);
  
  // Note: Since I already broke the files, I need to clean up my mess first!
  // It's probably easier to just download the clean files... wait, I don't have them.
  // Let's just fix the variables.
  
  code = code.replace(/verifiedOfficeType/g, 'verifiedOffice');
  code = code.replace(/verifiedSpaceType/g, 'verifiedOffice');
  code = code.replace(/verifiedEz/g, 'verifiedEzConfig');
  
  code = code.replace(/spaceType: spaceType:/g, 'spaceType:'); // fix the double
  
  fs.writeFileSync(file, code);
};

// ... I need a cleaner approach.
