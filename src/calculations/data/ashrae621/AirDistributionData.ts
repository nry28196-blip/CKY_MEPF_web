import ashrae2025Data from '../../../data/ashrae62_1_2025.json';
export interface AirDistributionConfiguration {
  id: string;
  name: string;
  description: string;
  ez: number;
  heatingMode: boolean;
  coolingMode: boolean;
  reference: string;
}

export const ASHRAE_62_1_2022_EZ: AirDistributionConfiguration[] = [
  {
    id: 'ceiling_cool',
    name: 'Ceiling Supply (Cooling)',
    description: 'Ceiling supply of cool air.',
    ez: 1.0,
    heatingMode: false,
    coolingMode: true,
    reference: 'Table 6.2.2.2',
  },
  {
    id: 'ceiling_heat_warm',
    name: 'Ceiling Supply (Heating, T_supply > T_room + 15°F/8°C)',
    description: 'Ceiling supply of warm air and ceiling return.',
    ez: 0.8,
    heatingMode: true,
    coolingMode: false,
    reference: 'Table 6.2.2.2',
  },
  {
    id: 'ceiling_heat_mild',
    name: 'Ceiling Supply (Heating, T_supply < T_room + 15°F/8°C)',
    description: 'Ceiling supply of warm air (temp diff < 15°F/8°C) and ceiling return.',
    ez: 1.0,
    heatingMode: true,
    coolingMode: false,
    reference: 'Table 6.2.2.2',
  },
  {
    id: 'floor_cool',
    name: 'Floor Supply (Cooling)',
    description: 'Floor supply of cool air and ceiling return.',
    ez: 1.2,
    heatingMode: false,
    coolingMode: true,
    reference: 'Table 6.2.2.2',
  },
  {
    id: 'floor_heat',
    name: 'Floor Supply (Heating)',
    description: 'Floor supply of warm air and ceiling return.',
    ez: 1.0,
    heatingMode: true,
    coolingMode: false,
    reference: 'Table 6.2.2.2',
  },
  {
    id: 'displacement',
    name: 'Displacement Ventilation',
    description: 'Floor supply of cool air and ceiling return, designed for stratification.',
    ez: 1.2,
    heatingMode: false,
    coolingMode: true,
    reference: 'Table 6.2.2.2',
  },
  {
    id: 'makeup_air',
    name: 'Makeup Air Supply',
    description: 'Makeup air drawn in on the opposite side of the room from the exhaust and/or return.',
    ez: 0.8,
    heatingMode: true,
    coolingMode: true,
    reference: 'Table 6.2.2.2',
  }
];

export const ASHRAE_62_1_2019_EZ: AirDistributionConfiguration[] = [
  { id: 'ceiling_cool', name: 'Ceiling Supply (Cooling)', description: 'Ceiling supply of cool air.', ez: 1.0, heatingMode: false, coolingMode: true, reference: '2019 Table 6.2.2.2' },
  { id: 'ceiling_heat', name: 'Ceiling Supply (Heating)', description: 'Ceiling supply of warm air and ceiling return.', ez: 0.8, heatingMode: true, coolingMode: false, reference: '2019 Table 6.2.2.2' },
  { id: 'floor_cool', name: 'Floor Supply (Cooling)', description: 'Floor supply of cool air and ceiling return.', ez: 1.2, heatingMode: false, coolingMode: true, reference: '2019 Table 6.2.2.2' }
];

export const ASHRAE_62_1_2025_EZ: AirDistributionConfiguration[] = ashrae2025Data.coefficients.airDistribution as AirDistributionConfiguration[];
