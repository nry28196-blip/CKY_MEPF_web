const fs = require('fs');
let content = fs.readFileSync('src/tests/ventilation/Ventilation.test.ts', 'utf8');

// I will move the tests inside the describe block
content = content.replace("  });\n});\n\n  it('Test I", "  });\n\n  it('Test I");
content = content.replace("expect(result.zone.voz).toBe(0);\n  });\n", "expect(result.zone.voz).toBe(0);\n  });\n});\n");

fs.writeFileSync('src/tests/ventilation/Ventilation.test.ts', content);

let exhaustTest = fs.readFileSync('src/tests/ventilation/exhaust-calculations.test.ts', 'utf8');
exhaustTest = exhaustTest.replace(
  "expect(result.status).toBe('INCOMPLETE');",
  "expect(result.status).toBe('NOT_EVALUATED');"
);
fs.writeFileSync('src/tests/ventilation/exhaust-calculations.test.ts', exhaustTest);

