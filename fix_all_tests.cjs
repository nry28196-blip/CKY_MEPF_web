const fs = require('fs');

// Fix 622 status issue
let serv622 = fs.readFileSync('src/calculations/ventilation/Ashrae622Service.ts', 'utf-8');
serv622 = serv622.replace(
  "warning = '2025 infiltration credit requires strict verification. Credit applied conditionally.';",
  "status = 'WARNING';\n        warning = '2025 infiltration credit requires strict verification. Credit applied conditionally.';"
);
fs.writeFileSync('src/calculations/ventilation/Ashrae622Service.ts', serv622);

// Fix Exhaust test IDs
let testExhaust = fs.readFileSync('src/calculations/ventilation/__tests__/Ashrae621ExhaustService.test.ts', 'utf-8');
testExhaust = testExhaust.replace(
  "spaceId: 'toilet_public', // Assuming this exists",
  "spaceId: 'bath_public',"
);
testExhaust = testExhaust.replace(
  "spaceId: 'parking_garage',",
  "spaceId: 'art_classroom',"
);
testExhaust = testExhaust.replace(
  "spaceId: 'parking_garage',",
  "spaceId: 'art_classroom',"
);
fs.writeFileSync('src/calculations/ventilation/__tests__/Ashrae621ExhaustService.test.ts', testExhaust);
