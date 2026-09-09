import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

const newTests = `
  describe('PROVENANCE ARCHITECTURE LOGIC TESTS', () => {
    const makeWithProvenance = (sourceType: string, verificationStatus: string) => {
        const item = { ...verifiedOffice, sourceType, verificationStatus };
        if (item.provenance) {
            item.provenance = {
                rp: { ...item.provenance.rp, sourceType, verificationStatus },
                ra: { ...item.provenance.ra, sourceType, verificationStatus },
                defaultOccupancy: { ...item.provenance.defaultOccupancy, sourceType, verificationStatus },
                reference: { ...item.provenance.reference, sourceType, verificationStatus }
            } as any;
        }
        return item;
    };

    it('21. TEST — VERIFIED PUBLISHED VALUE', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
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
      const office = makeWithProvenance('ASHRAE_PUBLISHED_ADDENDUM', 'VERIFIED');
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
      const office = makeWithProvenance('ASHRAE_PUBLISHED_ERRATA', 'VERIFIED');
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
      const office = makeWithProvenance('PUBLIC_REVIEW_DRAFT', 'VERIFIED');
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
      const office = makeWithProvenance('UNKNOWN', 'VERIFIED');
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
      const office = makeWithProvenance('PUBLIC_REVIEW_DRAFT', 'NOT_VERIFIED');
      office.notes = 'Verified';
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
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      delete (office as any).verificationStatus;
      if (office.provenance) {
          delete (office.provenance.rp as any).verificationStatus;
          delete (office.provenance.ra as any).verificationStatus;
      }
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

content = content.replace(/describe\('PROVENANCE ARCHITECTURE LOGIC TESTS', \(\) => \{[\s\S]*\}\);\n\}\);\n$/g, newTests);
fs.writeFileSync(file, content);
