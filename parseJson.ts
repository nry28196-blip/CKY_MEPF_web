import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/data/ashrae62_1_2025.json', 'utf-8'));

const spaceTypes = data.spaceTypes.map((st: any) => `{
  id: '${st.id}',
  name: '${st.name.replace(/'/g, "\\'")}',
  standard: '${st.standard}',
  edition: '${st.edition}',
  category: '${st.category}',
  rpMetric: ${st.rpMetric},
  raMetric: ${st.raMetric},
  defaultOccupancyMetric: ${st.defaultOccupancyMetric},
  units: 'L/s-person, L/s-m2',
  exhaustRequired: ${st.exhaustRequired},
  reference: '${st.reference}',
  notes: 'Verified',
  revisionSource: '2025 Base + Errata',
  verificationDate: '2026-09-08'
}`);

console.log(`export const ASHRAE_621_2025_SPACE_TYPES: Ashrae621SpaceType[] = [
${spaceTypes.join(',\n')}
];`);
