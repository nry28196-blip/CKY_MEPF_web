import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("static isSourceTypeAcceptable(sourceType: SourceType): boolean {", "static isAshraeSourceTypeAcceptable(sourceType: SourceType): boolean {");
content = content.replace("sourceType === 'PROJECT_SPECIFICATION' ||", "");
content = content.replace("sourceType === 'ADOPTED_CODE';", "");
content = content.replace("sourceType === 'ASHRAE_PUBLISHED_ERRATA' ||", "sourceType === 'ASHRAE_PUBLISHED_ERRATA';");

fs.writeFileSync(file, content);
