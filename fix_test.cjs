const fs = require('fs');
let code = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf-8');

const importStatement = `import { createSyntheticVerifiedSpaceType, createSyntheticVerifiedEz, createSyntheticVerifiedExhaust } from './test-fixtures';\n`;

// insert import
code = code.replace("import { AuditStatus } from '../../types';", "import { AuditStatus } from '../../types';\n" + importStatement);

// remove inline functions
code = code.replace(/function createSyntheticVerifiedSpaceType[\s\S]*?const editions:/, 'const editions:');

fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', code);
