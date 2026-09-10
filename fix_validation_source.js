import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

const oldCheckParent = `  static checkParentConsistency(parent: any, prov: DataProvenance | undefined): boolean {
      if (!prov) return true;
      if (prov.verificationStatus === 'VERIFIED' && parent.verificationStatus === 'NOT_VERIFIED') return false;
      if (parent.standard !== prov.standard) return false;
      if (parent.edition !== prov.edition) return false;
      if (parent.revisionState?.standard !== prov.standard) return false;
      if (parent.revisionState?.edition !== prov.edition) return false;
      // Note: we do not enforce that parent.revisionState.source === prov.sourceType strictly, 
      // but we shouldn't have conflicting sources either.
      return true;
  }`;

const newCheckParent = `  static checkParentConsistency(parent: any, prov: DataProvenance | undefined): boolean {
      if (parent.revisionState?.source === 'VERIFIED' || parent.revisionState?.source === 'NOT_VERIFIED' || parent.revisionState?.source === 'INVALID') return false;
      if (!prov) return true;
      if (prov.verificationStatus === 'VERIFIED' && parent.verificationStatus === 'NOT_VERIFIED') return false;
      if (parent.standard !== prov.standard) return false;
      if (parent.edition !== prov.edition) return false;
      if (parent.revisionState?.standard !== prov.standard) return false;
      if (parent.revisionState?.edition !== prov.edition) return false;
      return true;
  }`;

content = content.replace(oldCheckParent, newCheckParent);

fs.writeFileSync(file, content);
