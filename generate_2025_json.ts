import { ASHRAE_62_1_2025_SPACES } from './src/calculations/data/ashrae621/SpaceTypes';
import { ASHRAE_62_1_2025_EZ } from './src/calculations/data/ashrae621/AirDistributionData';
import fs from 'fs';

const database = {
  standard: 'ASHRAE 62.1',
  edition: '2025',
  spaces: ASHRAE_62_1_2025_SPACES,
  airDistribution: ASHRAE_62_1_2025_EZ
};

fs.writeFileSync('src/calculations/data/ashrae621/ashrae_62_1_2025_database.json', JSON.stringify(database, null, 2));
console.log("Database written.");
