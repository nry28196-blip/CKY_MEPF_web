import fs from 'fs';

const filePath = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(filePath, 'utf8');

const auditTests = `
  describe('10. AUDIT TRAIL TESTS', () => {
    it('A. Vbz audit item status === DERIVED', () => {
      const office = createSyntheticVerifiedFixture(officeSpace);
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticVerifiedEz
      });
      const vbzItem = result.auditTrail.find(item => item.symbol === 'Vbz');
      expect(vbzItem).toBeDefined();
      expect(vbzItem?.status).toBe('DERIVED');
    });

    it('B. Voz audit item status === DERIVED', () => {
      const office = createSyntheticVerifiedFixture(officeSpace);
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticVerifiedEz
      });
      const vozItem = result.auditTrail.find(item => item.symbol === 'Voz');
      expect(vozItem).toBeDefined();
      expect(vozItem?.status).toBe('DERIVED');
    });

    it('C. Unverified production calculation returns BLOCKED', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: officeSpace, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ezCeiling
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('D. Blocked calculations contain no engineering outputs that could be mistaken for valid results', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: officeSpace, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ezCeiling
      });
      expect(result.status).toBe('BLOCKED');
      expect(result.vbz).toBeNull();
      expect(result.voz).toBeNull();
      expect(result.vbp).toBeNull();
      expect(result.vba).toBeNull();
    });

    it('E. Verified synthetic fixture produces PASS', () => {
      const office = createSyntheticVerifiedFixture(officeSpace);
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticVerifiedEz
      });
      expect(result.status).toBe('PASS');
    });

    it('F. No audit item is labeled VERIFIED', () => {
      const office = createSyntheticVerifiedFixture(officeSpace);
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticVerifiedEz
      });
      result.auditTrail.forEach(item => {
        expect(item.status).not.toBe('VERIFIED');
      });
    });

    it('G. No source field contains verification status values', () => {
      const office = createSyntheticVerifiedFixture(officeSpace);
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: syntheticVerifiedEz
      });
      
      const checkSource = (source: string) => {
        expect(source).not.toBe('VERIFIED');
        expect(source).not.toBe('NOT_VERIFIED');
        expect(source).not.toBe('INVALID');
        expect(source).not.toBe('PASS');
        expect(source).not.toBe('FAIL');
        expect(source).not.toBe('BLOCKED');
      };
      
      checkSource(office.sourceType);
      checkSource(office.revisionState.source);
      checkSource(syntheticVerifiedEz.sourceType);
      checkSource(syntheticVerifiedEz.revisionState.source);
    });
  });
`;

if (!content.includes('10. AUDIT TRAIL TESTS')) {
  content = content.replace(/}\);\s*$/, "");
  content += auditTests + "\n});";
  fs.writeFileSync(filePath, content);
}
