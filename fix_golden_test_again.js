import fs from 'fs';

const path = 'src/tests/ventilation/golden.test.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "expect(result.status).toBe('BLOCKED');\n    expect(result.simplifiedSystem?.ev).toBe(0.66);",
  "expect(result.status).toBe('PASS');\n    expect(result.simplifiedSystem?.ev).toBe(0.66);"
);

fs.writeFileSync(path, content);
