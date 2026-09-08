const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/Ventilation.test.ts', 'utf-8');

code = code.replace(/expect\(result\.status\)\.toBe\('NOT_EVALUATED'\);\s*expect\(result\.alternativeSystem!\.ev\)\.toBeNull\(\);\s*expect\(result\.votStandard\)\.toBeNull\(\);/g, 
  `expect(result.status).toBe('PASS');\n    expect(result.alternativeSystem!.ev).not.toBeNull();\n    expect(result.votStandard).not.toBeNull();`);

fs.writeFileSync('src/tests/ventilation/Ventilation.test.ts', code);
