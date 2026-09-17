import fs from 'fs';
const file = 'src/data/ventilation/ashrae621/types.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/value: number/g, 'value: number | string | boolean');

fs.writeFileSync(file, content);
