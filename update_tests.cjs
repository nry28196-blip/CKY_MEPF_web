const fs = require('fs');

let t1 = fs.readFileSync('src/calculations/ventilation/__tests__/Ashrae621SimplifiedSystemService.test.ts', 'utf-8');
t1 = t1.replace(/expect\(res\.status\)\.toBe\('WARNING'\);/, "expect(res.status).toBe('INCOMPLETE');");
fs.writeFileSync('src/calculations/ventilation/__tests__/Ashrae621SimplifiedSystemService.test.ts', t1);

let t2 = fs.readFileSync('src/calculations/ventilation/__tests__/Ashrae621AlternativeSystemService.test.ts', 'utf-8');
t2 = t2.replace(/expect\(res\.status\)\.toBe\('WARNING'\);/g, "expect(res.status).toBe('INCOMPLETE');");
fs.writeFileSync('src/calculations/ventilation/__tests__/Ashrae621AlternativeSystemService.test.ts', t2);

let t3 = fs.readFileSync('src/calculations/ventilation/__tests__/GlobalValidation.test.ts', 'utf-8');
// Test 39 expect(res.status).toBe('FAIL') should already be 'FAIL' since we fixed the hierarchy to not overwrite it.
fs.writeFileSync('src/calculations/ventilation/__tests__/GlobalValidation.test.ts', t3);
