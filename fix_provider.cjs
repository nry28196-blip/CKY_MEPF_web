const fs = require('fs');

let content = fs.readFileSync('src/data/ventilation/StandardDataProvider.ts', 'utf8');

content = content.replace(
  "import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType } from './ashrae621/types';",
  "import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType, Ashrae621AirQualityStandards } from './ashrae621/types';"
);

content = content.replace(
  "import { ASHRAE_621_2019_SPACE_TYPES, ASHRAE_621_2019_EZ_VALUES, ASHRAE_621_2019_EXHAUST_RATES } from './ashrae621/2019/data';",
  "import { ASHRAE_621_2019_SPACE_TYPES, ASHRAE_621_2019_EZ_VALUES, ASHRAE_621_2019_EXHAUST_RATES, ASHRAE_621_2019_AIR_QUALITY_STANDARDS } from './ashrae621/2019/data';"
);

content = content.replace(
  "import { ASHRAE_621_2022_SPACE_TYPES, ASHRAE_621_2022_EZ_VALUES, ASHRAE_621_2022_EXHAUST_RATES } from './ashrae621/2022/data';",
  "import { ASHRAE_621_2022_SPACE_TYPES, ASHRAE_621_2022_EZ_VALUES, ASHRAE_621_2022_EXHAUST_RATES, ASHRAE_621_2022_AIR_QUALITY_STANDARDS } from './ashrae621/2022/data';"
);

content = content.replace(
  "import { ASHRAE_621_2025_SPACE_TYPES, ASHRAE_621_2025_EZ_VALUES, ASHRAE_621_2025_EXHAUST_RATES } from './ashrae621/2025/data';",
  "import { ASHRAE_621_2025_SPACE_TYPES, ASHRAE_621_2025_EZ_VALUES, ASHRAE_621_2025_EXHAUST_RATES, ASHRAE_621_2025_AIR_QUALITY_STANDARDS } from './ashrae621/2025/data';"
);

const newMethod = `
  static get621AirQualityStandards(edition: AshraeEdition | string): Ashrae621AirQualityStandards {
    switch (edition) {
      case '2019': return ASHRAE_621_2019_AIR_QUALITY_STANDARDS as Ashrae621AirQualityStandards;
      case '2022': return ASHRAE_621_2022_AIR_QUALITY_STANDARDS as Ashrae621AirQualityStandards;
      case '2025': return ASHRAE_621_2025_AIR_QUALITY_STANDARDS as Ashrae621AirQualityStandards;
      default: throw new Error('INVALID_STANDARD_EDITION');
    }
  }
`;

content = content.replace(
  /}\s*$/,
  newMethod + "\n}"
);

fs.writeFileSync('src/data/ventilation/StandardDataProvider.ts', content);

