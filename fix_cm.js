import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/    \/\/ Currently our checkParentConsistency doesn't explicitly fail if parent source is NOT_VERIFIED,\n      \/\/ but let's see. Wait, "source field containing NOT_VERIFIED => FAIL validation"\n      \/\/ I should update DataProvenanceValidationService to reject this./g, "expect(result.status).toBe('BLOCKED');");

fs.writeFileSync(file, content);
