const fs = require('fs');
let testExhaust = fs.readFileSync('src/calculations/ventilation/__tests__/Ashrae621ExhaustService.test.ts', 'utf-8');
testExhaust = testExhaust.replace(
  "expect(res.warning).toContain('AHJ unverified');",
  "expect(res.warning).toContain('Local/AHJ governing requirement not established');"
);
fs.writeFileSync('src/calculations/ventilation/__tests__/Ashrae621ExhaustService.test.ts', testExhaust);
