const fs = require('fs');
let code = fs.readFileSync('src/calculations/ventilation/Ashrae621AlternativeSystemService.ts', 'utf-8');

code = code.replace(
  /if \\(input\.vps === null \\|\\| input\.vps === undefined \\|\\| isNaN\\(input\.vps\\)\\) \\{\n.*\n.*\n.*\n\s*\\}/m,
  "foo"
); // let's see if this works... Wait, no, I'll just find and replace using simple string replacement.

