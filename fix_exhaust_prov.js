import fs from 'fs';
const file = 'src/data/ventilation/ashrae621/2022/data.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /exhaustClass:\s*\{\s*value:\s*0,\s*standard:\s*'ASHRAE 62\.1',\s*edition:\s*'2022',\s*reference:\s*'Table 6\.5\.1',\s*sourceType:\s*SourceType\.ASHRAE_PUBLISHED,\s*verificationStatus:\s*'VERIFIED',\s*revision:\s*'2022',\s*verificationDate:\s*'2026-09-08'\s*\}/g,
  `exhaustClass: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
    unitType: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
    operatingCondition: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }`
);

fs.writeFileSync(file, content);
