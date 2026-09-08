const fs = require('fs');

function fixSyntax(f) {
  let code = fs.readFileSync(f, 'utf-8');
  
  // golden.test.ts
  code = code.replace(/verifiedSpaceType,\s*area:/g, 'spaceType: verifiedSpaceType, area:');
  code = code.replace(/verifiedEz,\s*dMode:/g, 'ezConfig: verifiedEz, dMode:');
  
  fs.writeFileSync(f, code);
}

fixSyntax('src/tests/ventilation/golden.test.ts');
fixSyntax('src/tests/ventilation/ashrae-621-numerical.test.ts');

