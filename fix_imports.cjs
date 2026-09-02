const fs = require('fs');

let spaceTypes = fs.readFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', 'utf8');
spaceTypes = spaceTypes.replace(
  "import ashrae2025Data from './ashrae_62_1_2025_database.json';",
  "import ashrae2025Data from '../../../data/ashrae62_1_2025.json';"
);
spaceTypes = spaceTypes.replace(
  "ashrae2025Data.spaces as VentilationSpaceType[]",
  "ashrae2025Data.coefficients.ventilationSpaceTypes as VentilationSpaceType[]"
);
fs.writeFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', spaceTypes);

let airDist = fs.readFileSync('src/calculations/data/ashrae621/AirDistributionData.ts', 'utf8');
airDist = airDist.replace(
  "import ashrae2025Data from './ashrae_62_1_2025_database.json';",
  "import ashrae2025Data from '../../../data/ashrae62_1_2025.json';"
);
airDist = airDist.replace(
  "ashrae2025Data.airDistribution as AirDistributionConfiguration[]",
  "ashrae2025Data.coefficients.airDistribution as AirDistributionConfiguration[]"
);
fs.writeFileSync('src/calculations/data/ashrae621/AirDistributionData.ts', airDist);

console.log("Imports updated.");
