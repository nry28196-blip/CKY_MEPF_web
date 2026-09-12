const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf-8');

// Fix editions array type
code = code.replace(/const editions = \['2019', '2022', '2025'\];/g, "const editions: Array<'2019' | '2022' | '2025'> = ['2019', '2022', '2025'];");

// Fix edition parameter types
code = code.replace(/function createSyntheticVerifiedSpaceType\(edition: string\)/g, "function createSyntheticVerifiedSpaceType(edition: '2019' | '2022' | '2025')");
code = code.replace(/function createSyntheticVerifiedEz\(edition: string\)/g, "function createSyntheticVerifiedEz(edition: '2019' | '2022' | '2025')");
code = code.replace(/function createSyntheticVerifiedExhaust\(edition: string\)/g, "function createSyntheticVerifiedExhaust(edition: '2019' | '2022' | '2025')");

// Fix revisionState missing properties
code = code.replace(/revisionState: {\n\s*source: SourceType\.ASHRAE_PUBLISHED,\n\s*standard: 'ASHRAE 62\.1',\n\s*edition: edition\n\s*}/g, 
  "revisionState: { source: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, baseEdition: edition, publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2025-01-01' }");

// Add value: 0 to provenance fields
const provLines = code.match(/provenance: \{[\s\S]*?\}/g);
if (provLines) {
  for (const block of provLines) {
     let newBlock = block.replace(/reference: 'Test'(?!, value)/g, "reference: 'Test', value: 0");
     code = code.replace(block, newBlock);
  }
}

// Fix unitType
code = code.replace(/unitType: 'L\/s\/unit'/g, "unitType: 'fixture'");

// Fix standard/edition assignments to bypass TS error if any (they shouldn't be errored if we cast them)
code = code.replace(/space\.standard = 'WRONG_STANDARD';/g, "space.standard = 'WRONG_STANDARD' as any;");
code = code.replace(/space\.edition = '2022';/g, "space.edition = '2022' as any;");
code = code.replace(/space\.revisionState\.edition = '2022';/g, "space.revisionState.edition = '2022' as any;");


fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', code);
