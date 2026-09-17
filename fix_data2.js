import fs from 'fs';
const file = 'src/data/ventilation/ashrae621/2022/data.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/revision: '2022 Base'/g, "revision: '2022'");

fs.writeFileSync(file, content);
