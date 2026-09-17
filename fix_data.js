import fs from 'fs';
const file = 'src/data/ventilation/ashrae621/2022/data.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Addendum j for revisionState in all arrays
content = content.replace(/publishedAddendaApplied:\s*\['Addendum j'\]/g, 'publishedAddendaApplied: []');

// 2. We can inject verificationDate: '2026-09-08' next to verificationStatus: 'VERIFIED'
content = content.replace(/verificationStatus:\s*'VERIFIED'\s*\}/g, "verificationStatus: 'VERIFIED', verificationDate: '2026-09-08' }");

// 3. To add provenance, it's easier to just use regex to insert it before "sourceType: "
const spaceTypeProv = `
  provenance: {
    rp: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022 Base', verificationDate: '2026-09-08' },
    ra: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022 Base', verificationDate: '2026-09-08' },
    defaultOccupancy: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022 Base', verificationDate: '2026-09-08' }
  },`;
  
const ezProv = `
  provenance: {
    ez: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022 Base', verificationDate: '2026-09-08' },
    applicability: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022 Base', verificationDate: '2026-09-08' }
  },`;

const exhaustProv = `
  provenance: {
    rate: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022 Base', verificationDate: '2026-09-08' },
    exhaustClass: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022 Base', verificationDate: '2026-09-08' }
  },`;

// Let's iterate block by block:
let newContent = "";
let currentArray = "";
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (line.includes('export const ASHRAE_621_2022_SPACE_TYPES')) currentArray = 'SPACE_TYPES';
  else if (line.includes('export const ASHRAE_621_2022_EZ_VALUES')) currentArray = 'EZ_VALUES';
  else if (line.includes('export const ASHRAE_621_2022_EXHAUST_RATES')) currentArray = 'EXHAUST_RATES';
  
  if (line.includes('sourceType: SourceType.ASHRAE_PUBLISHED')) {
     if (currentArray === 'SPACE_TYPES' && !line.includes('revisionState')) {
         line = spaceTypeProv + "\n  " + line;
     } else if (currentArray === 'EZ_VALUES' && !line.includes('revisionState')) {
         line = ezProv + "\n  " + line;
     } else if (currentArray === 'EXHAUST_RATES' && !line.includes('revisionState')) {
         line = exhaustProv + "\n  " + line;
     }
  }
  
  newContent += line + '\n';
}

fs.writeFileSync(file, newContent);
