import { describe, it, expect, vi } from 'vitest';
import { VentilationEngine, SingleZoneInput, MultiZoneInput } from '../../lib/VentilationEngine';
import { Ashrae621ZoneService } from '../../calculations/ventilation/Ashrae621ZoneService';
import { Ashrae621ExhaustService } from '../../calculations/ventilation/Ashrae621ExhaustService';
import { ProductionScopeService, normalizeAddendumIdentifier } from '../../calculations/scope/ProductionCalculationScope';
import { EngineeringAuditService } from '../../calculations/audit/EngineeringAuditContract';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

describe('Audit Integrity Fail-Closed & Addendum Normalization Verification', () => {
  const spaceTypes2022 = StandardDataProvider.get621SpaceTypes('2022');
  const ezValues2022 = StandardDataProvider.get621EzValues('2022');
  const exhaustRates2022 = StandardDataProvider.get621ExhaustRates('2022');

  const officeSpace = spaceTypes2022.find(s => s.id === 'office_space' || s.id === 'office')!;
  const ezCooling = ezValues2022.find(e => e.id === 'ez-1')!;
  const copyExhaust = exhaustRates2022.find(e => e.id === 'copy_room')!;

  // =========================================================================
  // 1. FAIL-CLOSED AUDIT GENERATION REGRESSION TESTS
  // =========================================================================
  describe('1. Fail-Closed Audit Generation', () => {
    it('forces audit generation to throw in single-zone and verifies result is FAIL, authoritative output is null, isAuthoritative=false, isApprovedForEngineeringUse=false', () => {
      const spy = vi.spyOn(EngineeringAuditService, 'fromZoneCalculation').mockImplementation(() => {
        throw new Error('Simulated intentional audit generation corruption');
      });

      try {
        const input: SingleZoneInput = {
          edition: '2022',
          density: { elevation: 0, temperature: 20 },
          zone: {
            expectedStandard: 'ASHRAE 62.1',
            expectedEdition: '2022',
            spaceType: officeSpace,
            area: 100,
            designOccupancy: 5,
            useDefaultOccupancy: false,
            ezConfig: ezCooling
          }
        };

        const result = VentilationEngine.runSingleZone(input);

        // FAIL-CLOSED VERIFICATION:
        expect(result.status).toBe('FAIL');
        expect(result.voz).toBeNull();
        expect(result.vot).toBeNull();
        expect(result.finalDesignOutdoorAir).toBeNull();
        expect(result.isAuthoritative).toBe(false);
        expect(result.isApprovedForEngineeringUse).toBe(false);
        expect(result.zone.status).toBe('FAIL');
        expect(result.auditRecord).toBeUndefined();
      } finally {
        spy.mockRestore();
      }
    });

    it('forces audit generation to throw in multi-zone simplified procedure and verifies fail-closed behavior', () => {
      const spy = vi.spyOn(EngineeringAuditService, 'fromSimplifiedSystem').mockImplementation(() => {
        throw new Error('Simulated multi-zone audit generation breakdown');
      });

      try {
        const input: MultiZoneInput = {
          method: 'Simplified',
          edition: '2022',
          systemType: 'single_supply',
          airDistributionType: 'CV',
          density: { elevation: 0, temperature: 20 },
          zones: [
            {
              id: 'z1',
              expectedStandard: 'ASHRAE 62.1',
              expectedEdition: '2022',
              spaceType: officeSpace,
              area: 100,
              designOccupancy: 5,
              useDefaultOccupancy: false,
              ezConfig: ezCooling
            },
            {
              id: 'z2',
              expectedStandard: 'ASHRAE 62.1',
              expectedEdition: '2022',
              spaceType: officeSpace,
              area: 200,
              designOccupancy: 10,
              useDefaultOccupancy: false,
              ezConfig: ezCooling
            }
          ],
          systemPopulation: 15
        };

        const result = VentilationEngine.runMultiZone(input);

        // FAIL-CLOSED VERIFICATION:
        expect(result.status).toBe('FAIL');
        expect(result.vot).toBeNull();
        expect(result.vou).toBeNull();
        expect(result.finalDesignOutdoorAir).toBeNull();
        expect(result.isAuthoritative).toBe(false);
        expect(result.isApprovedForEngineeringUse).toBe(false);
        expect(result.auditRecord).toBeUndefined();
      } finally {
        spy.mockRestore();
      }
    });

    it('forces audit generation to throw in multi-zone alternative procedure and verifies fail-closed behavior', () => {
      const spy = vi.spyOn(EngineeringAuditService, 'fromAlternativeSystem').mockImplementation(() => {
        throw new Error('Simulated alternative procedure audit failure');
      });

      try {
        const input: MultiZoneInput = {
          method: 'Alternative',
          edition: '2022',
          systemType: 'single_supply',
          airDistributionType: 'CV',
          vps: 1500,
          density: { elevation: 0, temperature: 20 },
          zones: [
            {
              id: 'z1',
              expectedStandard: 'ASHRAE 62.1',
              expectedEdition: '2022',
              spaceType: officeSpace,
              area: 100,
              designOccupancy: 5,
              useDefaultOccupancy: false,
              ezConfig: ezCooling,
              vpz: 500
            },
            {
              id: 'z2',
              expectedStandard: 'ASHRAE 62.1',
              expectedEdition: '2022',
              spaceType: officeSpace,
              area: 200,
              designOccupancy: 10,
              useDefaultOccupancy: false,
              ezConfig: ezCooling,
              vpz: 1000
            }
          ],
          systemPopulation: 15
        };

        const result = VentilationEngine.runMultiZone(input);

        // FAIL-CLOSED VERIFICATION:
        expect(result.status).toBe('FAIL');
        expect(result.vot).toBeNull();
        expect(result.vou).toBeNull();
        expect(result.finalDesignOutdoorAir).toBeNull();
        expect(result.isAuthoritative).toBe(false);
        expect(result.isApprovedForEngineeringUse).toBe(false);
        expect(result.auditRecord).toBeUndefined();
      } finally {
        spy.mockRestore();
      }
    });

    it('produces authoritative PASS when audit generation succeeds normally', () => {
      const input: SingleZoneInput = {
        edition: '2022',
        density: { elevation: 0, temperature: 20 },
        zone: {
          expectedStandard: 'ASHRAE 62.1',
          expectedEdition: '2022',
          spaceType: officeSpace,
          area: 100,
          designOccupancy: 5,
          useDefaultOccupancy: false,
          ezConfig: ezCooling
        }
      };

      const result = VentilationEngine.runSingleZone(input);

      expect(result.status).toBe('PASS');
      expect(result.finalDesignOutdoorAir).toBeGreaterThan(0);
      expect(result.isAuthoritative).toBe(true);
      expect(result.isApprovedForEngineeringUse).toBe(true);
      expect(result.auditRecord).toBeDefined();
      expect(result.auditRecord?.finalResult.isAuthoritative).toBe(true);
      expect(result.auditRecord?.isApprovedForEngineeringUse).toBe(true);
    });
  });

  // =========================================================================
  // 2. ADDENDUM IDENTIFIER NORMALIZATION TESTS
  // =========================================================================
  describe('2. Addendum Identifier Normalization Helper', () => {
    it('normalizes various casing and prefix formats of Addendum j to "j"', () => {
      expect(normalizeAddendumIdentifier('j')).toBe('j');
      expect(normalizeAddendumIdentifier('J')).toBe('j');
      expect(normalizeAddendumIdentifier('Addendum j')).toBe('j');
      expect(normalizeAddendumIdentifier('addendum j')).toBe('j');
      expect(normalizeAddendumIdentifier(' addendum J ')).toBe('j');
      expect(normalizeAddendumIdentifier('ADDENDUM J')).toBe('j');
      expect(normalizeAddendumIdentifier('addendum-j')).toBe('j');
      expect(normalizeAddendumIdentifier('Addenda j')).toBe('j');
    });

    it('normalizes various casing and prefix formats of Addendum x to "x"', () => {
      expect(normalizeAddendumIdentifier('x')).toBe('x');
      expect(normalizeAddendumIdentifier('X')).toBe('x');
      expect(normalizeAddendumIdentifier('Addendum x')).toBe('x');
      expect(normalizeAddendumIdentifier('addendum x')).toBe('x');
      expect(normalizeAddendumIdentifier(' addendum X ')).toBe('x');
      expect(normalizeAddendumIdentifier('ADDENDUM X')).toBe('x');
    });

    it('handles empty or non-string inputs safely', () => {
      expect(normalizeAddendumIdentifier('')).toBe('');
      expect(normalizeAddendumIdentifier(null)).toBe('');
      expect(normalizeAddendumIdentifier(undefined)).toBe('');
    });
  });

  // =========================================================================
  // 3. PRODUCTION ADDENDUM VALIDATION
  // =========================================================================
  describe('3. Production Addendum Validation in Scope and Services', () => {
    it('ProductionScopeService accepts equivalent representations of Addendum j and Addendum x', () => {
      expect(ProductionScopeService.isAddendumAllowed('j')).toBe(true);
      expect(ProductionScopeService.isAddendumAllowed('J')).toBe(true);
      expect(ProductionScopeService.isAddendumAllowed('Addendum j')).toBe(true);
      expect(ProductionScopeService.isAddendumAllowed('addendum j')).toBe(true);
      expect(ProductionScopeService.isAddendumAllowed('ADDENDUM J')).toBe(true);

      expect(ProductionScopeService.isAddendumAllowed('x')).toBe(true);
      expect(ProductionScopeService.isAddendumAllowed('X')).toBe(true);
      expect(ProductionScopeService.isAddendumAllowed('Addendum x')).toBe(true);
      expect(ProductionScopeService.isAddendumAllowed('addendum x')).toBe(true);

      expect(ProductionScopeService.validateAddendum('Addendum j').allowed).toBe(true);
      expect(ProductionScopeService.validateAddendum('j').allowed).toBe(true);
      expect(ProductionScopeService.validateAddendum('X').allowed).toBe(true);
    });

    it('ProductionScopeService rejects unapproved addenda safely', () => {
      expect(ProductionScopeService.isAddendumAllowed('a')).toBe(false);
      expect(ProductionScopeService.isAddendumAllowed('Addendum c')).toBe(false);
      expect(ProductionScopeService.isAddendumAllowed('Addendum 2025')).toBe(false);

      const unapprovedVal = ProductionScopeService.validateAddendum('Addendum a');
      expect(unapprovedVal.allowed).toBe(false);
      expect(unapprovedVal.status).toBe('BLOCKED');
    });

    it('Ashrae621ZoneService accepts all valid representations of Addendum j', () => {
      const representations = ['j', 'J', 'Addendum j', 'addendum j', 'ADDENDUM J'];

      for (const rep of representations) {
        const result = Ashrae621ZoneService.calculateZone({
          expectedStandard: 'ASHRAE 62.1',
          expectedEdition: '2022',
          expectedAddenda: [rep],
          spaceType: officeSpace,
          area: 100,
          designOccupancy: 5,
          useDefaultOccupancy: false,
          ezConfig: ezCooling
        });

        expect(result.status).toBe('PASS');
        expect(result.voz).toBeGreaterThan(0);
      }
    });

    it('Ashrae621ZoneService blocks unapproved addenda', () => {
      const result = Ashrae621ZoneService.calculateZone({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        expectedAddenda: ['Addendum a'],
        spaceType: officeSpace,
        area: 100,
        designOccupancy: 5,
        useDefaultOccupancy: false,
        ezConfig: ezCooling
      });

      expect(result.status).toBe('BLOCKED');
      expect(result.voz).toBeNull();
      expect(result.reason).toContain('Unapproved addenda requested');
    });

    it('Ashrae621ExhaustService accepts all valid representations of Addendum x', () => {
      const representations = ['x', 'X', 'Addendum x', 'addendum x', 'ADDENDUM X'];

      for (const rep of representations) {
        const result = Ashrae621ExhaustService.calculate({
          expectedStandard: 'ASHRAE 62.1',
          expectedEdition: '2022',
          expectedAddenda: [rep],
          exhaustType: copyExhaust,
          qty: 50,
          designExhaust: 200
        });

        expect(result.status).toBe('PASS');
        expect(result.requiredExhaust).toBe(125);
      }
    });

    it('Ashrae621ExhaustService blocks unapproved addenda', () => {
      const result = Ashrae621ExhaustService.calculate({
        expectedStandard: 'ASHRAE 62.1',
        expectedEdition: '2022',
        expectedAddenda: ['Addendum b'],
        exhaustType: copyExhaust,
        qty: 50,
        designExhaust: 100
      });

      expect(result.status).toBe('BLOCKED');
      expect(result.requiredExhaust).toBeNull();
      expect(result.complianceNotes?.some(n => n.includes('Unapproved exhaust addenda'))).toBe(true);
    });
  });
});
