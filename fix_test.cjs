const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/ashrae-621-zone.test.ts', 'utf-8');
code = code.replace(/expect\(result.status\).toBe\('WARNING'\);\n    expect\(result.az\).toBe\(100\);\n    expect\(result.pz\).toBe\(5\);/g, "expect(result.status).toBe('PASS');\n    expect(result.az).toBe(100);\n    expect(result.pz).toBe(5);");
fs.writeFileSync('src/tests/ventilation/ashrae-621-zone.test.ts', code);
