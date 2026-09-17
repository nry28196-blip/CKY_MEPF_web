import fs from 'fs';
const file = 'src/data/ventilation/ashrae621/types.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ExhaustProvenance')) {
  content = content.replace(
    'export interface EzProvenance {',
    `export interface ExhaustProvenance {
  rate?: DataProvenance;
  unitType?: DataProvenance;
  exhaustClass?: DataProvenance;
  operatingCondition?: DataProvenance;
  reference?: DataProvenance;
}

export interface EzProvenance {`
  );
  
  content = content.replace(
    /export interface Ashrae621ExhaustType \{[\s\S]*?verificationDate\?: string;\n\}/g,
    match => match.replace('verificationDate?: string;', 'verificationDate?: string;\n  provenance?: ExhaustProvenance;')
  );
}
fs.writeFileSync(file, content);
