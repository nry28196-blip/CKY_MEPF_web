const fs = require('fs');

let content = fs.readFileSync('src/tests/ventilation/exhaust-calculations.test.ts', 'utf8');
content = content.replace(/unitType: 'area'/g, "unitType: 'm2'");
content = content.replace(/rate: 3.5,\s*\/\/[^\n]*\n\s*unitType: 'm2'/g, "exhaustRateMetric: 3.5,\n      exhaustUnit: 'L/s-m2'");
content = content.replace(/rate: 25,\s*\n\s*unitType: 'fixture'/g, "exhaustRateMetric: 25,\n      exhaustUnit: 'L/s-unit'");

// The test creates an object that is supposedly an Ashrae621ExhaustType, but wait...
// The component might expect a specific interface.
// Let's rewrite the test file entirely to match Ashrae621ExhaustType properly.
