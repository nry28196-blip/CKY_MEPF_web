/**
 * ASHRAE 62.1-2022 TABLE 6-3 AIRSTREAMS OR SOURCES INDEPENDENT AUDIT SUITE
 * Standard: ANSI/ASHRAE Standard 62.1-2022 Section 6.5.1 and Table 6-3
 * Reference Basis: ANSI/ASHRAE Standard 62.1-2022 + Addendum x
 * 
 * Tests independent verification, corruption detection, Air Class safety,
 * Table 6-2 / Table 6-3 overlap, and 2025 isolation.
 */

import { describe, it, expect } from 'vitest';
import {
  AUTHORITATIVE_TABLE_6_3,
  AUTHORITATIVE_TABLE_6_3_COUNT,
  AUTHORITATIVE_TABLE_6_3_REFERENCE_BASIS,
  AuthoritativeTable63Record
} from '../../data/ventilation/ashrae621/2022/authoritativeTable63';
import { ASHRAE_621_2022_TABLE_6_3_SOURCES } from '../../data/ventilation/ashrae621/2022/table63Data';
import { Ashrae621Table63CrossCheckService } from '../../calculations/ventilation/Ashrae621Table63CrossCheckService';
import { Ashrae621Table63Service } from '../../calculations/ventilation/Ashrae621Table63Service';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';
import { Ashrae621Table63Source, SourceType } from '../../data/ventilation/ashrae621/types';

