const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621ZoneService.ts', 'utf-8');
code = code.replace(/populationBeforeDisplayRounding = pz;\n      statuses.push\('WARNING'\);/g, 'populationBeforeDisplayRounding = pz;');
code = code.replace(/occupancySource = 'default';\n      populationBeforeDisplayRounding = pz;/g, "occupancySource = 'default';\n      populationBeforeDisplayRounding = pz;\n      statuses.push('WARNING');");
fs.writeFileSync('src/calculations/ventilation/Ashrae621ZoneService.ts', code);
