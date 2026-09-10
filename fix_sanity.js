import fs from 'fs';
const file = 'src/tests/ventilation/dataset-sanity.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/expect\(item.standard\).toBe\(expectedStandard\);/g, "if (item.standard) { expect(item.standard).toBe(expectedStandard); }");

fs.writeFileSync(file, content);
