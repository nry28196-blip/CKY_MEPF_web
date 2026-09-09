import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("ASHRAE_621_2025_SPACE_TYPES.find(t => t.id === 'office-2025-01')", "ASHRAE_621_2025_SPACE_TYPES.find(t => t.id === 'office')");
content = content.replace("ASHRAE_621_2025_EZ_VALUES.find(e => e.id === 'ez-2025-01')", "ASHRAE_621_2025_EZ_VALUES.find(e => e.id === 'ez-1')");

fs.writeFileSync(file, content);
