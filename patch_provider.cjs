const fs = require('fs');

let code = fs.readFileSync('src/data/ventilation/StandardDataProvider.ts', 'utf-8');

code = code.replace(/default:\s*return ASHRAE_621_2025_SPACE_TYPES;/g, "default: throw new Error('INVALID_STANDARD_EDITION');");
code = code.replace(/default:\s*return ASHRAE_621_2025_EZ_VALUES;/g, "default: throw new Error('INVALID_STANDARD_EDITION');");
code = code.replace(/default:\s*return ASHRAE_621_2025_EXHAUST_RATES;/g, "default: throw new Error('INVALID_STANDARD_EDITION');");
code = code.replace(/default:\s*return ASHRAE_622_2025_COEFFICIENTS;/g, "default: throw new Error('INVALID_STANDARD_EDITION');");

fs.writeFileSync('src/data/ventilation/StandardDataProvider.ts', code);
