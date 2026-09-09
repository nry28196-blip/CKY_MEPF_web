import fs from 'fs';
const files = [
  'src/tests/ventilation/golden.test.ts',
  'src/tests/ventilation/Ventilation.test.ts',
  'src/tests/ventilation/ashrae-621-numerical.test.ts'
];

const replacement = `const makeVerified = (item: any) => {
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
          applicability: { ...fakeProvenanceItem, value: item.applicableCondition },
          reference: { ...fakeProvenanceItem, value: ref }
      }
    };
};`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const makeVerified = \(item\) => \{[\s\S]*?return \{[\s\S]*?\.\.\.item\.revisionState,[\s\S]*?source: 'VERIFIED'[\s\S]*?\}[\s\S]*?\};/, replacement);
  fs.writeFileSync(file, content);
}
