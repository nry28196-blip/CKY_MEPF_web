import fs from 'fs';

const filePath = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(filePath, 'utf8');

const replacement = `  static isValidSourceType(source: any): source is SourceType {
    const validSourceTypes: SourceType[] = [
      'ASHRAE_PUBLISHED', 'ASHRAE_PUBLISHED_ADDENDUM', 'ASHRAE_PUBLISHED_ERRATA',
      'PROJECT_SPECIFICATION', 'ADOPTED_CODE', 'PUBLIC_REVIEW_DRAFT', 'UNKNOWN'
    ];
    return validSourceTypes.includes(source);
  }

  static checkParentConsistency(parent: any, prov: DataProvenance | undefined): boolean {
      if (!prov) return true;
      
      // Ensure revision source is actually a valid SourceType
      const source = parent.revisionState?.source;
      if (!this.isValidSourceType(source)) {
        return false;
      }
      if (!this.isValidSourceType(parent.sourceType)) {
        return false;
      }`;

content = content.replace(/static checkParentConsistency\([\s\S]*?if \(!prov\) return true;\s*\/\/[^\n]*\n\s*const source = parent\.revisionState\?\.source;\n\s*if \(source === 'VERIFIED' \|\| source === 'NOT_VERIFIED' \|\| source === 'INVALID' \|\| \n\s*source === 'PASS' \|\| source === 'FAIL' \|\| source === 'BLOCKED'\) \{\n\s*return false;\n\s*\}/, replacement);

fs.writeFileSync(filePath, content);
