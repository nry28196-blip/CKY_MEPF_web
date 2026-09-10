import fs from 'fs';

const typesFile = 'src/types.ts';
let typesContent = fs.readFileSync(typesFile, 'utf8');

const auditStatusEnum = `
export enum AuditStatus {
  INPUT_VERIFIED = 'INPUT_VERIFIED',
  INPUT_NOT_VERIFIED = 'INPUT_NOT_VERIFIED',
  DERIVED = 'DERIVED',
  PASS = 'PASS',
  FAIL = 'FAIL',
  BLOCKED = 'BLOCKED',
  ESTIMATED = 'ESTIMATED'
}
`;

if (!typesContent.includes('export enum AuditStatus')) {
  typesContent += auditStatusEnum;
  fs.writeFileSync(typesFile, typesContent);
}

const zoneServiceFile = 'src/calculations/ventilation/Ashrae621ZoneService.ts';
let zoneContent = fs.readFileSync(zoneServiceFile, 'utf8');

const oldEnum = `export enum AuditStatus {
  INPUT_VERIFIED = 'INPUT_VERIFIED',
  INPUT_NOT_VERIFIED = 'INPUT_NOT_VERIFIED',
  DERIVED = 'DERIVED',
  PASS = 'PASS',
  FAIL = 'FAIL',
  BLOCKED = 'BLOCKED',
  ESTIMATED = 'ESTIMATED'
}

`;

if (zoneContent.includes(oldEnum)) {
  zoneContent = zoneContent.replace(oldEnum, '');
  zoneContent = "import { AuditStatus } from '../../types';\n" + zoneContent;
  fs.writeFileSync(zoneServiceFile, zoneContent);
}

// Now replace import in other files.
const files = [
  'src/calculations/ventilation/Ashrae621SimplifiedSystemService.ts',
  'src/calculations/ventilation/Ashrae621AlternativeSystemService.ts',
  'src/calculations/ventilation/Ashrae621DensityService.ts',
  'src/lib/VentilationEngine.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ AuditTrailItem, AuditStatus \} from '.\/Ashrae621ZoneService';/g, "import { AuditTrailItem } from './Ashrae621ZoneService';\nimport { AuditStatus } from '../../types';");
  content = content.replace(/import \{ AuditStatus \} from '\.\.\/calculations\/ventilation\/Ashrae621ZoneService';/g, "import { AuditStatus } from '../types';");
  fs.writeFileSync(file, content);
}
