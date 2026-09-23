/**
 * Ashrae621Table63CrossCheckService
 * 
 * Independent audit and cross-check service for ASHRAE 62.1-2022 Table 6-3 "Airstreams or Sources".
 * Compares production Table 6-3 dataset against the independent reference fixture AUTHORITATIVE_TABLE_6_3.
 * 
 * Strict architectural rule:
 * - Authoritative fixture does NOT import production data.
 * - Production dataset does NOT import authoritative fixture.
 * - This service acts as the independent verification layer.
 */

import { Ashrae621Table63Source } from '../../data/ventilation/ashrae621/types';
import {
  AUTHORITATIVE_TABLE_6_3,
  AUTHORITATIVE_TABLE_6_3_COUNT,
  AUTHORITATIVE_TABLE_6_3_REFERENCE_BASIS,
  AuthoritativeTable63Record
} from '../../data/ventilation/ashrae621/2022/authoritativeTable63';
import { StandardDataProvider } from '../../data/ventilation/StandardDataProvider';

export interface Table63Discrepancy {
  id: string;
  name: string;
  field: string;
  expectedValue: any;
  actualValue: any;
  severity: 'ERROR' | 'WARNING';
  description: string;
}

export interface Table63AuditReport {
  referenceBasis: string;
  standard: string;
  edition: string;
  totalExpectedRecords: number;
  totalActualRecords: number;
  missingRecords: string[];
  extraRecords: string[];
  duplicateRecords: string[];
  discrepancies: Table63Discrepancy[];
  discrepanciesCount: number;
  completenessStatus: 'COMPLETE' | 'SUBSET' | 'INCOMPLETE';
  isCompliant: boolean;
  recordsVerified: number;
  auditTimestamp: string;
}

export class Ashrae621Table63CrossCheckService {
  static readonly EXPECTED_TOTAL_RECORDS = AUTHORITATIVE_TABLE_6_3_COUNT;
  static readonly EXPECTED_REFERENCE_BASIS = AUTHORITATIVE_TABLE_6_3_REFERENCE_BASIS;

  /**
   * Run independent audit of Table 6-3 dataset against authoritative fixture.
   * If no dataset is supplied, defaults to active production Table 6-3 dataset from StandardDataProvider.
   */
  static auditDataset(liveData?: Ashrae621Table63Source[]): Table63AuditReport {
    const dataset = liveData || StandardDataProvider.getProduction621Table63Sources();
    const authoritativeMap = new Map<string, AuthoritativeTable63Record>();
    AUTHORITATIVE_TABLE_6_3.forEach(rec => authoritativeMap.set(rec.id, rec));

    const actualIds = dataset.map(d => d.id);
    const seenIds = new Set<string>();
    const duplicateRecords: string[] = [];
    actualIds.forEach(id => {
      if (seenIds.has(id)) {
        duplicateRecords.push(id);
      } else {
        seenIds.add(id);
      }
    });

    const missingRecords: string[] = [];
    authoritativeMap.forEach((_, id) => {
      if (!seenIds.has(id)) {
        missingRecords.push(id);
      }
    });

    const extraRecords: string[] = [];
    dataset.forEach(rec => {
      if (!authoritativeMap.has(rec.id) && !extraRecords.includes(rec.id)) {
        extraRecords.push(rec.id);
      }
    });

    const discrepancies: Table63Discrepancy[] = [];

    // 1. Audit each actual record against authoritative counterpart
    dataset.forEach(actual => {
      const auth = authoritativeMap.get(actual.id);
      if (!auth) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'record_membership',
          expectedValue: 'Present in Table 6-3 authoritative fixture',
          actualValue: 'Extra / Unrecognized record',
          severity: 'ERROR',
          description: `Record '${actual.id}' is not in authoritative ASHRAE 62.1-2022 Table 6-3.`
        });
        return;
      }

