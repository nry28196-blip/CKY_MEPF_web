const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae622Service.ts', 'utf-8');

code = code.replace(
  "    const qReq = input.qReq || 0;",
  "    const qReq = input.qReq !== undefined ? input.qReq : 0;"
);

fs.writeFileSync('src/calculations/ventilation/Ashrae622Service.ts', code);
