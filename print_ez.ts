import { StandardDataProvider } from './src/data/ventilation/StandardDataProvider';

const ezCeiling = StandardDataProvider.get621EzValues('2025').find(e => e.id === 'ez-1');
const makeVerified = (item: any) => {
    if (!item) return item;
    const ref = item.reference || 'ASHRAE 62.1 Section 6.2.2.1';
    const fakeProvenanceItem = {
        value: 1,
        standard: 'ASHRAE 62.1',
        edition: '2025',
        reference: ref,
        sourceType: 'ASHRAE_PUBLISHED',
        verificationStatus: 'VERIFIED',
        revision: '2025'
    };
    return {
      ...item,
      sourceType: 'ASHRAE_PUBLISHED',
      verificationStatus: 'VERIFIED',
      reference: ref,
      revisionState: {
        ...item.revisionState,
        standard: 'ASHRAE 62.1',
        edition: '2025',
        baseEdition: '2025',
        source: 'VERIFIED'
      },
      provenance: item.category ? {
          rp: { ...fakeProvenanceItem, value: item.rpMetric },
          ra: { ...fakeProvenanceItem, value: item.raMetric },
          defaultOccupancy: { ...fakeProvenanceItem, value: item.defaultOccupancyMetric },
          reference: { ...fakeProvenanceItem, value: ref }
      } : {
          ez: { ...fakeProvenanceItem, value: item.ez },
          applicability: { ...fakeProvenanceItem, value: item.applicability },
          applicability: { ...fakeProvenanceItem, value: item.applicableCondition },
          reference: { ...fakeProvenanceItem, value: ref }
      }
    };
  };

console.log(JSON.stringify(makeVerified(ezCeiling), null, 2));
