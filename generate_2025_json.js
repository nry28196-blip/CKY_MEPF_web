const fs = require('fs');
const spaceTypesSrc = fs.readFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', 'utf8');
const airDistSrc = fs.readFileSync('src/calculations/data/ashrae621/AirDistributionData.ts', 'utf8');

// We can extract it by evaluating a module or using a simple script. Since it's TS, it's easier to use tsx.
