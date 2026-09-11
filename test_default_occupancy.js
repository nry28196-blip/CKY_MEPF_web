import fs from 'fs';

const filePath = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(filePath, 'utf8');

const occupancyTests = `
  describe('12. DEFAULT OCCUPANCY BEHAVIOR', () => {
    it('Requires valid verified default occupancy provenance when useDefaultOccupancy = true', () => {
      const office = createSyntheticVerifiedFixture(officeSpace);
      // Ensure the defaultOccupancy itself is NOT_VERIFIED, while spaceType is VERIFIED
      if (office.provenance && office.provenance.defaultOccupancy) {
        office.provenance.defaultOccupancy.verificationStatus = 'NOT_VERIFIED';
      }
      
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: null, useDefaultOccupancy: true, ezConfig: syntheticVerifiedEz
      });
      
      expect(result.status).toBe('BLOCKED');
    });

    it('Does NOT require default occupancy provenance when useDefaultOccupancy = false', () => {
      const office = createSyntheticVerifiedFixture(officeSpace);
      // Ensure the defaultOccupancy itself is NOT_VERIFIED, while spaceType is VERIFIED
      if (office.provenance && office.provenance.defaultOccupancy) {
        office.provenance.defaultOccupancy.verificationStatus = 'NOT_VERIFIED';
      }
      
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticVerifiedEz
      });
      
      expect(result.status).toBe('PASS');
    });
  });

  describe('13. GOLDEN MATHEMATICAL TESTS', () => {
    it('PURE MATHEMATICAL TEST - Custom Occupancy', () => {
      // Area = 100 m2, Occupancy = 5, Rp = 2.5, Ra = 0.3, Ez = 1.0
      // Vbp = 12.5
      // Vba = 30.0
      // Vbz = 42.5
      // Voz = 42.5
      const office = createSyntheticVerifiedFixture(officeSpace);
      office.rpMetric = 2.5;
      office.raMetric = 0.3;
      syntheticVerifiedEz.ez = 1.0;

      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticVerifiedEz
      });

      expect(result.status).toBe('PASS');
      expect(result.vbp).toBe(12.5);
      expect(result.vba).toBe(30.0);
      expect(result.vbz).toBe(42.5);
      expect(result.voz).toBe(42.5);
    });

    it('PURE MATHEMATICAL TEST - Default Occupancy', () => {
      // Occupancy density = 5.4, Rp = 2.5, Ra = 0.3, Ez = 1.0
      // Pz = 5.4
      // Vbp = 13.5
      // Vba = 30.0
      // Vbz = 43.5
      // Voz = 43.5
      const office = createSyntheticVerifiedFixture(officeSpace);
      office.rpMetric = 2.5;
      office.raMetric = 0.3;
      office.defaultOccupancyMetric = 5.4;
      syntheticVerifiedEz.ez = 1.0;

      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: null, useDefaultOccupancy: true, ezConfig: syntheticVerifiedEz
      });

      expect(result.status).toBe('PASS');
      expect(result.pz).toBe(5.4);
      expect(result.vbp).toBe(13.5);
      expect(result.vba).toBe(30.0);
      expect(result.vbz).toBe(43.5);
      expect(result.voz).toBe(43.5);
    });
  });
`;

if (!content.includes('12. DEFAULT OCCUPANCY BEHAVIOR')) {
  content = content.replace(/}\);\s*$/, "");
  content += occupancyTests + "\n});";
  fs.writeFileSync(filePath, content);
}
