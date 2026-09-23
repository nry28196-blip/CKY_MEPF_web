/**
 * Ashrae621Table63Service
 * 
 * Evaluation and Air Class safety service for ASHRAE 62.1-2022 Table 6-3 "Airstreams or Sources".
 * 
 * Core Principles:
 * 1. Table 6-3 provides required Air Class classification for listed airstreams/sources.
 * 2. Table 6-3 is NOT a second numeric exhaust-rate table. It never invents numeric exhaust rates.
 * 3. Rate = NOT_APPLICABLE, quantity = NOT_APPLICABLE, requiredExhaust = NOT_APPLICABLE.
 * 4. Never generates PASS merely from Table 6-3 classification.
 * 5. Strict Air Class Safety: Silently downgrading Air Class (e.g. Class 4 -> Class 3/2/1) is strictly BLOCKED.
 *    Any engineering override requires explicit professional justification and responsible EHS sign-off.
 * 6. 2025 isolation guard: Non-2022 requests are BLOCKED.
 */

import { Ashrae621Table63Source, Ashrae621ExhaustType } from '../../data/ventilation/ashrae621/types';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

export type Table63EvaluationStatus = 'CLASSIFIED_SPECIAL_REQUIREMENT' | 'BLOCKED' | 'OVERRIDE_WARNING';

export interface Table63ClassificationResult {
  id: string;
  name: string;
  description: string;
  airClass: 1 | 2 | 3 | 4;
  rateStatus: 'NOT_APPLICABLE';
  numericRate: null;
  requiredExhaust: null;
  status: Table63EvaluationStatus;
  standard: string;
  edition: string;
  referenceSection: string;
  referenceTable: string;
  referenceBasis: string;
  specialStandardReference?: string;
  complianceNotes: string[];
}

export interface AirClassValidationInput {
  sourceId: string;
  selectedAirClass: number;
  overrideJustification?: string;
  responsibleEhsProfessional?: string;
  expectedStandard?: string;
  expectedEdition?: string;
}

export interface AirClassValidationResult {
  isValid: boolean;
  status: 'VERIFIED' | 'BLOCKED' | 'OVERRIDE_PERMITTED';
  sourceId: string;
  requiredAirClass: number;
  effectiveAirClass: number;
  isDowngraded: boolean;
  message: string;
  complianceNotes: string[];
}

export class Ashrae621Table63Service {
  /**
   * Retrieve a Table 6-3 source by ID from the production dataset.
   */
  static getSource(id: string): Ashrae621Table63Source | undefined {
    const sources = StandardDataProvider.getProduction621Table63Sources();
    return sources.find(s => s.id === id);
  }

  /**
   * Retrieve all Table 6-3 sources from the production dataset.
   */
  static getAllSources(): Ashrae621Table63Source[] {
    return StandardDataProvider.getProduction621Table63Sources();
  }

