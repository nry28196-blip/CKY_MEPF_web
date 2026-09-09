import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ASHRAE_621_2025_SPACE_TYPES')) {
    console.log("No space types?");
}

// Add import
content = content.replace("import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';",
    "import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';\nimport { ASHRAE_621_2025_SPACE_TYPES, ASHRAE_621_2025_EZ_VALUES } from '../../data/ventilation/ashrae621/2025/data';");

fs.writeFileSync(file, content);
