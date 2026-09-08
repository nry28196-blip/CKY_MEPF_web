const fs = require('fs');
let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

content = content.replace(
  "statuses.push(densityResult.status);\n    \n    const status = VentilationValidationService.aggregateStatus(statuses);",
  "statuses.push(densityResult.status);\n    if (ev !== null && ev <= 0) statuses.push('FAIL');\n    \n    const status = VentilationValidationService.aggregateStatus(statuses);"
);

fs.writeFileSync('src/lib/VentilationEngine.ts', content);
