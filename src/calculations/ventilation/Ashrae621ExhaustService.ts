import { ValidationStatus } from './VentilationValidationService';
import { Ashrae621ExhaustType } from '../../data/ventilation/ashrae621/types';
import { DataProvenanceValidationService } from './DataProvenanceValidationService';

export type ExhaustOperationMode = 'continuous' | 'intermittent';
export type ExhaustUnitSystem = 'metric' | 'ip';

export interface ExhaustInput {
  expectedStandard: string;
  expectedEdition: string;
  exhaustType: Ashrae621ExhaustType | null;
  qty: number | null; // Quantity depending on unitType (e.g., m2, ft2, fixtures, rooms, showerheads)
  designExhaust: number | null; // User's design value in active unitSystem (L/s or cfm)
  operationMode?: ExhaustOperationMode; // 'continuous' (default) or 'intermittent'
  unitSystem?: ExhaustUnitSystem; // 'metric' (default, L/s) or 'ip' (cfm)
  parkingGarageOpenSides50PercentOrMore?: boolean; // Section 6.5.1 Exception 1
}

export interface ExhaustResult {
  requiredExhaust: number | null; // Active unit system (L/s if metric, cfm if ip)
  requiredExhaustMetric: number | null; // L/s
  requiredExhaustIp: number | null; // cfm
  designExhaust: number | null; // Active unit system
  unitType: string;
  exhaustClass: number | null;
  airClass: number | null;
  operationMode: ExhaustOperationMode;
  rateApplied: number | null;
  rateAppliedMetric: number | null;
  rateAppliedIp: number | null;
  status: ValidationStatus;
  isSpecialStandard: boolean;
  specialStandardReference?: string;
  recirculationClassification: string;
  combustionCondition?: string;
  notes?: string;
  exceptions?: string;
  referenceSection: string;
  referenceTable: string;
  complianceNotes: string[];
  parkingGarageOpenSides50PercentOrMore?: boolean;
}

function getRecirculationClassification(airClass: number | null | undefined): string {
  switch (airClass) {
    case 1:
      return 'Air Class 1: Recirculation or transfer permitted to any space.';
    case 2:
      return 'Air Class 2: Recirculation permitted within same space or similar Class 2/3/4 spaces. Recirculation to Class 1 spaces prohibited.';
    case 3:
      return 'Air Class 3: Recirculation permitted only within the room of origin. Transfer air not permitted to other spaces.';
    case 4:
      return 'Air Class 4: No recirculation or transfer permitted. Air must be exhausted directly outdoors.';
    default:
      return 'Air Class unclassified.';
  }
}

