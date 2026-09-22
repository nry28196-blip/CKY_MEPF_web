import { describe, it, expect } from 'vitest';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';
import { DataProvenanceValidationService } from '../../calculations/ventilation/DataProvenanceValidationService';
import { Table61CrossCheckService } from '../../calculations/ventilation/Table61CrossCheckService';
import {
  STANDARD_BASELINE,
  APPLICABLE_ADDENDA,
  ACTIVE_REFERENCE_BASIS,
  SourceType
} from '../../data/ventilation/ashrae621/types';

describe('ASHRAE 62.1-2022 Table 6-1 Comprehensive Audit & Regression Suite', () => {
  const spaceTypes2022 = StandardDataProvider.get621SpaceTypes('2022');
  const ez2022Default = StandardDataProvider.getProduction621EzValues().find(e => e.id === 'ez-1')!;

  describe('1. Reference Basis Lock', () => {
    it('locks standard baseline to ASHRAE 62.1-2022', () => {
      expect(STANDARD_BASELINE).toBe('ASHRAE 62.1-2022');
    });

    it('identifies Addendum j as active addenda', () => {
      expect(APPLICABLE_ADDENDA).toEqual(['j']);
    });

    it('locks active reference basis string', () => {
      expect(ACTIVE_REFERENCE_BASIS).toBe('ASHRAE 62.1-2022 + Addendum j');
    });

    it('verifies dataset completeness status is COMPLETE for 2022', () => {
      expect(StandardDataProvider.get621DatasetStatus('2022')).toBe('COMPLETE');
    });
  });

  describe('2. Occupancy Categories and Groups Completeness', () => {
    it('contains exactly 78 distinct Table 6-1 occupancy categories', () => {
      expect(spaceTypes2022.length).toBe(78);
      const uniqueIds = new Set(spaceTypes2022.map(s => s.id));
      expect(uniqueIds.size).toBe(78);
    });

    it('contains all 11 standard occupancy groups with correct counts', () => {
      const countsByGroup: Record<string, number> = {};
      spaceTypes2022.forEach(s => {
        const group = s.occupancyGroup || s.category;
        countsByGroup[group] = (countsByGroup[group] || 0) + 1;
      });

      expect(countsByGroup['Correctional Facilities']).toBe(4);
      expect(countsByGroup['Dry Cleaning and Laundry']).toBe(5);
      expect(countsByGroup['Educational Facilities']).toBe(12);
      expect(countsByGroup['Food and Beverage Service']).toBe(4);
      expect(countsByGroup['General']).toBe(2);
      expect(countsByGroup['Hotels, Motels, Resorts, and Dormitories']).toBe(6);
      expect(countsByGroup['Office Buildings']).toBe(9);
      expect(countsByGroup['Miscellaneous Spaces']).toBe(13);
      expect(countsByGroup['Public Assembly Spaces']).toBe(8);
      expect(countsByGroup['Retail']).toBe(6);
      expect(countsByGroup['Sports and Entertainment']).toBe(9);
    });
  });

  describe('3. Space Type Field Integrity', () => {
    it('ensures every record satisfies Table 6-1 numerical and classification constraints', () => {
      spaceTypes2022.forEach(space => {
        // ID & Names
        expect(space.id).toBeTruthy();
        expect(space.name).toBeTruthy();
        expect(space.standard).toBe('ASHRAE 62.1');
        expect(space.edition).toBe('2022');

        // Rp constraint: > 0 or explicitly NOT_APPLICABLE
        if (space.isRpNotApplicable) {
          expect(space.rpMetric).toBe(0);
          expect(space.rpStatus).toBe('NOT_APPLICABLE');
        } else {
          expect(space.rpMetric).toBeGreaterThan(0);
          expect(space.rpStatus).toBe('APPLICABLE');
        }

        // Ra constraint: > 0 or explicitly NOT_APPLICABLE
        if (space.isRaNotApplicable) {
          expect(space.raMetric).toBe(0);
          expect(space.raStatus).toBe('NOT_APPLICABLE');
        } else {
          expect(space.raMetric).toBeGreaterThan(0);
          expect(space.raStatus).toBe('APPLICABLE');
        }

        // Default density constraint: >= 0
        if (space.isDensityNotApplicable) {
          expect(space.defaultOccupancyMetric).toBe(0);
          expect(space.densityStatus).toBe('NOT_APPLICABLE');
        } else {
          expect(space.defaultOccupancyMetric).toBeGreaterThan(0);
          expect(space.densityStatus).toBe('APPLICABLE');
        }

        // Air Class constraint: strictly 1, 2, 3, or 4
        expect([1, 2, 3, 4]).toContain(space.airClass);

        // Verification and SourceType
        expect(space.verificationStatus).toBe('VERIFIED');
        expect(space.sourceType).toBe(SourceType.ASHRAE_PUBLISHED);
        expect(space.revisionState.source).toBe(SourceType.ASHRAE_PUBLISHED);
        expect(space.verificationDate).toBe('2026-09-22');
      });
    });

    it('ensures all 78 records pass DataProvenanceValidationService', () => {
      spaceTypes2022.forEach(space => {
        const val = DataProvenanceValidationService.validateSpaceTypeData(
          space,
          'ASHRAE 62.1',
          '2022',
          'ASHRAE 62.1-2022 + Addendum j'
        );
        expect(val.valid).toBe(true);
        expect(val.status).toBe('PASS');
        expect(val.reasons).toEqual([]);
      });
    });
  });

  describe('4. Golden Regression of the 5 Original Records', () => {
    it('office: produces identical ventilation calculation (Voz = 42.5 L/s for 100m2, 5 occ)', () => {
      const office = spaceTypes2022.find(s => s.id === 'office')!;
      expect(office).toBeDefined();
      expect(office.rpMetric).toBe(2.5);
      expect(office.raMetric).toBe(0.3);
      expect(office.defaultOccupancyMetric).toBe(5);
      expect(office.airClass).toBe(1);

      const res = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        spaceType: office,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: ez2022Default
      });
      expect(res.status).toBe('PASS');
      expect(res.voz).toBe(42.5);
    });

    it('conference: produces identical ventilation calculation (Voz = 155.0 L/s for 100m2, 50 occ)', () => {
      const conf = spaceTypes2022.find(s => s.id === 'conference')!;
      expect(conf).toBeDefined();
      expect(conf.rpMetric).toBe(2.5);
      expect(conf.raMetric).toBe(0.3);
      expect(conf.defaultOccupancyMetric).toBe(50);
      expect(conf.airClass).toBe(1);

      const res = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        spaceType: conf,
        area: 100,
        designOccupancy: 50,
        useDefaultOccupancy: false,
        ezConfig: ez2022Default
      });
      expect(res.status).toBe('PASS');
      expect(res.voz).toBe(155.0);
    });

    it('retail: produces identical ventilation calculation (Voz = 117.0 L/s for 100m2, 15 occ)', () => {
      const retail = spaceTypes2022.find(s => s.id === 'retail')!;
      expect(retail).toBeDefined();
      expect(retail.rpMetric).toBe(3.8);
      expect(retail.raMetric).toBe(0.6);
      expect(retail.defaultOccupancyMetric).toBe(15);
      expect(retail.airClass).toBe(2);

      const res = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        spaceType: retail,
        area: 100,
        designOccupancy: 15,
        useDefaultOccupancy: false,
        ezConfig: ez2022Default
      });
      expect(res.status).toBe('PASS');
      expect(res.voz).toBe(117.0);
    });

    it('classroom: produces identical ventilation calculation (Voz = 235.0 L/s for 100m2, 35 occ)', () => {
      const classroom = spaceTypes2022.find(s => s.id === 'classroom')!;
      expect(classroom).toBeDefined();
      expect(classroom.rpMetric).toBe(5.0);
      expect(classroom.raMetric).toBe(0.6);
      expect(classroom.defaultOccupancyMetric).toBe(35);
      expect(classroom.airClass).toBe(1);

      const res = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        spaceType: classroom,
        area: 100,
        designOccupancy: 35,
        useDefaultOccupancy: false,
        ezConfig: ez2022Default
      });
      expect(res.status).toBe('PASS');
      expect(res.voz).toBe(235.0);
    });

    it('corridor: produces identical ventilation calculation (Voz = 30.0 L/s for 100m2, 0 occ)', () => {
      const corridor = spaceTypes2022.find(s => s.id === 'corridor')!;
      expect(corridor).toBeDefined();
      expect(corridor.rpMetric).toBe(0);
      expect(corridor.isRpNotApplicable).toBe(true);
      expect(corridor.raMetric).toBe(0.3);
      expect(corridor.defaultOccupancyMetric).toBe(0);
      expect(corridor.isDensityNotApplicable).toBe(true);
      expect(corridor.airClass).toBe(1);

      const res = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        spaceType: corridor,
        area: 100,
        designOccupancy: 0,
        useDefaultOccupancy: false,
        ezConfig: ez2022Default
      });
      expect(res.status).toBe('PASS');
      expect(res.voz).toBe(30.0);
    });
  });

  describe('5. Version Control, Pipeline Isolation, and Addenda Integrity', () => {
    it('blocks unverified 2025 space types from entering the 2022 calculation pipeline', () => {
      const spaces2025 = StandardDataProvider.get621SpaceTypes('2025');
      const office2025 = spaces2025.find(s => s.id === 'office')!;

      const res = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        spaceType: office2025,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: ez2022Default
      });

      expect(res.status).toBe('BLOCKED');
      expect(res.reason).toContain('Calculation blocked');
    });

    it('blocks space types with mismatching reference basis', () => {
      const fakeSpace = {
        ...spaceTypes2022[0],
        referenceBasis: 'ASHRAE 62.1-2025'
      };

      const val = DataProvenanceValidationService.validateSpaceTypeData(
        fakeSpace,
        'ASHRAE 62.1',
        '2022',
        'ASHRAE 62.1-2022 + Addendum j'
      );
      expect(val.valid).toBe(false);
      expect(val.reasons).toContain('Reference Basis Mismatch');
    });
  });

  describe('6. Numerical Cross-Checks', () => {
    it('executes full dataset cross-checks with zero unexpected discrepancies', () => {
      const report = Table61CrossCheckService.auditEntireDataset(spaceTypes2022);
      expect(report.totalRecords).toBe(78);
      expect(report.completenessStatus).toBe('COMPLETE');
      expect(report.occupancyGroupsCount).toBe(11);
      expect(report.discrepanciesCount).toBe(0);
    });

    it('validates single record cross-check detail for office space', () => {
      const office = spaceTypes2022.find(s => s.id === 'office')!;
      const checkResult = Table61CrossCheckService.crossCheckRecord(office);
      expect(checkResult.hasDiscrepancies).toBe(false);
      expect(checkResult.checks.length).toBe(3); // Rp, Ra, Density

      const rpCheck = checkResult.checks.find(c => c.parameter === 'Rp')!;
      expect(rpCheck.publishedIp).toBe(5);
      expect(rpCheck.publishedSi).toBe(2.5);
      expect(rpCheck.calculatedSi).toBeCloseTo(2.36, 1);

      const raCheck = checkResult.checks.find(c => c.parameter === 'Ra')!;
      expect(raCheck.publishedIp).toBe(0.06);
      expect(raCheck.publishedSi).toBe(0.3);

      const densityCheck = checkResult.checks.find(c => c.parameter === 'OccupantDensity')!;
      expect(densityCheck.publishedIp).toBe(5);
      expect(densityCheck.publishedSi).toBe(5);
    });
  });

  describe('7. ashraeTable61.ts Interface and Functionality', () => {
    it('provides TABLE_6_1_RECORDS with full 78 records and Table61Record interface', async () => {
      const { TABLE_6_1_RECORDS, TABLE_6_1_BY_ID, getTable61RecordById, getTable61RecordsByGroup, getAllTable61Groups, TABLE_6_1_METADATA } = await import('../../data/ashraeTable61');
      expect(TABLE_6_1_RECORDS.length).toBe(78);
      expect(Object.keys(TABLE_6_1_BY_ID).length).toBe(78);
      expect(TABLE_6_1_METADATA.completenessStatus).toBe('COMPLETE');

      const officeRec = getTable61RecordById('office');
      expect(officeRec).toBeDefined();
      expect(officeRec?.occupancyCategory).toBe('Office space');
      expect(officeRec?.occupancyGroup).toBe('Office Buildings');
      expect(officeRec?.rpMetric).toBe(2.5);
      expect(officeRec?.rpIp).toBe(5);
      expect(officeRec?.raMetric).toBe(0.3);
      expect(officeRec?.raIp).toBe(0.06);
      expect(officeRec?.defaultOccupancyMetric).toBe(5);
      expect(officeRec?.defaultOccupancyIp).toBe(5);
      expect(officeRec?.airClass).toBe(1);
      expect(officeRec?.versionMetadata.referenceBasis).toBe('ASHRAE 62.1-2022 + Addendum j');
      expect(officeRec?.versionMetadata.verificationStatus).toBe('VERIFIED');
      expect(officeRec?.provenance).toBeDefined();

      const officeGroupRecords = getTable61RecordsByGroup('Office Buildings');
      expect(officeGroupRecords.length).toBe(9);

      const allGroups = getAllTable61Groups();
      expect(allGroups.length).toBe(11);
    });
  });
});

