const fs = require('fs');

// Fix SpaceTypes.ts
let spaceCode = fs.readFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', 'utf8');

// replace the map with genuine arrays
spaceCode = spaceCode.replace(/export const ASHRAE_62_1_2019_SPACES[\s\S]*?(?=export const ASHRAE_62_1_2025_SPACES)/, `export const ASHRAE_62_1_2019_SPACES: VentilationSpaceType[] = [
  { id: 'office', name: 'Office Space', standard: 'ASHRAE 62.1', edition: '2019', category: 'Office Buildings', rpImp: 5, raImp: 0.06, rpMetric: 2.5, raMetric: 0.3, defaultOccupancyImp: 5, defaultOccupancyMetric: 5, exhaustRequired: false, reference: 'Table 6.2.2.1' },
  { id: 'classroom', name: 'Classroom (Age 9+)', standard: 'ASHRAE 62.1', edition: '2019', category: 'Educational Facilities', rpImp: 10, raImp: 0.12, rpMetric: 5, raMetric: 0.6, defaultOccupancyImp: 35, defaultOccupancyMetric: 35, exhaustRequired: false, reference: 'Table 6.2.2.1' },
  { id: 'retail', name: 'Retail Sales', standard: 'ASHRAE 62.1', edition: '2019', category: 'Retail', rpImp: 7.5, raImp: 0.12, rpMetric: 3.8, raMetric: 0.6, defaultOccupancyImp: 15, defaultOccupancyMetric: 15, exhaustRequired: false, reference: 'Table 6.2.2.1' }
];\n\n`);

spaceCode = spaceCode.replace(/export const ASHRAE_62_1_2025_SPACES[\s\S]*?\];/, `export const ASHRAE_62_1_2025_SPACES: VentilationSpaceType[] = [
  { id: 'office', name: 'Office Space', standard: 'ASHRAE 62.1', edition: '2025', category: 'Office Buildings', rpImp: 5, raImp: 0.06, rpMetric: 2.5, raMetric: 0.3, defaultOccupancyImp: 5, defaultOccupancyMetric: 5.4, exhaustRequired: false, reference: 'Table 6.2.2.1' },
  { id: 'classroom', name: 'Classroom (Age 9+)', standard: 'ASHRAE 62.1', edition: '2025', category: 'Educational Facilities', rpImp: 10, raImp: 0.12, rpMetric: 5, raMetric: 0.6, defaultOccupancyImp: 35, defaultOccupancyMetric: 38, exhaustRequired: false, reference: 'Table 6.2.2.1' },
  { id: 'retail', name: 'Retail Sales', standard: 'ASHRAE 62.1', edition: '2025', category: 'Retail', rpImp: 7.5, raImp: 0.12, rpMetric: 3.8, raMetric: 0.6, defaultOccupancyImp: 15, defaultOccupancyMetric: 16, exhaustRequired: false, reference: 'Table 6.2.2.1' },
  { id: 'healthcare', name: 'Outpatient Healthcare', standard: 'ASHRAE 62.1', edition: '2025', category: 'Healthcare', rpImp: 10, raImp: 0.18, rpMetric: 5, raMetric: 0.9, defaultOccupancyImp: 20, defaultOccupancyMetric: 22, exhaustRequired: false, reference: 'Table 6.2.2.1' }
];`);

fs.writeFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', spaceCode);

// Fix AirDistributionData.ts
let ezCode = fs.readFileSync('src/calculations/data/ashrae621/AirDistributionData.ts', 'utf8');
ezCode += `\nexport const ASHRAE_62_1_2019_EZ: AirDistributionConfiguration[] = [
  { id: 'ceiling_cool', name: 'Ceiling Supply (Cooling)', description: 'Ceiling supply of cool air.', ez: 1.0, heatingMode: false, coolingMode: true, reference: '2019 Table 6.2.2.2' },
  { id: 'ceiling_heat', name: 'Ceiling Supply (Heating)', description: 'Ceiling supply of warm air and ceiling return.', ez: 0.8, heatingMode: true, coolingMode: false, reference: '2019 Table 6.2.2.2' },
  { id: 'floor_cool', name: 'Floor Supply (Cooling)', description: 'Floor supply of cool air and ceiling return.', ez: 1.2, heatingMode: false, coolingMode: true, reference: '2019 Table 6.2.2.2' }
];

export const ASHRAE_62_1_2025_EZ: AirDistributionConfiguration[] = [
  { id: 'ceiling_cool', name: 'Ceiling Supply (Cooling)', description: 'Ceiling supply of cool air.', ez: 1.0, heatingMode: false, coolingMode: true, reference: '2025 Table 6.2.2.2' },
  { id: 'ceiling_heat_warm', name: 'Ceiling Supply (Heating, T_supply > T_room + 15°F)', description: 'Ceiling supply of warm air and ceiling return.', ez: 0.8, heatingMode: true, coolingMode: false, reference: '2025 Table 6.2.2.2' },
  { id: 'ceiling_heat_mild', name: 'Ceiling Supply (Heating, T_supply < T_room + 15°F)', description: 'Ceiling supply of warm air (temp diff < 15°F).', ez: 1.0, heatingMode: true, coolingMode: false, reference: '2025 Table 6.2.2.2' },
  { id: 'floor_cool', name: 'Floor Supply (Cooling)', description: 'Floor supply of cool air and ceiling return.', ez: 1.2, heatingMode: false, coolingMode: true, reference: '2025 Table 6.2.2.2' }
];
`;
fs.writeFileSync('src/calculations/data/ashrae621/AirDistributionData.ts', ezCode);
