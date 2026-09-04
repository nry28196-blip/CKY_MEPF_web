const fs = require('fs');

let content = fs.readFileSync('src/components/Ashrae621ExhaustCalc.tsx', 'utf8');

// Replace imports
content = content.replace(
  `import { Ashrae621ExhaustService } from '../calculations/ventilation/Ashrae621ExhaustService';\nimport { ExhaustDatabaseService, ExhaustSpaceType } from '../calculations/data/exhaust/ExhaustDatabase';`,
  `import { Ashrae621ExhaustService, ExhaustSpaceType, AshraeEdition } from '../calculations/ventilation/Ashrae621ExhaustService';`
);

// Replace get calls
content = content.replace(
  `const allSpaces = ExhaustDatabaseService.getAllSpaces();`,
  `const allSpaces = Ashrae621ExhaustService.getSpaces(edition as AshraeEdition);`
);

content = content.replace(
  `ExhaustDatabaseService.getSpaceById(r.categoryId)`,
  `Ashrae621ExhaustService.getSpaceById(r.categoryId, edition as AshraeEdition)`
);

fs.writeFileSync('src/components/Ashrae621ExhaustCalc.tsx', content);
