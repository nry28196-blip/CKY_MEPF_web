import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-2022-density-propagation.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/    expect\(res\.eRho\)\.toBeCloseTo\(1\.0, 3\);\n  \}\);\n\n  it\('TEST H/g, "\n  it('TEST H");

fs.writeFileSync(file, content);
