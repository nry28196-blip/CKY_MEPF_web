const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/__tests__/Ashrae622Service.test.ts', 'utf-8');

code = code.replace(
  /edition: '2022'\n\s*\}/g,
  `edition: '2022',\n      localExhaustDeficit: 0\n    }`
);

code = code.replace(
  /edition: '2025'\n\s*\}/g,
  `edition: '2025',\n      localExhaustDeficit: 0\n    }`
);

fs.writeFileSync('src/calculations/ventilation/__tests__/Ashrae622Service.test.ts', code);
