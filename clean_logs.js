import fs from 'fs';

const filePath = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/console\.log\(.*\);?/g, "");

fs.writeFileSync(filePath, content);
