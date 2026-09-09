import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

const newTests = `
  describe('PROVENANCE ARCHITECTURE LOGIC TESTS', () => {
    it('21. TEST — VERIFIED PUBLISHED VALUE', () => {
      const office = { ...verifiedOffice, sourceType: 'ASHRAE_PUBLISHED', verificationStatus: 'VERIFIED' };
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('PASS');
    });

    it('22. TEST — VERIFIED ADDENDUM', () => {
      const office = { ...verifiedOffice, sourceType: 'ASHRAE_PUBLISHED_ADDENDUM', verificationStatus: 'VERIFIED' };
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('PASS');
    });

    it('23. TEST — VERIFIED ERRATA', () => {
      const office = { ...verifiedOffice, sourceType: 'ASHRAE_PUBLISHED_ERRATA', verificationStatus: 'VERIFIED' };
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('PASS');
    });

    it('24. TEST — PUBLIC REVIEW', () => {
      const office = { ...verifiedOffice, sourceType: 'PUBLIC_REVIEW_DRAFT', verificationStatus: 'VERIFIED' };
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
      expect(result.voz).toBeNull();
    });

    it('25. TEST — UNKNOWN', () => {
      const office = { ...verifiedOffice, sourceType: 'UNKNOWN', verificationStatus: 'VERIFIED' };
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
      expect(result.voz).toBeNull();
    });

    it('26. TEST — CONTRADICTORY RECORD', () => {
      const office = { ...verifiedOffice, notes: 'Verified', sourceType: 'PUBLIC_REVIEW_DRAFT', verificationStatus: 'NOT_VERIFIED' };
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
      expect(result.voz).toBeNull();
    });

    it('27. TEST — MISSING VERIFICATION STATUS', () => {
      const office = { ...verifiedOffice };
      delete (office as any).verificationStatus;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });
  });
});
`;

content = content.replace(/\}\);\n$/, newTests);
fs.writeFileSync(file, content);
