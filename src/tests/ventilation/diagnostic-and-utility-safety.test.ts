import { describe, it, expect } from 'vitest';
import { AirBalanceService, AirBalanceInput, SystemBalanceInput } from '../../calculations/ventilation/AirBalanceService';
import { SystemPerformanceService, SystemPerformanceInput } from '../../calculations/ventilation/SystemPerformanceService';
import { VentilationValidator as ThermalSanityValidator } from '../../validation/VentilationValidator';
import { VentilationValidator as DiagnosticAdvisoryValidator } from '../../calculations/validation/VentilationValidator';

describe('VENTILATION ENGINEERING DIAGNOSTIC & UTILITY SAFETY GATES', () => {
  describe('AirBalanceService Safety & Constraint Lifecycle', () => {
    it('returns INCOMPLETE with null numeric outputs when required room inputs are missing', () => {
      const input: AirBalanceInput = {
        qSupply: null,
        qExhaust: 100,
        qReturn: 50,
        qTransferIn: 0
      };
      const result = AirBalanceService.calculateRoomBalance(input);
      expect(result.status).toBe('INCOMPLETE');
      expect(result.qNet).toBeNull();
      expect(result.transferOut).toBeNull();
      expect(result.pressureRelationship).toBe('Indeterminate');
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
      expect(result.complianceNotice).toContain('Diagnostic');
    });

    it('returns FAIL with null numeric outputs for non-finite room inputs', () => {
      const input: AirBalanceInput = {
        qSupply: NaN,
        qExhaust: 100,
        qReturn: 50,
        qTransferIn: 0
      };
      const result = AirBalanceService.calculateRoomBalance(input);
      expect(result.status).toBe('FAIL');
      expect(result.qNet).toBeNull();
      expect(result.transferOut).toBeNull();
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
      expect(result.reasons.some(r => r.includes('finite'))).toBe(true);
    });

    it('returns FAIL with null numeric outputs when any room flow is negative', () => {
      const input: AirBalanceInput = {
        qSupply: 500,
        qExhaust: -100,
        qReturn: 400,
        qTransferIn: 0
      };
      const result = AirBalanceService.calculateRoomBalance(input);
      expect(result.status).toBe('FAIL');
      expect(result.qNet).toBeNull();
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
      expect(result.reasons.some(r => r.includes('negative'))).toBe(true);
    });

    it('returns PASS for valid room balance, but explicitly preserves non-authoritative status', () => {
      const input: AirBalanceInput = {
        qSupply: 500,
        qExhaust: 200,
        qReturn: 250,
        qTransferIn: 50
      };
      const result = AirBalanceService.calculateRoomBalance(input);
      expect(result.status).toBe('PASS');
      expect(result.qNet).toBe(100);
      expect(result.pressureRelationship).toBe('Positive');
      expect(result.transferOut).toBe(100);
      // Critical production rule: Non-authoritative diagnostic
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
      expect(result.complianceNotice).toContain('Not an ANSI/ASHRAE Standard 62.1 compliance determination');
      expect(result.auditRecord).toBeDefined();
      expect(result.auditRecord?.system).toBe('Ventilation');
    });

    it('rejects system air balance with INCOMPLETE when inputs are missing', () => {
      const input: SystemBalanceInput = {
        qSupply: 5000,
        qOutdoorAir: null,
        qReturn: 4000,
        qExhaust: 800,
        buildingVolume: 1000,
        isMetric: true
      };
      const result = AirBalanceService.calculateSystemBalance(input);
      expect(result.status).toBe('INCOMPLETE');
      expect(result.qNetBuilding).toBeNull();
      expect(result.qRecirculated).toBeNull();
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
    });

    it('rejects physically contradictory system balance where outdoor air exceeds supply air', () => {
      const input: SystemBalanceInput = {
        qSupply: 1000,
        qOutdoorAir: 1500, // Contradiction: OA > Supply
        qReturn: 500,
        qExhaust: 200,
        buildingVolume: 1000,
        isMetric: true
      };
      const result = AirBalanceService.calculateSystemBalance(input);
      expect(result.status).toBe('FAIL');
      expect(result.qNetBuilding).toBeNull();
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
      expect(result.reasons.some(r => r.includes('Physical contradiction'))).toBe(true);
    });

    it('rejects physically contradictory system balance where recirculated air exceeds return air', () => {
      const input: SystemBalanceInput = {
        qSupply: 5000,
        qOutdoorAir: 1000, // Recirculated required = 4000
        qReturn: 3000,     // Only 3000 available return -> Contradiction!
        qExhaust: 500,
        buildingVolume: 1000,
        isMetric: true
      };
      const result = AirBalanceService.calculateSystemBalance(input);
      expect(result.status).toBe('FAIL');
      expect(result.qNetBuilding).toBeNull();
      expect(result.isAuthoritative).toBe(false);
      expect(result.reasons.some(r => r.includes('Required recirculated air exceeds available return air'))).toBe(true);
    });

    it('rejects zero or negative building volume with FAIL', () => {
      const input: SystemBalanceInput = {
        qSupply: 5000,
        qOutdoorAir: 1000,
        qReturn: 4500,
        qExhaust: 500,
        buildingVolume: 0,
        isMetric: true
      };
      const result = AirBalanceService.calculateSystemBalance(input);
      expect(result.status).toBe('FAIL');
      expect(result.qNetBuilding).toBeNull();
      expect(result.reasons.some(r => r.includes('Building volume must be strictly greater than zero'))).toBe(true);
    });

    it('computes valid system balance with PASS and audit provenance, retaining non-authoritative flag', () => {
      const input: SystemBalanceInput = {
        qSupply: 5000,
        qOutdoorAir: 1500,
        qReturn: 4000,
        qExhaust: 1000,
        buildingVolume: 1500,
        isMetric: true
      };
      const result = AirBalanceService.calculateSystemBalance(input);
      expect(result.status).toBe('PASS');
      expect(result.qRecirculated).toBe(3500); // 5000 - 1500
      expect(result.qRelief).toBe(500);        // 4000 - 3500
      expect(result.totalExhaustAndRelief).toBe(1500); // 1000 + 500
      expect(result.qNetBuilding).toBe(0);      // 1500 - 1500
      expect(result.buildingPressure).toBe('Neutral');
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
      expect(result.auditRecord).toBeDefined();
    });
  });

  describe('SystemPerformanceService Safety & Aerodynamic Rigor', () => {
    const validMetricInput: SystemPerformanceInput = {
      qOutdoorAir: 500,
      qReturnAir: 1500,
      densityRatio: 1.0,
      criticalDuctLength: 40,
      ductFrictionRate: 1.2,
      fittingLosses: 100,
      equipmentPressureDrop: 250,
      fanEfficiency: 0.65,
      motorEfficiency: 0.85,
      isMetric: true
    };

    it('rejects missing inputs with INCOMPLETE and null outputs', () => {
      const result = SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        qReturnAir: null
      });
      expect(result.status).toBe('INCOMPLETE');
      expect(result.qSupplyStandard).toBeNull();
      expect(result.qSupplyActual).toBeNull();
      expect(result.totalStaticPressure).toBeNull();
      expect(result.fanBrakeHorsepower).toBeNull();
      expect(result.motorElectricalPower).toBeNull();
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
    });

    it('NEVER silently substitutes density ratio <= 0, failing explicitly', () => {
      const resultZero = SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        densityRatio: 0
      });
      expect(resultZero.status).toBe('FAIL');
      expect(resultZero.qSupplyActual).toBeNull();
      expect(resultZero.reasons.some(r => r.includes('density ratio') || r.includes('Air density ratio'))).toBe(true);

      const resultNegative = SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        densityRatio: -0.5
      });
      expect(resultNegative.status).toBe('FAIL');
      expect(resultNegative.qSupplyActual).toBeNull();
    });

    it('rejects zero or negative fan/motor efficiency with FAIL', () => {
      const resultZeroEff = SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        fanEfficiency: 0
      });
      expect(resultZeroEff.status).toBe('FAIL');
      expect(resultZeroEff.fanBrakeHorsepower).toBeNull();

      const resultOverEff = SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        motorEfficiency: 1.5 // > 1.0 and < 5% -> rejected
      });
      expect(resultOverEff.status).toBe('FAIL');
      expect(resultOverEff.motorElectricalPower).toBeNull();

      const resultOver100Pct = SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        motorEfficiency: 105 // > 100% -> rejected
      });
      expect(resultOver100Pct.status).toBe('FAIL');
      expect(resultOver100Pct.motorElectricalPower).toBeNull();
    });

    it('rejects negative duct lengths, friction, fitting losses, or equipment drops', () => {
      expect(SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        criticalDuctLength: -10
      }).status).toBe('FAIL');

      expect(SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        ductFrictionRate: -0.5
      }).status).toBe('FAIL');

      expect(SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        fittingLosses: -20
      }).status).toBe('FAIL');

      expect(SystemPerformanceService.calculateFanPerformance({
        ...validMetricInput,
        equipmentPressureDrop: -50
      }).status).toBe('FAIL');
    });

    it('calculates valid metric fan and aerodynamic duty point with PASS, preserving non-authoritative flag', () => {
      const result = SystemPerformanceService.calculateFanPerformance(validMetricInput);
      expect(result.status).toBe('PASS');
      expect(result.qSupplyStandard).toBe(2000);
      expect(result.qSupplyActual).toBe(2000); // 2000 / 1.0
      // Friction = 40 m * 1.2 Pa/m = 48 Pa. Total = 48 + 100 + 250 = 398 Pa.
      expect(result.totalStaticPressure).toBeCloseTo(398, 1);
      // Fan kW = (2000 * 398) / (1_000_000 * 0.65) = 1.2246 kW
      expect(result.fanBrakeHorsepower).toBeCloseTo(1.2246, 2);
      // Motor kW = 1.2246 / 0.85 = 1.4407 kW
      expect(result.motorElectricalPower).toBeCloseTo(1.4407, 2);
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
      expect(result.auditRecord).toBeDefined();
    });

    it('calculates valid Imperial fan duty point with correct BHP and motor kW', () => {
      const imperialInput: SystemPerformanceInput = {
        qOutdoorAir: 1000,
        qReturnAir: 3000,
        densityRatio: 0.95,
        criticalDuctLength: 150,
        ductFrictionRate: 0.1, // 0.1 in.wg/100ft -> 0.15 in.wg
        fittingLosses: 0.5,
        equipmentPressureDrop: 1.0,
        fanEfficiency: 70, // 70%
        motorEfficiency: 90, // 90%
        isMetric: false
      };
      const result = SystemPerformanceService.calculateFanPerformance(imperialInput);
      expect(result.status).toBe('PASS');
      expect(result.qSupplyStandard).toBe(4000);
      expect(result.qSupplyActual).toBeCloseTo(4000 / 0.95, 1);
      // Static pressure = (150/100)*0.1 + 0.5 + 1.0 = 1.65 in.wg
      expect(result.totalStaticPressure).toBeCloseTo(1.65, 2);
      expect(result.fanBrakeHorsepower).toBeGreaterThan(0);
      expect(result.motorElectricalPower).toBeGreaterThan(0);
      expect(result.isAuthoritative).toBe(false);
      expect(result.isApprovedForEngineeringUse).toBe(false);
    });
  });

  describe('Harmonized Validators Architecture & Non-Authority Protection', () => {
    it('proves ThermalSanityValidator (src/validation) is quarantined and non-authoritative', () => {
      const validParams = {
        area: 100,
        volume: 300,
        occupants: 10,
        ventilationLps: 50,
        outdoorTemp: 32,
        indoorTemp: 22
      };
      const res = ThermalSanityValidator.validate(validParams);
      expect(res.status).toBe('PASS');
      // Crucial: Must NEVER claim authoritative status
      expect(res.isAuthoritative).toBe(false);
    });

    it('proves ThermalSanityValidator returns INCOMPLETE or FAIL on invalid inputs and remains non-authoritative', () => {
      const incomplete = ThermalSanityValidator.validate({
        area: '',
        volume: 300,
        occupants: 10,
        ventilationLps: 50,
        outdoorTemp: 32,
        indoorTemp: 22
      });
      expect(incomplete.status).toBe('INCOMPLETE');
      expect(incomplete.isAuthoritative).toBe(false);

      const fail = ThermalSanityValidator.validate({
        area: -10,
        volume: 300,
        occupants: 10,
        ventilationLps: 50,
        outdoorTemp: 32,
        indoorTemp: 22
      });
      expect(fail.status).toBe('FAIL');
      expect(fail.isAuthoritative).toBe(false);
    });

    it('proves DiagnosticAdvisoryValidator (src/calculations/validation) flags physical violations and low Ev', () => {
      const zoneMessages = DiagnosticAdvisoryValidator.validateZone({
        spaceType: 'Office',
        area: 0, // Area <= 0 -> Z-01
        occupants: 5,
        voz: 500,
        vpz: 200, // Voz > Vpz -> Z-02
        zp: 0.8
      } as any);

      expect(zoneMessages.some(m => m.code === 'Z-01' && m.severity === 'error')).toBe(true);
      expect(zoneMessages.some(m => m.code === 'Z-02' && m.severity === 'error')).toBe(true);

      const sysMessages = DiagnosticAdvisoryValidator.validateSystem({
        airDistributionType: 'VAV',
        vps: 0,
        vou: 500,
        ev: 0.3
      } as any);

      expect(sysMessages.some(m => m.code === 'S-00' && m.severity === 'error')).toBe(true);
      expect(sysMessages.some(m => m.code === 'S-02' && m.severity === 'warning')).toBe(true);
    });
  });
});
