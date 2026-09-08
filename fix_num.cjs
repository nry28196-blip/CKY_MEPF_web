const fs = require('fs');

let content = fs.readFileSync('src/tests/ventilation/ashrae-621-numerical.test.ts', 'utf8');

// For Ez < 1.0 (Heating, ceiling return) test, it expects Voz to be 53.125 but it gets 42.5.
// Why did the test get 42.5? The zone object passes ezConfig: getEzConfig('ez-4').
// Wait, the test uses `expect(result.zone.voz).toBe(53.125)`
// I need to verify what 'ez-4' actually is in StandardDataProvider.ts.
