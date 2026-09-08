const fs = require('fs');
let content = fs.readFileSync('src/lib/DensityCorrectionService.ts', 'utf8');

content = content.replace(
  "status = 'WARNING';",
  "status = 'INCOMPLETE';"
);

fs.writeFileSync('src/lib/DensityCorrectionService.ts', content);
