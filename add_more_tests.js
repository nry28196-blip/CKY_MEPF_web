import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

const newTests = `
    it('28. TEST — INVALID SOURCE COMBINATION (UNVERIFIED_DRAFT + VERIFIED)', () => {
      const office = makeWithProvenance('UNVERIFIED_DRAFT', 'VERIFIED');
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

    it('32. TEST — FIELD-LEVEL FAILURE', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.ra) {
          office.provenance.ra.verificationStatus = 'NOT_VERIFIED';
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
      expect(result.reason).toBe('Unverified Ra');
    });

    it('33. TEST — Ez FAILURE', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      const ezConfig = { ...verifiedEz, sourceType: 'ASHRAE_PUBLISHED', verificationStatus: 'VERIFIED' };
      if (ezConfig.provenance && ezConfig.provenance.applicability) {
          ezConfig.provenance.applicability.verificationStatus = 'NOT_VERIFIED';
      }
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: ezConfig
      });
      expect(result.status).toBe('NOT_VERIFIED');
      expect(result.reason).toBe('Unverified Ez Applicability');
    });

    it('34. TEST — EDITION MISMATCH', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      const ezConfig = { ...verifiedEz, edition: '2022' };
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: ezConfig
      });
      expect(result.status).toBe('INCOMPLETE');
      expect(result.reason).toBe('Edition Mismatch');
    });

    it('35. TEST — REVISION MISMATCH', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      office.revisionState = { ...office.revisionState, edition: '2022' };
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2025',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: verifiedEz
      });
      expect(result.status).toBe('INCOMPLETE');
      expect(result.reason).toBe('Revision Mismatch');
    });
  });
});
`;

content = content.replace(/  \}\);\n\}\);\n$/g, newTests);
fs.writeFileSync(file, content);
