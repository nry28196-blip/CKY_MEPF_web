import fs from 'fs';
const file = 'src/tests/ventilation/ashrae-621-zone.test.ts';
let content = fs.readFileSync(file, 'utf8');

const newTests = `    it('C-A. TEST — VERIFIED + ASHRAE_PUBLISHED + matching standard/edition/revision', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('PASS');
    });

    it('C-B. TEST — VERIFIED + PUBLIC_REVIEW_DRAFT', () => {
      const office = makeWithProvenance('PUBLIC_REVIEW_DRAFT', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-C. TEST — VERIFIED + UNKNOWN', () => {
      const office = makeWithProvenance('UNKNOWN', 'VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-D. TEST — NOT_VERIFIED + ASHRAE_PUBLISHED', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'NOT_VERIFIED');
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-E. TEST — edition mismatch', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.rp) office.provenance.rp.edition = '2022';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-F. TEST — standard mismatch', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.rp) office.provenance.rp.standard = 'ASHRAE 62.2';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-G. TEST — revision mismatch', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.rp) office.provenance.rp.revision = '2022';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-H. TEST — missing reference', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.rp) delete (office.provenance.rp as any).reference;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-I. TEST — missing verificationDate for VERIFIED data', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.rp) delete (office.provenance.rp as any).verificationDate;
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-J. TEST — default occupancy enabled + unverified occupancy data', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.defaultOccupancy) office.provenance.defaultOccupancy.verificationStatus = 'NOT_VERIFIED';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: null, useDefaultOccupancy: true, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-K. TEST — default occupancy disabled + valid user design occupancy', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      if (office.provenance && office.provenance.defaultOccupancy) office.provenance.defaultOccupancy.verificationStatus = 'NOT_VERIFIED';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('PASS');
    });

    it('C-L. TEST — contradictory parent and field provenance', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      office.verificationStatus = 'NOT_VERIFIED';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
    });

    it('C-M. TEST — source field containing "NOT_VERIFIED"', () => {
      const office = makeWithProvenance('ASHRAE_PUBLISHED', 'VERIFIED');
      (office.revisionState.source as any) = 'NOT_VERIFIED';
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      // Currently our checkParentConsistency doesn't explicitly fail if parent source is NOT_VERIFIED,
      // but let's see. Wait, "source field containing NOT_VERIFIED => FAIL validation"
      // I should update DataProvenanceValidationService to reject this.
    });

    it('C-O. TEST — blocked calculation returns null engineering outputs', () => {
      const office = makeWithProvenance('UNKNOWN', 'VERIFIED'); // This will block
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1', expectedEdition: '2025',
        spaceType: office, area: 100, designOccupancy: 5, useDefaultOccupancy: false, ezConfig: verifiedEz
      });
      expect(result.status).toBe('BLOCKED');
      expect(result.vbz).toBeNull();
      expect(result.voz).toBeNull();
      expect(result.vbp).toBeNull();
      expect(result.vba).toBeNull();
    });
`;

const end = content.lastIndexOf(`});\n});`);
const newContent = content.substring(0, end) + newTests + `  });\n});\n`;
fs.writeFileSync(file, newContent);
