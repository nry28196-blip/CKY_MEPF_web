const fs = require('fs');
const file = '/app/applet/src/tests/ventilation/golden.test.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'floorArea: 100,\n      bedrooms: 3,\n      infiltrationCredit: null,\n      infiltrationVerified: false',
  'floorArea: 100,\n      bedrooms: 3,\n      infiltrationCredit: null,\n      infiltrationVerified: false,\n      coefficients: ASHRAE_622_2025_COEFFICIENTS'
);

content = content.replace(
  'floorArea: 100,\n      bedrooms: 3,\n      infiltrationCredit: 10,\n      infiltrationVerified: false // Not verified',
  'floorArea: 100,\n      bedrooms: 3,\n      infiltrationCredit: 10,\n      infiltrationVerified: false, // Not verified\n      coefficients: ASHRAE_622_2025_COEFFICIENTS'
);

fs.writeFileSync(file, content);