  /**
   * Evaluate a Table 6-3 classification.
   * Guarantees:
   * - numericRate is ALWAYS null (never invented)
   * - requiredExhaust is ALWAYS null
   * - status is NEVER 'PASS' (it is CLASSIFIED_SPECIAL_REQUIREMENT or BLOCKED)
   */
  static evaluateSourceClassification(
    sourceId: string,
    options?: { expectedStandard?: string; expectedEdition?: string }
  ): Table63ClassificationResult {
    const expectedStandard = options?.expectedStandard || 'ASHRAE 62.1';
    const expectedEdition = options?.expectedEdition || '2022';

    // 2025 Isolation Guard
    if (expectedEdition === '2025' || expectedEdition !== '2022') {
      return {
        id: sourceId,
        name: 'Unverified / Deferred Source',
        description: 'Edition is not approved for production engineering use.',
        airClass: 4,
        rateStatus: 'NOT_APPLICABLE',
        numericRate: null,
        requiredExhaust: null,
        status: 'BLOCKED',
        standard: expectedStandard,
        edition: expectedEdition,
        referenceSection: '6.5.1',
        referenceTable: 'Table 6-3',
        referenceBasis: 'UNVERIFIED',
        complianceNotes: [
          `BLOCKED: Edition ${expectedEdition} is not active in production. ASHRAE 62.1-2022 is the active baseline.`
        ]
      };
    }

    const source = this.getSource(sourceId);
    if (!source) {
      return {
        id: sourceId,
        name: 'Unknown Source',
        description: 'Source ID is not in Table 6-3.',
        airClass: 4,
        rateStatus: 'NOT_APPLICABLE',
        numericRate: null,
        requiredExhaust: null,
        status: 'BLOCKED',
        standard: 'ASHRAE 62.1',
        edition: '2022',
        referenceSection: '6.5.1',
        referenceTable: 'Table 6-3',
        referenceBasis: 'ASHRAE 62.1-2022 + Addendum x',
        complianceNotes: [
          `BLOCKED: Source '${sourceId}' was not found in ASHRAE 62.1-2022 Table 6-3.`
        ]
      };
    }

    if (source.verificationStatus !== 'VERIFIED') {
      return {
        id: source.id,
        name: source.name,
        description: source.description,
        airClass: source.airClass,
        rateStatus: 'NOT_APPLICABLE',
        numericRate: null,
        requiredExhaust: null,
        status: 'BLOCKED',
        standard: source.standard,
        edition: source.edition,
        referenceSection: source.referenceSection,
        referenceTable: source.referenceTable,
        referenceBasis: source.referenceBasis,
        specialStandardReference: source.specialStandardReference,
        complianceNotes: [
          `BLOCKED: Source '${source.id}' verification status is '${source.verificationStatus}' (must be VERIFIED).`
        ]
      };
    }

    const notes: string[] = [
      `Table 6-3 Air Classification: Air Class ${source.airClass} established per Section 6.5.1, Table 6-3.`,
      `Rate not applicable: Table 6-3 does NOT prescribe numeric airflow rates. Exhaust rate must be designed per governing equipment standards.`
    ];

    if (source.specialStandardReference) {
      notes.push(`Referenced standard: ${source.specialStandardReference}.`);
    }
    if (source.notes) {
      notes.push(source.notes);
    }

    return {
      id: source.id,
      name: source.name,
      description: source.description,
      airClass: source.airClass,
      rateStatus: 'NOT_APPLICABLE',
      numericRate: null,
      requiredExhaust: null,
      status: 'CLASSIFIED_SPECIAL_REQUIREMENT',
      standard: source.standard,
      edition: source.edition,
      referenceSection: source.referenceSection,
      referenceTable: source.referenceTable,
      referenceBasis: source.referenceBasis,
      specialStandardReference: source.specialStandardReference,
      complianceNotes: notes
    };
  }

