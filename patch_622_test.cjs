const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/__tests__/Ashrae622Service.test.ts', 'utf-8');

code = code.replace(
  /expect\(res\.warning\)\.toContain\('2025 infiltration credit requires strict verification'\);/,
  `expect(res.notEvaluatedItems).toContain('2025 Strict Infiltration Verification');`
);

fs.writeFileSync('src/calculations/ventilation/__tests__/Ashrae622Service.test.ts', code);
