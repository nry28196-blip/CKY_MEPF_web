const fs = require('fs');

let code = fs.readFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', 'utf8');

const newTests = `
  describe('11B. EXPLICIT REGRESSION TESTS FOR REVISION SOURCE', () => {
    // SpaceType tests
    it('blocks SpaceType with parent ASHRAE_PUBLISHED but revision PUBLIC_REVIEW_DRAFT', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.sourceType = SourceType.ASHRAE_PUBLISHED;
      space.revisionState.source = SourceType.PUBLIC_REVIEW_DRAFT;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks SpaceType with parent ASHRAE_PUBLISHED but revision UNKNOWN', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.sourceType = SourceType.ASHRAE_PUBLISHED;
      space.revisionState.source = SourceType.UNKNOWN;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('passes SpaceType with parent ASHRAE_PUBLISHED and revision ASHRAE_PUBLISHED_ADDENDUM', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.sourceType = SourceType.ASHRAE_PUBLISHED;
      space.revisionState.source = SourceType.ASHRAE_PUBLISHED_ADDENDUM;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('PASS');
    });

    // Ez tests
    it('blocks Ez with parent ASHRAE_PUBLISHED but revision PUBLIC_REVIEW_DRAFT', () => {
      const ez = createSyntheticVerifiedEz('2025');
      ez.sourceType = SourceType.ASHRAE_PUBLISHED;
      ez.revisionState.source = SourceType.PUBLIC_REVIEW_DRAFT;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: createSyntheticVerifiedSpaceType('2025'),
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks Ez with parent ASHRAE_PUBLISHED but revision UNKNOWN', () => {
      const ez = createSyntheticVerifiedEz('2025');
      ez.sourceType = SourceType.ASHRAE_PUBLISHED;
      ez.revisionState.source = SourceType.UNKNOWN;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: createSyntheticVerifiedSpaceType('2025'),
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('passes Ez with parent ASHRAE_PUBLISHED and revision ASHRAE_PUBLISHED_ADDENDUM', () => {
      const ez = createSyntheticVerifiedEz('2025');
      ez.sourceType = SourceType.ASHRAE_PUBLISHED;
      ez.revisionState.source = SourceType.ASHRAE_PUBLISHED_ADDENDUM;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: createSyntheticVerifiedSpaceType('2025'),
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
      });
      expect(result.status).toBe('PASS');
    });
    
    // Exhaust tests
    it('blocks Exhaust with parent ASHRAE_PUBLISHED but revision PUBLIC_REVIEW_DRAFT', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.sourceType = SourceType.ASHRAE_PUBLISHED;
      ex.revisionState.source = SourceType.PUBLIC_REVIEW_DRAFT;
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 10, designExhaust: 9999
      });
      expect(result.status).toBe('BLOCKED');
    });
  });

  describe('11C. REVISION-DATE REGRESSION TESTS', () => {
    // SpaceType tests
    it('blocks SpaceType with missing revisionState.verificationDate', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.revisionState.verificationDate = undefined;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks SpaceType with invalid revisionState.verificationDate format', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.revisionState.verificationDate = '2025';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks SpaceType with invalid revisionState.verificationDate calendar date', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.revisionState.verificationDate = '2025-99-99';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('passes SpaceType with valid revisionState.verificationDate', () => {
      const space = createSyntheticVerifiedSpaceType('2025');
      space.revisionState.verificationDate = '2025-01-01';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: space,
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: createSyntheticVerifiedEz('2025')
      });
      expect(result.status).toBe('PASS');
    });

    // Ez tests
    it('blocks Ez with missing revisionState.verificationDate', () => {
      const ez = createSyntheticVerifiedEz('2025');
      ez.revisionState.verificationDate = undefined;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: createSyntheticVerifiedSpaceType('2025'),
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('blocks Ez with invalid revisionState.verificationDate calendar date', () => {
      const ez = createSyntheticVerifiedEz('2025');
      ez.revisionState.verificationDate = '2025-99-99';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: createSyntheticVerifiedSpaceType('2025'),
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('passes Ez with valid revisionState.verificationDate', () => {
      const ez = createSyntheticVerifiedEz('2025');
      ez.revisionState.verificationDate = '2025-01-01';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', spaceType: createSyntheticVerifiedSpaceType('2025'),
        area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: ez
      });
      expect(result.status).toBe('PASS');
    });
    
    // Exhaust tests
    it('blocks Exhaust with missing revisionState.verificationDate', () => {
      const ex = createSyntheticVerifiedExhaust('2025');
      ex.revisionState.verificationDate = undefined;
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025', exhaustType: ex,
        qty: 10, designExhaust: 9999
      });
      expect(result.status).toBe('BLOCKED');
    });
  });

  describe('12. MATHEMATICAL SYNTHETIC TESTS (VERIFIED FIXTURES ONLY)', () =>`;

code = code.replace("  describe('12. MATHEMATICAL SYNTHETIC TESTS (VERIFIED FIXTURES ONLY)', () =>", newTests);
fs.writeFileSync('src/tests/ventilation/ashrae-621-production-safety.test.ts', code);
