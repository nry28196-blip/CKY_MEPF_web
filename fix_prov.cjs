const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', 'utf-8');

// remove the notes checks I just added
code = code.replace(/if \(exhaustType\.verificationStatus !== 'VERIFIED' && exhaustType\.notes\?\.toLowerCase\(\)\.includes\('verified'\)\) reasons\.push\('Contradictory Notes'\);\n\s*/g, "");
code = code.replace(/if \(spaceType\.verificationStatus !== 'VERIFIED' && spaceType\.notes\?\.toLowerCase\(\)\.includes\('verified'\)\) reasons\.push\('Contradictory Notes'\);\n\s*/g, "");

fs.writeFileSync('src/calculations/ventilation/DataProvenanceValidationService.ts', code);
