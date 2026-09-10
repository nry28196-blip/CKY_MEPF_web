import fs from 'fs';
const file = 'src/tests/ventilation/data-quality.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/ && spaceType.revisionState.source === 'VERIFIED'/g, "");
content = content.replace(/ && exhaust.revisionState.source === 'VERIFIED'/g, "");

fs.writeFileSync(file, content);
