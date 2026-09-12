import { AshraeEdition, Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType, SourceType } from '../../data/ventilation/ashrae621/types';

export function createSyntheticVerifiedSpaceType(edition: AshraeEdition): Ashrae621SpaceType {
  return {
    id: `synthetic-office-${edition}`,
    name: 'Synthetic Verified Office',
    category: 'Test',
    standard: 'ASHRAE 62.1',
    edition: edition,
    sourceType: SourceType.ASHRAE_PUBLISHED,
    verificationStatus: 'VERIFIED',
    revisionState: {
      source: SourceType.ASHRAE_PUBLISHED,
      standard: 'ASHRAE 62.1',
      edition: edition,
      baseEdition: edition,
      publishedAddendaApplied: [],
      publishedErrataApplied: [],
      verificationDate: '2025-01-01'
    },
    verificationDate: '2025-01-01',
    reference: 'Synthetic Test Data',
    units: 'Test',
    exhaustRequired: false,
    notes: 'Test',
    rpMetric: 2.5,
    raMetric: 0.3,
    defaultOccupancyMetric: 5.4,
    provenance: {
      rp: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      ra: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      defaultOccupancy: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition }
    }
  };
}

export function createSyntheticVerifiedEz(edition: AshraeEdition): Ashrae621Ez {
  return {
    id: `synthetic-ez-${edition}`,
    name: 'Synthetic Verified Ez',
    standard: 'ASHRAE 62.1',
    edition: edition,
    sourceType: SourceType.ASHRAE_PUBLISHED,
    verificationStatus: 'VERIFIED',
    revisionState: {
      source: SourceType.ASHRAE_PUBLISHED,
      standard: 'ASHRAE 62.1',
      edition: edition,
      baseEdition: edition,
      publishedAddendaApplied: [],
      publishedErrataApplied: [],
      verificationDate: '2025-01-01'
    },
    verificationDate: '2025-01-01',
    reference: 'Synthetic Test Data',
    ez: 1.0,
    configuration: 'Test',
    applicableCondition: 'Test',
    supplyArrangement: 'Test',
    returnArrangement: 'Test',
    provenance: {
      ez: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      applicability: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition },
      reference: { sourceType: SourceType.ASHRAE_PUBLISHED, standard: 'ASHRAE 62.1', edition: edition, verificationStatus: 'VERIFIED', verificationDate: '2025-01-01', reference: 'Test', value: 0, revision: edition }
    }
  };
}

export function createSyntheticVerifiedExhaust(edition: AshraeEdition): Ashrae621ExhaustType {
  return {
    id: `synthetic-exhaust-${edition}`,
    name: 'Synthetic Verified Exhaust',
    category: 'Test',
    operatingCondition: 'Test',
    standard: 'ASHRAE 62.1',
    edition: edition,
    sourceType: SourceType.ASHRAE_PUBLISHED,
    verificationStatus: 'VERIFIED',
    revisionState: {
      source: SourceType.ASHRAE_PUBLISHED,
      standard: 'ASHRAE 62.1',
      edition: edition,
      baseEdition: edition,
      publishedAddendaApplied: [],
      publishedErrataApplied: [],
      verificationDate: '2025-01-01'
    },
    verificationDate: '2025-01-01',
    reference: 'Synthetic Test Data',
    rate: 25,
    unitType: 'fixture',
    exhaustClass: 2
  };
}
