import fs from 'fs';

// 1. Revert DataProvenanceValidationService
const valFile = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let valContent = fs.readFileSync(valFile, 'utf8');
valContent = valContent.replace(
  /const shouldValidateOccupancy = useDefaultOccupancy \|\| spaceType\.defaultOccupancyMetric !== undefined;/g,
  'const shouldValidateOccupancy = useDefaultOccupancy;'
);
fs.writeFileSync(valFile, valContent);

// 2. Fix the test in ashrae-621-2022-density-propagation.test.ts
const testFile = 'src/tests/ventilation/ashrae-621-2022-density-propagation.test.ts';
let testContent = fs.readFileSync(testFile, 'utf8');
testContent = testContent.replace(
  /const validationResult = DataProvenanceValidationService\.validateSpaceTypeData\(space, 'ASHRAE 62\.1', '2022', false\);/g,
  "const validationResult = DataProvenanceValidationService.validateSpaceTypeData(space, 'ASHRAE 62.1', '2022', space.defaultOccupancyMetric !== undefined);"
);
fs.writeFileSync(testFile, testContent);