describe('ASHRAE 62.1-2022 Table 6-3 Independent Audit Suite', () => {

  // Helper to deep-clone production data for negative corruption tests
  const cloneProduction = (): Ashrae621Table63Source[] => {
    return JSON.parse(JSON.stringify(ASHRAE_621_2022_TABLE_6_3_SOURCES));
  };

  // =========================================================================
  // 1. BASELINE AUDIT AND PRODUCTION / AUTHORITATIVE CROSS-CHECK
  // =========================================================================
  describe('1. Production vs Authoritative Fixture Audit', () => {
    it('A. Authoritative fixture contains exactly 7 records', () => {
      expect(AUTHORITATIVE_TABLE_6_3.length).toBe(7);
      expect(AUTHORITATIVE_TABLE_6_3_COUNT).toBe(7);
    });

    it('B. Production dataset contains exactly 7 records', () => {
      const prod = StandardDataProvider.getProduction621Table63Sources();
      expect(prod.length).toBe(7);
    });

    it('C. Independent audit reports 0 discrepancies across all audited fields', () => {
      const report = Ashrae621Table63CrossCheckService.auditDataset();
      expect(report.totalExpectedRecords).toBe(7);
      expect(report.totalActualRecords).toBe(7);
      expect(report.missingRecords).toHaveLength(0);
      expect(report.extraRecords).toHaveLength(0);
      expect(report.duplicateRecords).toHaveLength(0);
      expect(report.discrepancies).toHaveLength(0);
      expect(report.discrepanciesCount).toBe(0);
      expect(report.completenessStatus).toBe('COMPLETE');
      expect(report.isCompliant).toBe(true);
      expect(report.recordsVerified).toBe(7);
      expect(report.referenceBasis).toBe(AUTHORITATIVE_TABLE_6_3_REFERENCE_BASIS);
    });

    it('D. Architectural separation: Production and Authoritative datasets are independent object instances', () => {
      expect(ASHRAE_621_2022_TABLE_6_3_SOURCES).not.toBe(AUTHORITATIVE_TABLE_6_3);
      for (let i = 0; i < 7; i++) {
        expect(ASHRAE_621_2022_TABLE_6_3_SOURCES[i]).not.toBe(AUTHORITATIVE_TABLE_6_3[i]);
      }
    });
  });

  // =========================================================================
  // 2. NEGATIVE AUDIT TESTS (DELIBERATE CORRUPTIONS)
  // =========================================================================
  describe('2. Negative Audit Corruption Tests', () => {
    it('Negative Test 1: Air Class corruption (Class 4 -> Class 3) is detected', () => {
      const corrupted = cloneProduction();
      const hood = corrupted.find(s => s.id === 'kitchen_grease_hoods')!;
      hood.airClass = 3 as any;

      const report = Ashrae621Table63CrossCheckService.auditDataset(corrupted);
      expect(report.isCompliant).toBe(false);
      expect(report.discrepanciesCount).toBeGreaterThan(0);
      const airClassDisc = report.discrepancies.find(d => d.id === 'kitchen_grease_hoods' && d.field === 'airClass');
      expect(airClassDisc).toBeDefined();
      expect(airClassDisc?.expectedValue).toBe(4);
      expect(airClassDisc?.actualValue).toBe(3);
    });

    it('Negative Test 2: Removing one source is detected as missing record and SUBSET', () => {
      const corrupted = cloneProduction().filter(s => s.id !== 'laboratory_hoods');

      const report = Ashrae621Table63CrossCheckService.auditDataset(corrupted);
      expect(report.isCompliant).toBe(false);
      expect(report.missingRecords).toContain('laboratory_hoods');
      expect(report.completenessStatus).toBe('SUBSET');
    });

    it('Negative Test 3: Adding an unrecognized fake source is detected as extra record and INCOMPLETE', () => {
      const corrupted = cloneProduction();
      corrupted.push({
        id: 'residential_bathroom_exhaust',
        name: 'Residential Bathroom Exhaust',
        description: 'Fake Table 6-3 record',
        airClass: 2,
        standard: 'ASHRAE 62.1',
        edition: '2022',
        reference: 'Section 6.5.1, Table 6-3',
        referenceSection: '6.5.1',
        referenceTable: 'Table 6-3',
        referenceBasis: 'ASHRAE 62.1-2022 + Addendum x',
        sourceType: SourceType.ASHRAE_PUBLISHED,
        verificationStatus: 'VERIFIED',
        verificationDate: '2026-09-22',
        applicableAddenda: ['Addendum x']
      });

      const report = Ashrae621Table63CrossCheckService.auditDataset(corrupted);
      expect(report.isCompliant).toBe(false);
      expect(report.extraRecords).toContain('residential_bathroom_exhaust');
      expect(report.completenessStatus).toBe('INCOMPLETE');
    });

    it('Negative Test 4: Duplicate source ID is detected', () => {
      const corrupted = cloneProduction();
      corrupted.push({ ...corrupted[0] });

      const report = Ashrae621Table63CrossCheckService.auditDataset(corrupted);
      expect(report.isCompliant).toBe(false);
      expect(report.duplicateRecords).toContain(corrupted[0].id);
    });

    it('Negative Test 5: Corrupt edition (2022 -> 2025) is detected', () => {
      const corrupted = cloneProduction();
      corrupted[0].edition = '2025';

      const report = Ashrae621Table63CrossCheckService.auditDataset(corrupted);
      expect(report.isCompliant).toBe(false);
      const editionDisc = report.discrepancies.find(d => d.id === corrupted[0].id && d.field === 'edition');
      expect(editionDisc).toBeDefined();
      expect(editionDisc?.actualValue).toBe('2025');
    });

    it('Negative Test 6: Corrupt reference table (Table 6-3 -> Table 6-2) is detected', () => {
      const corrupted = cloneProduction();
      corrupted[1].referenceTable = 'Table 6-2';

      const report = Ashrae621Table63CrossCheckService.auditDataset(corrupted);
      expect(report.isCompliant).toBe(false);
      const tableDisc = report.discrepancies.find(d => d.id === corrupted[1].id && d.field === 'referenceTable');
      expect(tableDisc).toBeDefined();
      expect(tableDisc?.actualValue).toBe('Table 6-2');
    });

    it('Negative Test 7: Corrupt verificationStatus (VERIFIED -> NOT_VERIFIED) is detected', () => {
      const corrupted = cloneProduction();
      corrupted[2].verificationStatus = 'NOT_VERIFIED';

      const report = Ashrae621Table63CrossCheckService.auditDataset(corrupted);
      expect(report.isCompliant).toBe(false);
      const verDisc = report.discrepancies.find(d => d.id === corrupted[2].id && d.field === 'verificationStatus');
      expect(verDisc).toBeDefined();
      expect(verDisc?.actualValue).toBe('NOT_VERIFIED');
    });

    it('Negative Test 8: Corrupt source name is detected', () => {
      const corrupted = cloneProduction();
      corrupted[3].name = 'Corrupted Elevator Room Name';

      const report = Ashrae621Table63CrossCheckService.auditDataset(corrupted);
      expect(report.isCompliant).toBe(false);
      const nameDisc = report.discrepancies.find(d => d.id === corrupted[3].id && d.field === 'name');
      expect(nameDisc).toBeDefined();
    });

    it('Negative Test 9: Corrupt referenceBasis is detected', () => {
      const corrupted = cloneProduction();
      corrupted[4].referenceBasis = 'Unverified Draft Basis';

      const report = Ashrae621Table63CrossCheckService.auditDataset(corrupted);
      expect(report.isCompliant).toBe(false);
      const basisDisc = report.discrepancies.find(d => d.id === corrupted[4].id && d.field === 'referenceBasis');
      expect(basisDisc).toBeDefined();
    });
  });

  // =========================================================================
  // 3. EXACT AIR CLASS VERIFICATION FOR ALL 7 TABLE 6-3 SOURCES
  // =========================================================================
  describe('3. Exact Air Class Requirements per Table 6-3', () => {
    const sources = StandardDataProvider.getProduction621Table63Sources();
    const map = new Map(sources.map(s => [s.id, s]));

    it('1. Kitchen grease hoods: Air Class = 4', () => {
      const src = map.get('kitchen_grease_hoods')!;
      expect(src).toBeDefined();
      expect(src.name).toBe('Kitchen grease hoods');
      expect(src.airClass).toBe(4);
      expect(src.specialStandardReference).toContain('Standard 154');
    });

    it('2. Kitchen hoods other than grease hoods: Air Class = 3', () => {
      const src = map.get('kitchen_hoods_non_grease')!;
      expect(src).toBeDefined();
      expect(src.name).toBe('Kitchen hoods other than grease hoods');
      expect(src.airClass).toBe(3);
      expect(src.specialStandardReference).toContain('Standard 154');
    });

    it('3. Diazo printing equipment discharge: Air Class = 4', () => {
      const src = map.get('diazo_printing_discharge')!;
      expect(src).toBeDefined();
      expect(src.name).toBe('Diazo printing equipment discharge');
      expect(src.airClass).toBe(4);
    });

    it('4. Hydraulic elevator machine room: Air Class = 2', () => {
      const src = map.get('hydraulic_elevator_machine_room')!;
      expect(src).toBeDefined();
      expect(src.name).toBe('Hydraulic elevator machine room');
      expect(src.airClass).toBe(2);
    });

    it('5. Laboratory hoods: Air Class = 4', () => {
      const src = map.get('laboratory_hoods')!;
      expect(src).toBeDefined();
      expect(src.name).toBe('Laboratory hoods');
      expect(src.airClass).toBe(4);
      expect(src.specialStandardReference).toContain('Z9.5');
    });

    it('6. Paint spray booths: Air Class = 4', () => {
      const src = map.get('paint_spray_booths')!;
      expect(src).toBeDefined();
      expect(src.name).toBe('Paint spray booths');
      expect(src.airClass).toBe(4);
      expect(src.specialStandardReference).toContain('OSHA 1910.107');
    });

    it('7. Refrigerating machinery rooms: Air Class = 3', () => {
      const src = map.get('refrigerating_machinery')!;
      expect(src).toBeDefined();
      expect(src.name).toBe('Refrigerating machinery rooms');
      expect(src.airClass).toBe(3);
      expect(src.specialStandardReference).toContain('Standard 15');
    });
  });

  // =========================================================================
  // 4. AIR CLASS SAFETY & DOWNGRADE ENFORCEMENT
  // =========================================================================
  describe('4. Air Class Safety & Downgrade Prevention', () => {
    it('Disallows silent downgrade: Kitchen grease hoods from Class 4 to Class 3 is BLOCKED', () => {
      const result = Ashrae621Table63Service.validateAirClass({
        sourceId: 'kitchen_grease_hoods',
        selectedAirClass: 3
      });
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('BLOCKED');
      expect(result.isDowngraded).toBe(true);
      expect(result.effectiveAirClass).toBe(4); // Does not adopt lower class
      expect(result.message).toContain('Silent downgrade');
    });

    it('Disallows silent downgrade: Laboratory hoods from Class 4 to Class 1 is BLOCKED', () => {
      const result = Ashrae621Table63Service.validateAirClass({
        sourceId: 'laboratory_hoods',
        selectedAirClass: 1
      });
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('BLOCKED');
      expect(result.effectiveAirClass).toBe(4);
    });

    it('Disallows silent downgrade: Refrigerating machinery from Class 3 to Class 2 without justification is BLOCKED', () => {
      const result = Ashrae621Table63Service.validateAirClass({
        sourceId: 'refrigerating_machinery',
        selectedAirClass: 2
      });
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('BLOCKED');
    });

    it('Allows engineering override ONLY when explicit professional justification and EHS sign-off are provided', () => {
      const result = Ashrae621Table63Service.validateAirClass({
        sourceId: 'kitchen_hoods_non_grease',
        selectedAirClass: 2,
        overrideJustification: 'Low-temperature closed sous-vide equipment with separate steam condensation module per mechanical design specs',
        responsibleEhsProfessional: 'Jane Doe, PE / CIH'
      });
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('OVERRIDE_PERMITTED');
      expect(result.isDowngraded).toBe(true);
      expect(result.effectiveAirClass).toBe(2);
      expect(result.message).toContain('Engineering override permitted');
      expect(result.complianceNotes.some(n => n.includes('Jane Doe, PE / CIH'))).toBe(true);
    });

    it('Upgrading to a more restrictive Air Class is always permitted and VERIFIED', () => {
      const result = Ashrae621Table63Service.validateAirClass({
        sourceId: 'hydraulic_elevator_machine_room',
        selectedAirClass: 3 // Source requires 2, engineer chooses 3
      });
      expect(result.isValid).toBe(true);
      expect(result.status).toBe('VERIFIED');
      expect(result.isDowngraded).toBe(false);
      expect(result.effectiveAirClass).toBe(3);
    });
  });

  // =========================================================================
  // 5. NO-NUMERIC-RATE & CLASSIFICATION-ONLY SAFETY ENFORCEMENT
  // =========================================================================
  describe('5. Table 6-3 Does Not Invent Numeric Exhaust Rates', () => {
    it('All 7 sources produce numericRate = null, requiredExhaust = null, and rateStatus = NOT_APPLICABLE', () => {
      const sources = StandardDataProvider.getProduction621Table63Sources();
      sources.forEach(src => {
        const evalResult = Ashrae621Table63Service.evaluateSourceClassification(src.id);
        expect(evalResult.numericRate).toBeNull();
        expect(evalResult.requiredExhaust).toBeNull();
        expect(evalResult.rateStatus).toBe('NOT_APPLICABLE');
        expect(evalResult.status).not.toBe('PASS');
        expect(evalResult.status).toBe('CLASSIFIED_SPECIAL_REQUIREMENT');
        expect(evalResult.referenceTable).toBe('Table 6-3');
        expect(evalResult.referenceSection).toBe('6.5.1');
        expect(evalResult.complianceNotes.some(n => n.includes('Table 6-3 does NOT prescribe numeric airflow rates'))).toBe(true);
      });
    });
  });

  // =========================================================================
  // 6. TABLE 6-2 AND TABLE 6-3 OVERLAP AGREEMENT
  // =========================================================================
  describe('6. Table 6-2 / Table 6-3 Overlap Agreement', () => {
    const table62Rates = StandardDataProvider.getProduction621ExhaustRates();

    it('Paint spray booths: Table 6-2 and Table 6-3 agree on Air Class 4 and special standard OSHA 1910.107 / NFPA 33', () => {
      const t62 = table62Rates.find(r => r.id === 'paint_spray_booths')!;
      expect(t62).toBeDefined();
      expect(t62.airClass).toBe(4);
      expect(t62.exhaustClass).toBe(4);
      expect(t62.rateStatus).toBe('SPECIAL_REQUIREMENT');
      expect(t62.rate).toBeNull();

      const overlapCheck = Ashrae621Table63Service.verifyTable62OverlapAgreement(t62);
      expect(overlapCheck.hasOverlap).toBe(true);
      expect(overlapCheck.matches).toBe(true);
      expect(overlapCheck.discrepancies).toHaveLength(0);
    });

    it('Refrigerating machinery rooms: Table 6-2 and Table 6-3 agree on Air Class 3 and ANSI/ASHRAE Standard 15', () => {
      const t62 = table62Rates.find(r => r.id === 'refrigerating_machinery')!;
      expect(t62).toBeDefined();
      expect(t62.airClass).toBe(3);
      expect(t62.exhaustClass).toBe(3);
      expect(t62.rateStatus).toBe('SPECIAL_REQUIREMENT');
      expect(t62.rate).toBeNull();

      const overlapCheck = Ashrae621Table63Service.verifyTable62OverlapAgreement(t62);
      expect(overlapCheck.hasOverlap).toBe(true);
      expect(overlapCheck.matches).toBe(true);
      expect(overlapCheck.discrepancies).toHaveLength(0);
    });

    it('Non-overlapping Table 6-2 categories return hasOverlap = false with no conflicts', () => {
      const t62Restroom = table62Rates.find(r => r.id === 'toilet_public')!;
      const overlapCheck = Ashrae621Table63Service.verifyTable62OverlapAgreement(t62Restroom);
      expect(overlapCheck.hasOverlap).toBe(false);
      expect(overlapCheck.matches).toBe(true);
    });
  });

  // =========================================================================
  // 7. 2025 ISOLATION-GUARD TESTS
  // =========================================================================
  describe('7. 2025 Isolation-Guard Tests', () => {
    it('2025 isolation guard: evaluateSourceClassification rejects 2025 as BLOCKED', () => {
      const result = Ashrae621Table63Service.evaluateSourceClassification('kitchen_grease_hoods', {
        expectedEdition: '2025'
      });
      expect(result.status).toBe('BLOCKED');
      expect(result.complianceNotes.some(n => n.includes('Edition 2025 is not active in production'))).toBe(true);
    });

    it('2025 isolation guard: validateAirClass rejects 2025 as BLOCKED', () => {
      const result = Ashrae621Table63Service.validateAirClass({
        sourceId: 'kitchen_grease_hoods',
        selectedAirClass: 4,
        expectedEdition: '2025'
      });
      expect(result.isValid).toBe(false);
      expect(result.status).toBe('BLOCKED');
    });

    it('2025 isolation guard: StandardDataProvider.get621Table63Sources("2025") throws error', () => {
      expect(() => {
        StandardDataProvider.get621Table63Sources('2025');
      }).toThrow('INVALID_STANDARD_EDITION');
    });
  });

  // =========================================================================
  // 8. NOT_VERIFIED SAFETY TEST
  // =========================================================================
  describe('8. NOT_VERIFIED Safety Guard', () => {
    it('Unverified Table 6-3 record is BLOCKED by evaluateSourceClassification', () => {
      const prod = cloneProduction();
      prod[0].verificationStatus = 'NOT_VERIFIED';

      // Temporarily simulate corrupted source retrieval
      const origGetSource = Ashrae621Table63Service.getSource;
      (Ashrae621Table63Service as any).getSource = (id: string) => {
        if (id === prod[0].id) return prod[0];
        return origGetSource.call(Ashrae621Table63Service, id);
      };

      try {
        const evalRes = Ashrae621Table63Service.evaluateSourceClassification(prod[0].id);
        expect(evalRes.status).toBe('BLOCKED');
        expect(evalRes.complianceNotes.some(n => n.includes('must be VERIFIED'))).toBe(true);

        const valRes = Ashrae621Table63Service.validateAirClass({
          sourceId: prod[0].id,
          selectedAirClass: 4
        });
        expect(valRes.status).toBe('BLOCKED');
      } finally {
        (Ashrae621Table63Service as any).getSource = origGetSource;
      }
    });
  });
});