  /**
   * Air Class Safety Enforcement:
   * Prohibits silent downgrade of required Air Class.
   * If an engineer attempts to enter a lower class than the Table 6-3 requirement,
   * it must require explicit justification and responsible EHS professional sign-off;
   * otherwise it is BLOCKED.
   */
  static validateAirClass(input: AirClassValidationInput): AirClassValidationResult {
    const expectedEdition = input.expectedEdition || '2022';
    if (expectedEdition !== '2022') {
      return {
        isValid: false,
        status: 'BLOCKED',
        sourceId: input.sourceId,
        requiredAirClass: 4,
        effectiveAirClass: input.selectedAirClass,
        isDowngraded: false,
        message: `BLOCKED: Standard edition '${expectedEdition}' is not active in production.`,
        complianceNotes: ['Edition is not approved for production use.']
      };
    }

    const source = this.getSource(input.sourceId);
    if (!source) {
      return {
        isValid: false,
        status: 'BLOCKED',
        sourceId: input.sourceId,
        requiredAirClass: 4,
        effectiveAirClass: input.selectedAirClass,
        isDowngraded: false,
        message: `BLOCKED: Source '${input.sourceId}' is not found in Table 6-3.`,
        complianceNotes: ['Unrecognized Table 6-3 source ID.']
      };
    }

    if (source.verificationStatus !== 'VERIFIED') {
      return {
        isValid: false,
        status: 'BLOCKED',
        sourceId: source.id,
        requiredAirClass: source.airClass,
        effectiveAirClass: input.selectedAirClass,
        isDowngraded: false,
        message: `BLOCKED: Source '${source.id}' verificationStatus is '${source.verificationStatus}'.`,
        complianceNotes: ['Record is not verified against published standard.']
      };
    }

    const requiredClass = source.airClass;
    const proposedClass = input.selectedAirClass;

    // Upgrading to a more restrictive Air Class (e.g., from 3 to 4, or 2 to 3) is always safe
    if (proposedClass >= requiredClass) {
      return {
        isValid: true,
        status: 'VERIFIED',
        sourceId: source.id,
        requiredAirClass: requiredClass,
        effectiveAirClass: proposedClass,
        isDowngraded: false,
        message: `Air Class ${proposedClass} meets or exceeds Table 6-3 minimum required Air Class ${requiredClass}.`,
        complianceNotes: [
          `ASHRAE 62.1-2022 Table 6-3 requires Air Class ${requiredClass}. Selected Air Class ${proposedClass} is compliant.`
        ]
      };
    }

    // Downgrade attempted: proposedClass < requiredClass
    const hasJustification = Boolean(input.overrideJustification && input.overrideJustification.trim().length >= 15);
    const hasEhsSignOff = Boolean(input.responsibleEhsProfessional && input.responsibleEhsProfessional.trim().length >= 3);

    if (!hasJustification || !hasEhsSignOff) {
      const missingDetails: string[] = [];
      if (!hasJustification) missingDetails.push('detailed professional engineering justification (>= 15 chars)');
      if (!hasEhsSignOff) missingDetails.push('responsible EHS / PE professional sign-off name');

      return {
        isValid: false,
        status: 'BLOCKED',
        sourceId: source.id,
        requiredAirClass: requiredClass,
        effectiveAirClass: requiredClass, // Do not silently accept lower class
        isDowngraded: true,
        message: `BLOCKED: Silent downgrade of '${source.name}' from Air Class ${requiredClass} to Air Class ${proposedClass} is strictly rejected. Missing: ${missingDetails.join(' and ')}.`,
        complianceNotes: [
          `AIR CLASS SAFETY VIOLATION: ASHRAE 62.1-2022 Table 6-3 designates '${source.name}' as Air Class ${requiredClass}.`,
          `Downgrading to Class ${proposedClass} is not permitted without explicit professional engineering justification and EHS sign-off.`
        ]
      };
    }

    // Explicit override permitted with required metadata
    return {
      isValid: true,
      status: 'OVERRIDE_PERMITTED',
      sourceId: source.id,
      requiredAirClass: requiredClass,
      effectiveAirClass: proposedClass,
      isDowngraded: true,
      message: `CAUTION: Engineering override permitted for '${source.name}' with documented EHS sign-off. Downgraded from Class ${requiredClass} to Class ${proposedClass}.`,
      complianceNotes: [
        `OVERRIDE: Table 6-3 baseline requires Air Class ${requiredClass}.`,
        `Effective Air Class ${proposedClass} authorized by ${input.responsibleEhsProfessional}.`,
        `Justification: "${input.overrideJustification}".`
      ]
    };
  }

  /**
   * Cross-verification of overlap between Table 6-2 (Prescriptive Rates) and Table 6-3 (Airstream Classifications).
   * Verified overlap records:
   * - 'paint_spray_booths': Table 6-2 rateStatus SPECIAL_REQUIREMENT (OSHA 1910.107 / NFPA 33), Table 6-3 Air Class 4
   * - 'refrigerating_machinery': Table 6-2 rateStatus SPECIAL_REQUIREMENT (ANSI/ASHRAE Standard 15), Table 6-3 Air Class 3
   */
  static verifyTable62OverlapAgreement(table62Record: Ashrae621ExhaustType): {
    hasOverlap: boolean;
    matches: boolean;
    discrepancies: string[];
  } {
    const table63Source = this.getSource(table62Record.id);
    if (!table63Source) {
      return { hasOverlap: false, matches: true, discrepancies: [] };
    }

    const discrepancies: string[] = [];

    // Check Air Class agreement
    if (table62Record.airClass !== table63Source.airClass) {
      discrepancies.push(
        `Air Class conflict: Table 6-2 has Class ${table62Record.airClass}, but Table 6-3 designates Class ${table63Source.airClass}.`
      );
    }

    // Check exhaustClass alias
    if (table62Record.exhaustClass !== table63Source.airClass) {
      discrepancies.push(
        `exhaustClass conflict: Table 6-2 exhaustClass ${table62Record.exhaustClass} does not match Table 6-3 Class ${table63Source.airClass}.`
      );
    }

    // Check special standard alignment where applicable
    if (table62Record.specialStandardReference && table63Source.specialStandardReference) {
      if (table62Record.specialStandardReference !== table63Source.specialStandardReference) {
        discrepancies.push(
          `Special standard reference mismatch: Table 6-2 references '${table62Record.specialStandardReference}', Table 6-3 references '${table63Source.specialStandardReference}'.`
        );
      }
    }

    return {
      hasOverlap: true,
      matches: discrepancies.length === 0,
      discrepancies
    };
  }
}
