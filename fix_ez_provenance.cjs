const fs = require('fs');
let content = fs.readFileSync('src/data/ventilation/ashrae621/types.ts', 'utf8');

content = content.replace(
  "export interface EzProvenance {\n  ez?: DataProvenance;\n  applicability?: DataProvenance;\n}",
  "export interface EzProvenance {\n  ez?: DataProvenance;\n  applicability?: DataProvenance;\n  reference?: DataProvenance;\n}"
);

fs.writeFileSync('src/data/ventilation/ashrae621/types.ts', content);
