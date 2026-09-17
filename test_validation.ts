import { DataProvenanceValidationService } from './src/calculations/ventilation/DataProvenanceValidationService';
import { StandardDataProvider } from './src/data/ventilation/StandardDataProvider';
import { SourceType } from './src/data/ventilation/ashrae621/types';

const officeSpace = StandardDataProvider.get621SpaceTypes('2025').find(s => s.id === 'office')!;
const ezCeiling = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-1')!;

const createSyntheticVerifiedFixture = (item: any) => {
    if (!item) return item;
    const ref = item.reference || 'ASHRAE 62.1 Section 6.2.2.1';
    const fakeProvenanceItem = {
        value: 1,
        standard: 'ASHRAE 62.1',
        edition: '2025',
        reference: ref,
        sourceType: SourceType.ASHRAE_PUBLISHED,
        verificationStatus: 'VERIFIED',
        verificationDate: '2025-01-01',
        revision: '2025'
    };

    return {
      ...item,
      sourceType: SourceType.ASHRAE_PUBLISHED,
      verificationStatus: 'VERIFIED',
        verificationDate: '2025-01-01',
      reference: ref,
      revisionState: {
        ...item.revisionState,
        standard: 'ASHRAE 62.1',
        edition: '2025',
        baseEdition: '2025',
        source: SourceType.ASHRAE_PUBLISHED
      },
      provenance: item.category ? {
          rp: { ...fakeProvenanceItem, value: item.rpMetric },
          ra: { ...fakeProvenanceItem, value: item.raMetric },
          defaultOccupancy: { ...fakeProvenanceItem, value: item.defaultOccupancyMetric },
          reference: { ...fakeProvenanceItem, value: ref }
      } : {
          ez: { ...fakeProvenanceItem, value: item.ez },
          applicability: { ...fakeProvenanceItem, value: item.applicableCondition },
          reference: { ...fakeProvenanceItem, value: ref }
      }
    };
  };

  const syntheticVerifiedOffice = createSyntheticVerifiedFixture(officeSpace);
  const syntheticVerifiedEz = createSyntheticVerifiedFixture(ezCeiling);

  console.log('Office validation:', DataProvenanceValidationService.validateSpaceTypeData(syntheticVerifiedOffice, 'ASHRAE 62.1', '2025', false));
  console.log('Ez validation:', DataProvenanceValidationService.validateEzData(syntheticVerifiedEz, 'ASHRAE 62.1', '2025'));

