const fs = require('fs');

const createRevisionState = (edition) => {
  let addenda = [];
  let errata = [];
  
  if (edition === '2025') {
    addenda = ['a'];
    errata = ['August 27, 2026'];
  }
  
  return `{
    standard: 'ASHRAE 62.1',
    edition: '${edition}',
    baseEdition: '${edition}',
    publishedAddendaApplied: ${JSON.stringify(addenda)},
    publishedErrataApplied: ${JSON.stringify(errata)},
    verificationDate: '2026-09-08',
    source: 'NOT_VERIFIED'
  }`;
};

const processFile = (file, edition) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  
  // replace revisionSource: '...' with revisionState: {...}, sourceType: 'UNVERIFIED_DRAFT'
  content = content.replace(/revisionSource:\s*'[^']+'/g, `revisionState: ${createRevisionState(edition)}, sourceType: 'UNVERIFIED_DRAFT'`);
  // replace revision: '...' with revisionState: {...}, sourceType: 'UNVERIFIED_DRAFT'
  content = content.replace(/revision:\s*'[^']+'/g, `revisionState: ${createRevisionState(edition)}, sourceType: 'UNVERIFIED_DRAFT'`);
  
  fs.writeFileSync(file, content);
};

processFile('src/data/ventilation/ashrae621/2019/data.ts', '2019');
processFile('src/data/ventilation/ashrae621/2022/data.ts', '2022');
processFile('src/data/ventilation/ashrae621/2025/data.ts', '2025');

