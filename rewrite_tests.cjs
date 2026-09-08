const fs = require('fs');

const makeVerified = `
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

function rewriteNumerical() {
  const content = fs.readFileSync('src/tests/ventilation/ashrae-621-numerical.test.ts', 'utf8');
  let newContent = content.replace(/spaceType: verifiedOffice/g, 'spaceType: verifiedOfficeType');
  newContent = newContent.replace(/verifiedEzConfig/g, 'verifiedEz');
  
  if (!newContent.includes('const verifiedOfficeType')) {
     newContent = newContent.replace(/const ezCeiling = [^\n]+/, match => match + '\n  const verifiedOfficeType = makeVerified(officeSpace);\n  const verifiedEz = makeVerified(ezCeiling);\n');
  }
  
  fs.writeFileSync('src/tests/ventilation/ashrae-621-numerical.test.ts', newContent);
}

function rewriteVentilation() {
  const content = fs.readFileSync('src/tests/ventilation/Ventilation.test.ts', 'utf8');
  let newContent = content.replace(/const verifiedOffice = makeVerified\(officeSpaceType\);/g, 'const verifiedOffice = makeVerified(officeSpaceType);');
  newContent = newContent.replace(/ezConfig: \{ \.\.\.verifiedEz,/g, 'ezConfig: { ...verifiedEz,');
  fs.writeFileSync('src/tests/ventilation/Ventilation.test.ts', newContent);
}

rewriteNumerical();
rewriteVentilation();

