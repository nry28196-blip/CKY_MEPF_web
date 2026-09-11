import fs from 'fs';

const file = 'src/tests/ventilation/exhaust-calculations.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/rate:/g, "standard: 'ASHRAE 62.1',\n      rate:");
fs.writeFileSync(file, content);
