import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType } from '../types';

// Minimal verified dataset for Golden Tests + a few real values
export const ASHRAE_621_2025_SPACE_TYPES: Ashrae621SpaceType[] = [
  { id: 'office', name: 'Office space', category: 'Office', rpMetric: 2.5, raMetric: 0.3, defaultOccupancyMetric: 5.4, exhaustRequired: false, reference: 'Table 6.2.2.1' },
  { id: 'conference', name: 'Conference/meeting', category: 'Office', rpMetric: 2.5, raMetric: 0.3, defaultOccupancyMetric: 50, exhaustRequired: false, reference: 'Table 6.2.2.1' },
  { id: 'retail', name: 'Retail sales', category: 'Retail', rpMetric: 3.8, raMetric: 0.6, defaultOccupancyMetric: 15, exhaustRequired: false, reference: 'Table 6.2.2.1' },
  { id: 'classroom', name: 'Classroom (ages 9+)', category: 'Education', rpMetric: 5.0, raMetric: 0.6, defaultOccupancyMetric: 35, exhaustRequired: false, reference: 'Table 6.2.2.1' },
  { id: 'corridor', name: 'Corridor', category: 'General', rpMetric: 0, raMetric: 0.3, defaultOccupancyMetric: 0, exhaustRequired: false, reference: 'Table 6.2.2.1' }
];

export const ASHRAE_621_2025_EZ_VALUES: Ashrae621Ez[] = [
  { id: 'ez_cooling_ceiling', name: 'Cooling, ceiling supply', ez: 1.0, reference: 'Table 6.2.2.2' },
  { id: 'ez_heating_ceiling', name: 'Heating, ceiling supply (warm air < 8°C above space)', ez: 0.8, reference: 'Table 6.2.2.2' },
  { id: 'ez_makeup_ceiling', name: 'Makeup air drawn in on opposite side', ez: 0.8, reference: 'Table 6.2.2.2' },
  { id: 'ez_floor_cooling', name: 'Floor supply, ceiling return (cooling)', ez: 1.2, reference: 'Table 6.2.2.2' }
];

export const ASHRAE_621_2025_EXHAUST_RATES: Ashrae621ExhaustType[] = [
  { id: 'toilet_public', name: 'Toilet rooms - Public', rate: 25, unitType: 'fixture', exhaustClass: 2, reference: 'Table 6.5.1' },
  { id: 'toilet_private', name: 'Toilet rooms - Private', rate: 12.5, unitType: 'fixture', exhaustClass: 2, reference: 'Table 6.5.1' },
  { id: 'kitchen_commercial', name: 'Commercial kitchen', rate: 3.5, unitType: 'm2', exhaustClass: 3, reference: 'Table 6.5.1' },
  { id: 'parking_garage', name: 'Enclosed parking garage', rate: 3.7, unitType: 'm2', exhaustClass: 2, reference: 'Table 6.5.1' },
  { id: 'janitor', name: 'Janitor closet', rate: 5.0, unitType: 'm2', exhaustClass: 2, reference: 'Table 6.5.1' },
  { id: 'copy_room', name: 'Copy, printing room', rate: 2.5, unitType: 'm2', exhaustClass: 2, reference: 'Table 6.5.1' }
];
export * from '../types';
