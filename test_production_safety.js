import fs from 'fs';

const filePath = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(filePath, 'utf8');

const safetyTests = `
  describe('11. PRODUCTION SAFETY TESTS', () => {
    it('SpaceType BLOCKED when unverified', () => {
      let unverifiedCount = 0;
      for (const spaceType of ASHRAE_621_2025_SPACE_TYPES) {
        if (spaceType.verificationStatus !== 'VERIFIED') {
          unverifiedCount++;
          const result = Ashrae621ZoneService.calculateZone({
            expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
            spaceType: spaceType, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticVerifiedEz
          });
          expect(result.status).not.toBe('PASS');
          expect(result.status).toBe('BLOCKED');
        }
      }
      expect(unverifiedCount).toBeGreaterThan(0);
    });

    it('Ez BLOCKED when unverified', () => {
      const office = createSyntheticVerifiedFixture(officeSpace);
      let unverifiedCount = 0;
      for (const ez of ASHRAE_621_2025_EZ_VALUES) {
        if (ez.verificationStatus !== 'VERIFIED') {
          unverifiedCount++;
          const result = Ashrae621ZoneService.calculateZone({
            expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
            spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
          });
          expect(result.status).not.toBe('PASS');
          expect(result.status).toBe('BLOCKED');
        }
      }
      expect(unverifiedCount).toBeGreaterThan(0);
    });

    it('Both SpaceType and Ez BLOCKED when unverified', () => {
      let checkCount = 0;
      for (const spaceType of ASHRAE_621_2025_SPACE_TYPES) {
        if (spaceType.verificationStatus !== 'VERIFIED') {
          for (const ez of ASHRAE_621_2025_EZ_VALUES) {
            if (ez.verificationStatus !== 'VERIFIED') {
              checkCount++;
              const result = Ashrae621ZoneService.calculateZone({
                expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
                spaceType: spaceType, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
              });
              expect(result.status).not.toBe('PASS');
              expect(result.status).toBe('BLOCKED');
            }
          }
        }
      }
      expect(checkCount).toBeGreaterThan(0);
    });
  });
`;

if (!content.includes('11. PRODUCTION SAFETY TESTS')) {
  content = content.replace(/}\);\s*$/, "");
  content += safetyTests + "\n});";
  fs.writeFileSync(filePath, content);
}
