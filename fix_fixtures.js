import fs from 'fs';

const p1 = 'src/tests/ventilation/exhaust-calculations.test.ts';
let c1 = fs.readFileSync(p1, 'utf8');
c1 = c1.replace(
  "revisionState: {\\n    source: 'ASHRAE_PUBLISHED',\\n    standard: 'ASHRAE 62.1',\\n    edition: '2025'\\n  }",
  "revisionState: {\\n    source: 'ASHRAE_PUBLISHED',\\n    standard: 'ASHRAE 62.1',\\n    edition: '2025', baseEdition: '2025', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: ''\\n  }"
);
fs.writeFileSync(p1, c1);

const p2 = 'src/tests/ventilation/exhaust-provenance.test.ts';
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace(
  "unitType: 'unit',",
  "unitType: 'fixture',"
);
c2 = c2.replace(
  "revisionState: {\\n    source: 'ASHRAE_PUBLISHED',\\n    standard: 'ASHRAE 62.1',\\n    edition: '2025'\\n  }",
  "revisionState: {\\n    source: 'ASHRAE_PUBLISHED',\\n    standard: 'ASHRAE 62.1',\\n    edition: '2025', baseEdition: '2025', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: ''\\n  }"
);
c2 = c2.replace(
  "revisionState: { source: 'ASHRAE_PUBLISHED', standard: 'ASHRAE 62.1', edition: '2019' }",
  "revisionState: { source: 'ASHRAE_PUBLISHED', standard: 'ASHRAE 62.1', edition: '2019', baseEdition: '2019', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '' }"
);
fs.writeFileSync(p2, c2);

