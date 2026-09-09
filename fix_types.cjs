const fs = require('fs');
let content = fs.readFileSync('src/data/ventilation/ashrae621/types.ts', 'utf8');

const newTypes = `
export interface DataProvenance {
  value: number | string;
  unit?: string;
  standard: string;
  edition: string;
  reference: string;
  sourceType: string;
  revision: string;
  verificationDate?: string;
}

export interface SpaceTypeProvenance {
  rp?: DataProvenance;
  ra?: DataProvenance;
  defaultOccupancy?: DataProvenance;
  airClass?: DataProvenance;
  reference?: DataProvenance;
}

export interface EzProvenance {
  ez?: DataProvenance;
  applicability?: DataProvenance;
}
`;

if (!content.includes('DataProvenance')) {
  content = content + newTypes;
}

content = content.replace(
  "sourceType: string;\n  verificationDate?: string;",
  "sourceType: string;\n  verificationDate?: string;\n  provenance?: SpaceTypeProvenance;"
);

content = content.replace(
  "sourceType: string;\n  verificationDate?: string;\n}",
  "sourceType: string;\n  verificationDate?: string;\n  provenance?: EzProvenance;\n}"
);

fs.writeFileSync('src/data/ventilation/ashrae621/types.ts', content);