      // Air Class check (CRITICAL)
      if (actual.airClass !== auth.airClass) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'airClass',
          expectedValue: auth.airClass,
          actualValue: actual.airClass,
          severity: 'ERROR',
          description: `Air Class mismatch for '${actual.id}': expected Class ${auth.airClass}, got Class ${actual.airClass}.`
        });
      }

      // Name / Category check
      if (actual.name !== auth.name) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'name',
          expectedValue: auth.name,
          actualValue: actual.name,
          severity: 'ERROR',
          description: `Name mismatch for '${actual.id}': expected '${auth.name}', got '${actual.name}'.`
        });
      }

      // Standard check
      if (actual.standard !== auth.standard) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'standard',
          expectedValue: auth.standard,
          actualValue: actual.standard,
          severity: 'ERROR',
          description: `Standard mismatch for '${actual.id}': expected '${auth.standard}', got '${actual.standard}'.`
        });
      }

      // Edition check (CRITICAL: must be 2022)
      if (actual.edition !== auth.edition) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'edition',
          expectedValue: auth.edition,
          actualValue: actual.edition,
          severity: 'ERROR',
          description: `Edition mismatch for '${actual.id}': expected '${auth.edition}', got '${actual.edition}'.`
        });
      }

      // Reference Section check
      if (actual.referenceSection !== auth.referenceSection) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'referenceSection',
          expectedValue: auth.referenceSection,
          actualValue: actual.referenceSection,
          severity: 'ERROR',
          description: `Reference section mismatch for '${actual.id}': expected '${auth.referenceSection}', got '${actual.referenceSection}'.`
        });
      }

      // Reference Table check
      if (actual.referenceTable !== auth.referenceTable) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'referenceTable',
          expectedValue: auth.referenceTable,
          actualValue: actual.referenceTable,
          severity: 'ERROR',
          description: `Reference table mismatch for '${actual.id}': expected '${auth.referenceTable}', got '${actual.referenceTable}'.`
        });
      }

      // Reference Basis check
      if (actual.referenceBasis !== auth.referenceBasis) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'referenceBasis',
          expectedValue: auth.referenceBasis,
          actualValue: actual.referenceBasis,
          severity: 'ERROR',
          description: `Reference basis mismatch for '${actual.id}': expected '${auth.referenceBasis}', got '${actual.referenceBasis}'.`
        });
      }

      // Verification Status check (CRITICAL)
      if (actual.verificationStatus !== auth.verificationStatus) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'verificationStatus',
          expectedValue: auth.verificationStatus,
          actualValue: actual.verificationStatus,
          severity: 'ERROR',
          description: `Verification status mismatch for '${actual.id}': expected '${auth.verificationStatus}', got '${actual.verificationStatus}'.`
        });
      }

      // Special Standard Reference check where applicable
      if (auth.specialStandardReference && actual.specialStandardReference !== auth.specialStandardReference) {
        discrepancies.push({
          id: actual.id,
          name: actual.name,
          field: 'specialStandardReference',
          expectedValue: auth.specialStandardReference,
          actualValue: actual.specialStandardReference,
          severity: 'ERROR',
          description: `Special standard reference mismatch for '${actual.id}': expected '${auth.specialStandardReference}', got '${actual.specialStandardReference}'.`
        });
      }
    });

    // 2. Add discrepancies for duplicate records
    duplicateRecords.forEach(dupId => {
      discrepancies.push({
        id: dupId,
        name: dupId,
        field: 'duplicate_record',
        expectedValue: 'Unique ID',
        actualValue: 'Duplicate ID',
        severity: 'ERROR',
        description: `Duplicate record ID '${dupId}' found in dataset.`
      });
    });

    // 3. Add discrepancies for missing records
    missingRecords.forEach(missId => {
      const auth = authoritativeMap.get(missId)!;
      discrepancies.push({
        id: missId,
        name: auth.name,
        field: 'missing_record',
        expectedValue: `Present in Table 6-3 (${auth.name})`,
        actualValue: 'Missing',
        severity: 'ERROR',
        description: `Authoritative Table 6-3 record '${missId}' (${auth.name}) is missing from dataset.`
      });
    });

    // Determine completeness status
    let completenessStatus: 'COMPLETE' | 'SUBSET' | 'INCOMPLETE' = 'COMPLETE';
    if (missingRecords.length > 0 && extraRecords.length === 0 && duplicateRecords.length === 0 && discrepancies.length === missingRecords.length) {
      completenessStatus = 'SUBSET';
    } else if (missingRecords.length > 0 || extraRecords.length > 0 || duplicateRecords.length > 0 || discrepancies.length > 0) {
      completenessStatus = 'INCOMPLETE';
    } else if (dataset.length === authoritativeMap.size && discrepancies.length === 0) {
      completenessStatus = 'COMPLETE';
    }

    const isCompliant = discrepancies.length === 0 &&
      missingRecords.length === 0 &&
      extraRecords.length === 0 &&
      duplicateRecords.length === 0 &&
      dataset.length === authoritativeMap.size;

    const recordsVerified = isCompliant ? dataset.length : 0;

    return {
      referenceBasis: AUTHORITATIVE_TABLE_6_3_REFERENCE_BASIS,
      standard: 'ASHRAE 62.1',
      edition: '2022',
      totalExpectedRecords: authoritativeMap.size,
      totalActualRecords: dataset.length,
      missingRecords,
      extraRecords,
      duplicateRecords,
      discrepancies,
      discrepanciesCount: discrepancies.length,
      completenessStatus,
      isCompliant,
      recordsVerified,
      auditTimestamp: new Date().toISOString()
    };
  }
}