export class Ashrae621ExhaustService {
  static calculate(input: ExhaustInput): ExhaustResult {
    const operationMode: ExhaustOperationMode = input.operationMode || 'continuous';
    const unitSystem: ExhaustUnitSystem = input.unitSystem || 'metric';

    // 1. Missing exhaust type check
    if (!input.exhaustType) {
      return {
        requiredExhaust: null,
        requiredExhaustMetric: null,
        requiredExhaustIp: null,
        designExhaust: null,
        unitType: 'unknown',
        exhaustClass: null,
        airClass: null,
        operationMode,
        rateApplied: null,
        rateAppliedMetric: null,
        rateAppliedIp: null,
        status: 'NOT_EVALUATED',
        isSpecialStandard: false,
        recirculationClassification: 'Air Class unclassified.',
        referenceSection: '6.5.1',
        referenceTable: 'Table 6-2',
        complianceNotes: ['No exhaust space type selected.']
      };
    }

    const exhaustType = input.exhaustType;
    const airClass = exhaustType.airClass ?? exhaustType.exhaustClass ?? null;
    const exhaustClass = exhaustType.exhaustClass ?? exhaustType.airClass ?? null;
    const isSpecialStandard = Boolean(
      exhaustType.isSpecialStandard ||
      exhaustType.unitType === 'special' ||
      exhaustType.rateStatus === 'SPECIAL_REQUIREMENT' ||
      exhaustType.rate === null
    );
    const referenceSection = exhaustType.referenceSection || '6.5.1';
    const referenceTable = exhaustType.referenceTable || 'Table 6-2';
    const recirculationClassification = getRecirculationClassification(airClass);

    // Air Class vs Exhaust Class consistency guard
    if (exhaustType.airClass !== undefined && exhaustType.exhaustClass !== undefined && exhaustType.airClass !== exhaustType.exhaustClass) {
      return {
        requiredExhaust: null,
        requiredExhaustMetric: null,
        requiredExhaustIp: null,
        designExhaust: null,
        unitType: exhaustType.unitType,
        exhaustClass,
        airClass,
        operationMode,
        rateApplied: null,
        rateAppliedMetric: null,
        rateAppliedIp: null,
        status: 'BLOCKED',
        isSpecialStandard,
        specialStandardReference: exhaustType.specialStandardReference,
        recirculationClassification,
        referenceSection,
        referenceTable,
        complianceNotes: [`Record invalid: airClass (${exhaustType.airClass}) diverges from exhaustClass (${exhaustType.exhaustClass}).`]
      };
    }

    // 2. Provenance validation
    const provResult = DataProvenanceValidationService.validateExhaustData(
      exhaustType,
      input.expectedStandard,
      input.expectedEdition
    );

    // Blocked result safety
    if (!provResult.valid || provResult.status === 'BLOCKED') {
      const isDesignValid = typeof input.designExhaust === 'number' && Number.isFinite(input.designExhaust) && input.designExhaust >= 0;
      return {
        requiredExhaust: null,
        requiredExhaustMetric: null,
        requiredExhaustIp: null,
        designExhaust: isDesignValid ? input.designExhaust : null,
        unitType: exhaustType.unitType,
        exhaustClass,
        airClass,
        operationMode,
        rateApplied: null,
        rateAppliedMetric: null,
        rateAppliedIp: null,
        status: 'BLOCKED',
        isSpecialStandard,
        specialStandardReference: exhaustType.specialStandardReference,
        recirculationClassification,
        combustionCondition: exhaustType.combustionCondition,
        notes: exhaustType.notes,
        exceptions: exhaustType.exceptions,
        referenceSection,
        referenceTable,
        complianceNotes: [`Exhaust data blocked by provenance validation: ${provResult.reasons.join('; ')}`]
      };
    }

    const complianceNotes: string[] = [];
    if (exhaustType.combustionCondition) {
      complianceNotes.push(`Combustion condition: ${exhaustType.combustionCondition}`);
    }
    if (exhaustType.notes) {
      complianceNotes.push(`Table 6-2 Note: ${exhaustType.notes}`);
    }
    if (exhaustType.exceptions) {
      complianceNotes.push(`Exception: ${exhaustType.exceptions}`);
    }

    // Space-specific authoritative guidance notes
    if (exhaustType.id === 'auto_repair') {
      complianceNotes.push('Direct engine exhaust connection requirement: Where vehicle engine stands or running engines are present, direct source capture connection to vehicle exhaust pipes is required in addition to general room exhaust.');
    }
    if (exhaustType.id === 'kitchen_commercial') {
      complianceNotes.push('Commercial cooking exhaust safety: Prescriptive Table 6-2 rate (3.5 L/s·m², Air Class 2) provides minimum general room exhaust only. Per ASHRAE 62.1-2022 Section 6.5.1.2.3 (Addendum x), kitchen exhaust hoods shall comply with ANSI/ASHRAE Standard 154 (external/local code requirements such as NFPA 96 may apply separately as project requirements).');
    }

    // 3. Quantity validation
    if (input.qty === null || input.qty === undefined || Number.isNaN(input.qty)) {
      const status: ValidationStatus = (typeof input.qty === 'number' && Number.isNaN(input.qty)) ? 'FAIL' : 'INCOMPLETE';
      return {
        requiredExhaust: null,
        requiredExhaustMetric: null,
        requiredExhaustIp: null,
        designExhaust: null,
        unitType: exhaustType.unitType,
        exhaustClass,
        airClass,
        operationMode,
        rateApplied: null,
        rateAppliedMetric: null,
        rateAppliedIp: null,
        status,
        isSpecialStandard,
        specialStandardReference: exhaustType.specialStandardReference,
        recirculationClassification,
        combustionCondition: exhaustType.combustionCondition,
        notes: exhaustType.notes,
        exceptions: exhaustType.exceptions,
        referenceSection,
        referenceTable,
        complianceNotes: [...complianceNotes, 'Quantity input is required.']
      };
    }
    if (typeof input.qty !== 'number' || !Number.isFinite(input.qty) || input.qty < 0) {
      return {
        requiredExhaust: null,
        requiredExhaustMetric: null,
        requiredExhaustIp: null,
        designExhaust: null,
        unitType: exhaustType.unitType,
        exhaustClass,
        airClass,
        operationMode,
        rateApplied: null,
        rateAppliedMetric: null,
        rateAppliedIp: null,
        status: 'FAIL',
        isSpecialStandard,
        specialStandardReference: exhaustType.specialStandardReference,
        recirculationClassification,
        combustionCondition: exhaustType.combustionCondition,
        notes: exhaustType.notes,
        exceptions: exhaustType.exceptions,
        referenceSection,
        referenceTable,
        complianceNotes: [...complianceNotes, 'Quantity must be a non-negative finite number.']
      };
    }

    // 4. Design exhaust validation
    if (input.designExhaust === null || input.designExhaust === undefined) {
      return {
        requiredExhaust: null,
        requiredExhaustMetric: null,
        requiredExhaustIp: null,
        designExhaust: null,
        unitType: exhaustType.unitType,
        exhaustClass,
        airClass,
        operationMode,
        rateApplied: null,
        rateAppliedMetric: null,
        rateAppliedIp: null,
        status: 'INCOMPLETE',
        isSpecialStandard,
        specialStandardReference: exhaustType.specialStandardReference,
        recirculationClassification,
        combustionCondition: exhaustType.combustionCondition,
        notes: exhaustType.notes,
        exceptions: exhaustType.exceptions,
        referenceSection,
        referenceTable,
        complianceNotes: [...complianceNotes, 'Design exhaust airflow is required for evaluation.']
      };
    }
    if (typeof input.designExhaust !== 'number' || !Number.isFinite(input.designExhaust) || input.designExhaust < 0) {
      return {
        requiredExhaust: null,
        requiredExhaustMetric: null,
        requiredExhaustIp: null,
        designExhaust: null,
        unitType: exhaustType.unitType,
        exhaustClass,
        airClass,
        operationMode,
        rateApplied: null,
        rateAppliedMetric: null,
        rateAppliedIp: null,
        status: 'FAIL',
        isSpecialStandard,
        specialStandardReference: exhaustType.specialStandardReference,
        recirculationClassification,
        combustionCondition: exhaustType.combustionCondition,
        notes: exhaustType.notes,
        exceptions: exhaustType.exceptions,
        referenceSection,
        referenceTable,
        complianceNotes: [...complianceNotes, 'Design exhaust airflow must be a non-negative finite number.']
      };
    }

    // 5. Special Standard handling (NFPA 33, ASHRAE 15, etc.) - CRITICAL RESULT SAFETY FIX
    // Table 6-2 row does not provide a numeric prescriptive rate. Calculation MUST NOT return PASS simply because positive design exhaust was entered.
    if (isSpecialStandard || exhaustType.rate === null || exhaustType.rateStatus === 'SPECIAL_REQUIREMENT') {
      const specialRef = exhaustType.specialStandardReference || 'Referenced Standard';
      complianceNotes.push(
        `Numeric prescriptive exhaust rate is not defined by ASHRAE 62.1-2022 Table 6-2. Verify the applicable referenced standard (${specialRef}) before accepting the design airflow.`
      );
      return {
        requiredExhaust: null,
        requiredExhaustMetric: null,
        requiredExhaustIp: null,
        designExhaust: input.designExhaust,
        unitType: exhaustType.unitType,
        exhaustClass,
        airClass,
        operationMode,
        rateApplied: null,
        rateAppliedMetric: null,
        rateAppliedIp: null,
        status: 'BLOCKED',
        isSpecialStandard: true,
        specialStandardReference: specialRef,
        recirculationClassification,
        combustionCondition: exhaustType.combustionCondition,
        notes: exhaustType.notes,
        exceptions: exhaustType.exceptions,
        referenceSection,
        referenceTable,
        complianceNotes
      };
    }

    // 6. Intermittent exhaust eligibility verification
    if (operationMode === 'intermittent') {
      const permitsIntermittent = exhaustType.intermittentRate !== null && exhaustType.intermittentRate !== undefined;
      if (!permitsIntermittent) {
        return {
          requiredExhaust: null,
          requiredExhaustMetric: null,
          requiredExhaustIp: null,
          designExhaust: input.designExhaust,
          unitType: exhaustType.unitType,
          exhaustClass,
          airClass,
          operationMode,
          rateApplied: null,
          rateAppliedMetric: null,
          rateAppliedIp: null,
          status: 'FAIL',
          isSpecialStandard: false,
          recirculationClassification,
          combustionCondition: exhaustType.combustionCondition,
          notes: exhaustType.notes,
          exceptions: exhaustType.exceptions,
          referenceSection,
          referenceTable,
          complianceNotes: [
            ...complianceNotes,
            `Intermittent exhaust is not permitted for "${exhaustType.name}" under ASHRAE 62.1-2022 Table 6-2. Continuous exhaust operation is required.`
          ]
        };
      }
    }

    // 7. Parking Garage Exception 1 handling (Section 6.5.1 Exception 1 / Table 6-2 Note b)
    const isParkingGarage = exhaustType.id === 'parking_garages' || exhaustType.id === 'parking_garage';
    if (isParkingGarage && input.parkingGarageOpenSides50PercentOrMore === true) {
      complianceNotes.push(
        'Naturally ventilated parking garage exception applied: >=50% open area on 2+ sides. Mechanical exhaust is exempt under ASHRAE 62.1-2022 Section 6.5.1 Exception 1.'
      );
      return {
        requiredExhaust: 0,
        requiredExhaustMetric: 0,
        requiredExhaustIp: 0,
        designExhaust: input.designExhaust,
        unitType: exhaustType.unitType,
        exhaustClass,
        airClass,
        operationMode,
        rateApplied: 0,
        rateAppliedMetric: 0,
        rateAppliedIp: 0,
        status: 'PASS',
        isSpecialStandard: false,
        specialStandardReference: exhaustType.specialStandardReference,
        recirculationClassification,
        combustionCondition: exhaustType.combustionCondition,
        notes: exhaustType.notes,
        exceptions: exhaustType.exceptions,
        referenceSection,
        referenceTable,
        complianceNotes,
        parkingGarageOpenSides50PercentOrMore: true
      };
    } else if (isParkingGarage) {
      complianceNotes.push(
        'Enclosed parking garage prescriptive exhaust rate applied: 3.7 L/s·m² (0.75 cfm/ft²). Exception 1 applies if two or more sides have >=50% open wall area.'
      );
    }

    // 8. Rate determination
    let rateMetric: number;
    let rateIp: number;

    if (operationMode === 'intermittent') {
      rateMetric = exhaustType.intermittentRate!;
      rateIp = exhaustType.intermittentRateIp ?? (rateMetric * 2);
    } else {
      rateMetric = exhaustType.continuousRate ?? exhaustType.rate ?? 0;
      rateIp = exhaustType.continuousRateIp ?? exhaustType.rateIp ?? (rateMetric * 0.2);
    }

    let requiredExhaust: number;
    let requiredExhaustMetric: number;
    let requiredExhaustIp: number;
    let rateApplied: number;

    if (unitSystem === 'ip') {
      rateApplied = rateIp;
      requiredExhaust = rateIp * input.qty;
      requiredExhaustIp = requiredExhaust;
      requiredExhaustMetric = rateMetric * input.qty;
    } else {
      rateApplied = rateMetric;
      requiredExhaust = rateMetric * input.qty;
      requiredExhaustMetric = requiredExhaust;
      requiredExhaustIp = rateIp * input.qty;
    }

    // 9. Result status determination
    let status: ValidationStatus = 'PASS';
    if (input.designExhaust < requiredExhaust) {
      status = 'FAIL';
      complianceNotes.push(
        `Design exhaust (${input.designExhaust.toFixed(1)} ${unitSystem === 'ip' ? 'cfm' : 'L/s'}) is less than prescriptive minimum required (${requiredExhaust.toFixed(1)} ${unitSystem === 'ip' ? 'cfm' : 'L/s'}).`
      );
    } else {
      complianceNotes.push(
        `Prescriptive minimum satisfied (${input.designExhaust.toFixed(1)} >= ${requiredExhaust.toFixed(1)} ${unitSystem === 'ip' ? 'cfm' : 'L/s'}).`
      );
    }

    return {
      requiredExhaust,
      requiredExhaustMetric,
      requiredExhaustIp,
      designExhaust: input.designExhaust,
      unitType: exhaustType.unitType,
      exhaustClass,
      airClass,
      operationMode,
      rateApplied,
      rateAppliedMetric: rateMetric,
      rateAppliedIp: rateIp,
      status,
      isSpecialStandard: false,
      specialStandardReference: exhaustType.specialStandardReference,
      recirculationClassification,
      combustionCondition: exhaustType.combustionCondition,
      notes: exhaustType.notes,
      exceptions: exhaustType.exceptions,
      referenceSection,
      referenceTable,
      complianceNotes,
      parkingGarageOpenSides50PercentOrMore: input.parkingGarageOpenSides50PercentOrMore
    };
  }
}
