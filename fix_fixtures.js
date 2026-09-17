import fs from 'fs';
const file = 'src/tests/ventilation/test-fixtures.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /provenance: \{\s*rp: \{.*value: 0.*\},\s*ra: \{.*value: 0.*\},\s*defaultOccupancy: \{.*value: 0.*\},\s*reference: \{.*value: 0.*\}\s*\}/s,
  `provenance: {
      rp: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 2.5, revision: edition },
      ra: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 0.3, revision: edition },
      defaultOccupancy: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 5.4, revision: edition },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 'Synthetic Test Data', revision: edition }
    }`
);

content = content.replace(
  /provenance: \{\s*ez: \{.*value: 0.*\},\s*applicability: \{.*value: 0.*\},\s*reference: \{.*value: 0.*\}\s*\}/s,
  `provenance: {
      ez: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 1.0, revision: edition },
      applicability: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 'Test', revision: edition },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 'Synthetic Test Data', revision: edition }
    }`
);

content = content.replace(
  /exhaustClass: 2\n  \};/s,
  `exhaustClass: 2,
    provenance: {
      rate: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 25, revision: edition },
      unitType: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 'fixture', revision: edition },
      exhaustClass: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 2, revision: edition },
      operatingCondition: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 'Test', revision: edition },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Synthetic Test Data', value: 'Synthetic Test Data', revision: edition }
    }
  };`
);


fs.writeFileSync(file, content);
