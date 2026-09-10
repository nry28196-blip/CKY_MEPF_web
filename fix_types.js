import fs from 'fs';
const file = 'src/data/ventilation/ashrae621/types.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("export interface StandardRevision {\n    standard: string;\n    edition: string;\n    baseEdition: string;\n    publishedAddendaApplied: string[];\n    publishedErrataApplied: string[];\n    verificationDate: string;\n    source: string;\n}", 
`export interface StandardRevision {
    standard: string;
    edition: AshraeEdition;
    baseEdition: AshraeEdition;
    publishedAddendaApplied: string[];
    publishedErrataApplied: string[];
    verificationDate: string;
    source: SourceType;
}`);

fs.writeFileSync(file, content);
