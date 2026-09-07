const fs = require('fs');
let content = fs.readFileSync('src/calculations/ventilation/Ashrae622Service.ts', 'utf8');

content = content.replace(
  /if \(!input\.infiltrationVerified && input\.infiltrationCredit > 0\) \{\s*status = 'WARNING'; \/\/ Credit not verified\s*\}\s*qInf = input\.infiltrationCredit;/g,
  "if (!input.infiltrationVerified && input.infiltrationCredit > 0) {\n        status = 'WARNING';\n        qInf = 0; // Credit cannot be applied if unverified\n      } else {\n        qInf = input.infiltrationCredit;\n      }"
);

fs.writeFileSync('src/calculations/ventilation/Ashrae622Service.ts', content);
