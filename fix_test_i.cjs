const fs = require('fs');
let content = fs.readFileSync('src/tests/ventilation/Ventilation.test.ts', 'utf8');

content = content.replace(
  "expect(result.status).toBe('INCOMPLETE');",
  "expect(result.status).toBe('FAIL');"
);

fs.writeFileSync('src/tests/ventilation/Ventilation.test.ts', content);
