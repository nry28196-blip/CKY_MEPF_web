import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

// Update expects in B tests
content = content.replace(/expect\(result.status\).toBe\('NOT_VERIFIED'\);/g, "expect(result.status).toBe('BLOCKED');");

fs.writeFileSync(file, content);
