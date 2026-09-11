import fs from 'fs';

const filePath = 'src/tests/ventilation/data-quality.test.ts';
let content = fs.readFileSync(filePath, 'utf8');

const safetyScan = `
  describe('DATA-SOURCE SAFETY SCAN (ALL EDITIONS)', () => {
    const editions: ('2019' | '2022' | '2025')[] = ['2019', '2022', '2025'];
    
    const validSourceTypes = [
      'ASHRAE_PUBLISHED', 'ASHRAE_PUBLISHED_ADDENDUM', 'ASHRAE_PUBLISHED_ERRATA',
      'PROJECT_SPECIFICATION', 'ADOPTED_CODE', 'PUBLIC_REVIEW_DRAFT', 'UNKNOWN'
    ];
    const validVerificationStatuses = ['VERIFIED', 'NOT_VERIFIED', 'INVALID'];

    const checkProvenanceItem = (item: any, expectedEdition: string) => {
      if (!item) return;
      expect(validSourceTypes).toContain(item.sourceType);
      expect(validVerificationStatuses).toContain(item.verificationStatus);
      expect(item.standard).toBe('ASHRAE 62.1');
      expect(item.edition).toBe(expectedEdition);
      
      if (item.revisionState) {
        expect(validSourceTypes).toContain(item.revisionState.source);
        expect(item.revisionState.edition).toBe(expectedEdition);
        expect(item.revisionState.standard).toBe('ASHRAE 62.1');
        
        // Ensure no legacy or status in source
        expect(item.revisionState.source).not.toBe('UNVERIFIED_DRAFT');
        expect(item.revisionState.source).not.toBe('VERIFIED');
        expect(item.revisionState.source).not.toBe('NOT_VERIFIED');
        expect(item.revisionState.source).not.toBe('INVALID');
      }
    };

    const checkRecord = (record: any, expectedEdition: string) => {
      expect(validSourceTypes).toContain(record.sourceType);
      expect(validVerificationStatuses).toContain(record.verificationStatus);
      expect(record.standard).toBe('ASHRAE 62.1');
      expect(record.edition).toBe(expectedEdition);
      
      if (record.revisionState) {
        expect(validSourceTypes).toContain(record.revisionState.source);
        expect(record.revisionState.edition).toBe(expectedEdition);
        expect(record.revisionState.standard).toBe('ASHRAE 62.1');
        
        expect(record.revisionState.source).not.toBe('UNVERIFIED_DRAFT');
        expect(record.revisionState.source).not.toBe('VERIFIED');
        expect(record.revisionState.source).not.toBe('NOT_VERIFIED');
        expect(record.revisionState.source).not.toBe('INVALID');
      }
      
      if (record.provenance) {
        Object.values(record.provenance).forEach((provItem: any) => {
          checkProvenanceItem(provItem, expectedEdition);
        });
      }
    };

    editions.forEach(edition => {
      it(\`Validates metadata integrity for \${edition} Space Types\`, () => {
        const spaceTypes = StandardDataProvider.get621SpaceTypes(edition);
        spaceTypes.forEach(spaceType => checkRecord(spaceType, edition));
      });

      it(\`Validates metadata integrity for \${edition} Ez Values\`, () => {
        const ezValues = StandardDataProvider.get621EzValues(edition);
        ezValues.forEach(ez => checkRecord(ez, edition));
      });

      it(\`Validates metadata integrity for \${edition} Exhaust Rates\`, () => {
        const exhaustRates = StandardDataProvider.get621ExhaustRates(edition);
        exhaustRates.forEach(exhaust => checkRecord(exhaust, edition));
      });
    });
  });
`;

// Append to file
if (!content.includes('DATA-SOURCE SAFETY SCAN')) {
  // Strip trailing "});" from the first describe and put it back
  content = content.replace(/}\);\s*$/, "");
  content += safetyScan + "\n});";
  fs.writeFileSync(filePath, content);
}
