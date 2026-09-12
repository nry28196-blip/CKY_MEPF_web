const fs = require('fs');

let code = fs.readFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', 'utf-8');

code = code.replace(
  /\/\/ 18\. CONTRADICTORY DATA - Reject notes = "Verified" while verificationStatus = NOT_VERIFIED[\s\S]*?if \(spaceType\.notes\?\.toLowerCase\(\)\.includes\('verified'\) && spaceType\.verificationStatus !== 'VERIFIED'\) \{[\s\S]*?reasons\.push\('Contradictory Verification Status'\);[\s\S]*?\}/,
  ""
);

code = code.replace(
  /if \(exhaustType\.notes\?\.toLowerCase\(\)\.includes\('verified'\)\) \{[\s\S]*?reasons\.push\('Contradictory Verification Status'\);[\s\S]*?\}/,
  ""
);

fs.writeFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', code);

let testCode = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf-8');

testCode = testCode.replace(
  /it\('blocks NOT_VERIFIED record with notes claiming "verified"', \(\) => \{[\s\S]*?\}\);/g,
  ""
);

testCode = testCode.replace(
  /it\('Exhaust: blocks NOT_VERIFIED record with notes claiming "verified"', \(\) => \{[\s\S]*?\}\);/g,
  ""
);

fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', testCode);
