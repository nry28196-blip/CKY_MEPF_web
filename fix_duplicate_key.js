import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/applicability: \{ \.\.\.fakeProvenanceItem, value: item\.applicability \},\n          applicability: \{ \.\.\.fakeProvenanceItem, value: item\.applicableCondition \},/,
    "applicability: { ...fakeProvenanceItem, value: item.applicableCondition },");

fs.writeFileSync(file, content);
