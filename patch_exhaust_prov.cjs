const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/exhaust-provenance.test.ts', 'utf-8');

// Replace any occurrences of `as any`
code = code.replace(/record as any/g, 'record');

fs.writeFileSync('src/tests/ventilation/exhaust-provenance.test.ts', code);
