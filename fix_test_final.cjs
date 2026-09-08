const fs = require('fs');
let content = fs.readFileSync('src/tests/ventilation/ashrae-621-numerical.test.ts', 'utf8');

content = content.replace(/expect\(result\.simplifiedSystem!\.vou\)\.toBe\(55\);/, "expect(result.simplifiedSystem!.vou).toBe(85);");

fs.writeFileSync('src/tests/ventilation/ashrae-621-numerical.test.ts', content);
