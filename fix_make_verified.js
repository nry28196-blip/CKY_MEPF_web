import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/ez: \{ \.\.\.fakeProvenanceItem, value: item\.ez \},/,
    "ez: { ...fakeProvenanceItem, value: item.ez },\n          applicability: { ...fakeProvenanceItem, value: item.applicability },");
fs.writeFileSync(file, content);
