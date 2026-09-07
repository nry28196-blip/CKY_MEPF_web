const fs = require('fs');

let testFile = fs.readFileSync('src/tests/ventilation/golden.test.ts', 'utf8');
testFile = testFile.replace(/import \{ ASHRAE_621_2025_SPACE_TYPES, ASHRAE_621_2025_EZ_VALUES \} from '\.\.\/\.\.\/data\/ventilation\/ashrae621\/2025\/data';/g,
  "import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';");
testFile = testFile.replace(/import \{ ASHRAE_621_2025_EXHAUST_RATES \} from '\.\.\/\.\.\/data\/ventilation\/ashrae621\/2025\/data';/g, "");
testFile = testFile.replace(/import \{ ASHRAE_622_2025_COEFFICIENTS \} from '\.\.\/\.\.\/data\/ventilation\/ashrae622\/2025\/data';/g, "");

testFile = testFile.replace(/ASHRAE_621_2025_SPACE_TYPES/g, "StandardDataProvider.get621SpaceTypes('2025')");
testFile = testFile.replace(/ASHRAE_621_2025_EZ_VALUES/g, "StandardDataProvider.get621EzValues('2025')");
testFile = testFile.replace(/ASHRAE_621_2025_EXHAUST_RATES/g, "StandardDataProvider.get621ExhaustRates('2025')");
testFile = testFile.replace(/ASHRAE_622_2025_COEFFICIENTS/g, "StandardDataProvider.get622Coefficients('2025')");

fs.writeFileSync('src/tests/ventilation/golden.test.ts', testFile);
