import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

const newTests = `    it('B-22. TEST — PROVENANCE EDITION MISMATCH', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.rp) {
          office.provenance.rp.edition = '2022';
      }
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).not.toBe('PASS');
    });
    
    it('B-23. TEST — PROVENANCE STANDARD MISMATCH', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.rp) {
          office.provenance.rp.standard = 'ASHRAE 62.2';
      }
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).not.toBe('PASS');
    });

    it('B-28. TEST — MISSING EDITION', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.rp) {
          delete (office.provenance.rp as any).edition;
      }
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).not.toBe('PASS');
    });

    it('B-29. TEST — MISSING REVISION', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.rp) {
          delete (office.provenance.rp as any).revision;
      }
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });

    it('B-30. TEST — CONTRADICTORY STATUS', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'NOT_VERIFIED');
      office.notes = "Verified";
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });

    it('B-31. TEST — PARTIALLY VERIFIED OFFICE', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.ra) {
          office.provenance.ra.verificationStatus = 'NOT_VERIFIED';
      }
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('NOT_VERIFIED');
    });

    it('B-32. TEST — PARTIALLY VERIFIED EZ', () => {
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

    it('B-33. TEST — COMPLETE VERIFIED FIXTURE', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      const ezConfig = JSON.parse(JSON.stringify({ ...verifiedEz, sourceType: 'ASHRAE_PUBLISHED', verificationStatus: 'VERIFIED' }));
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ezConfig
      });
      expect(result.status).toBe('PASS');
    });

    it('B-34. PRODUCTION DATA TEST', () => {
      let passedCount = 0;
      for (const spaceType of ASHRAE_621_2025_SPACE_TYPES) {
          if (spaceType.verificationStatus === 'NOT_VERIFIED') {
              const result = Ashrae621ZoneService.calculateZone({
                expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
                spaceType: spaceType, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
              });
              if (result.status === 'PASS') passedCount++;
          }
      }
      expect(passedCount).toBe(0);
    });
`;

const end = content.lastIndexOf(`});\n});`);
const newContent = content.substring(0, end) + newTests + `  });\n});\n`;
fs.writeFileSync(file, newContent);
