import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

const newTests = `    it('21. TEST — ASHRAE PUBLISHED', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('PASS');
    });
    it('22. TEST — ASHRAE ADDENDUM', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED_ADDENDUM', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('PASS');
    });
    it('23. TEST — ASHRAE ERRATA', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED_ERRATA', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('PASS');
    });
    it('24. TEST — PROJECT SPECIFICATION', () => {
      const office = makeWithProvenance('PROJECT_SPECIFICATION', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });
    it('25. TEST — ADOPTED CODE', () => {
      const office = makeWithProvenance('ADOPTED_CODE', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });
    it('26. TEST — PUBLIC REVIEW', () => {
      const office = makeWithProvenance('PUBLIC_REVIEW_DRAFT', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });
    it('27. TEST — UNKNOWN', () => {
      const office = makeWithProvenance('UNKNOWN', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });
    it('28. TEST — CURRENT OFFICE 2025 DATA', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: ASHRAE_621_2025_SPACE_TYPES.find(t => t.id === 'office-2025-01')!,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false,
        ezConfig: ASHRAE_621_2025_EZ_VALUES.find(e => e.id === 'ez-2025-01')!
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });
    it('29. TEST — FIELD-LEVEL VERIFICATION', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.ez) {
          office.provenance.ez.verificationStatus = 'NOT_VERIFIED';
      }
      const ezConfig = JSON.parse(JSON.stringify({ ...verifiedEz, sourceType: 'ASHRAE_PUBLISHED', verificationStatus: 'VERIFIED' }));
      if (ezConfig.provenance && ezConfig.provenance.ez) {
          ezConfig.provenance.ez.verificationStatus = 'NOT_VERIFIED';
      }
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ezConfig
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });
    it('30. TEST — EZ APPLICABILITY', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      const ezConfig = JSON.parse(JSON.stringify({ ...verifiedEz, sourceType: 'ASHRAE_PUBLISHED', verificationStatus: 'VERIFIED' }));
      if (ezConfig.provenance && ezConfig.provenance.applicability) {
          ezConfig.provenance.applicability.verificationStatus = 'NOT_VERIFIED';
      }
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ezConfig
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });
    it('31. TEST — EDITION MISMATCH', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      const ezConfig = { ...verifiedEz, edition: '2022' };
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ezConfig
      });
      expect(result.status).toBe('INCOMPLETE');
    });
    it('32. TEST — PROJECT REQUIREMENT SEPARATE FROM ASHRAE', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      const projectReq = makeWithProvenance('PROJECT_SPECIFICATION', 'VERIFIED');
      // Should fail if we mistakenly pass projectReq directly to spaceType
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: projectReq, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });`;

// Replace everything inside describe('PROVENANCE ARCHITECTURE LOGIC TESTS', ...)
const start = content.indexOf(`describe('PROVENANCE ARCHITECTURE LOGIC TESTS'`);
const end = content.lastIndexOf(`});\n});`);

const newContent = content.substring(0, start) + `describe('PROVENANCE ARCHITECTURE LOGIC TESTS', () => {
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
${newTests}
  });\n});\n`;

fs.writeFileSync(file, newContent);
