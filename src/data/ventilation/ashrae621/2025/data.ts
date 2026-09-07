import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType } from '../types';

export const ASHRAE_621_2025_SPACE_TYPES: Ashrae621SpaceType[] = [
  { id: 'office', name: 'Office space', standard: 'ASHRAE 62.1', edition: '2025', category: 'Office', rpMetric: 2.5, raMetric: 0.3, defaultOccupancyMetric: 5.4, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', revisionSource: 'Base' },
  { id: 'conference', name: 'Conference/meeting', standard: 'ASHRAE 62.1', edition: '2025', category: 'Office', rpMetric: 2.5, raMetric: 0.3, defaultOccupancyMetric: 50, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', revisionSource: 'Base' },
  { id: 'retail', name: 'Retail sales', standard: 'ASHRAE 62.1', edition: '2025', category: 'Retail', rpMetric: 3.8, raMetric: 0.6, defaultOccupancyMetric: 15, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', revisionSource: 'Base' },
  { id: 'classroom', name: 'Classroom (ages 9+)', standard: 'ASHRAE 62.1', edition: '2025', category: 'Education', rpMetric: 5.0, raMetric: 0.6, defaultOccupancyMetric: 35, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', revisionSource: 'Base' },
  { id: 'corridor', name: 'Corridor', standard: 'ASHRAE 62.1', edition: '2025', category: 'General', rpMetric: 0, raMetric: 0.3, defaultOccupancyMetric: 0, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', revisionSource: 'Base' }
];

export const ASHRAE_621_2025_EZ_VALUES: Ashrae621Ez[] = [
  { id: 'ez-1', name: 'Ceiling Supply / Ceiling Return (Cooling)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2025', configuration: 'Ceiling Supply / Ceiling Return', applicableCondition: 'Cooling', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', revision: 'Base' },
  { id: 'ez-2', name: 'Ceiling Supply / Ceiling Return (Heating, >= 8C diff)', ez: 0.8, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2025', configuration: 'Ceiling Supply / Ceiling Return', applicableCondition: 'Heating >= 8C diff', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', revision: 'Base' },
  { id: 'ez-3', name: 'Floor Supply / Ceiling Return (Low Velocity)', ez: 1.2, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2025', configuration: 'Floor Supply / Ceiling Return', applicableCondition: 'Low Velocity', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', revision: 'Base' },
  { id: 'ez-4', name: 'Floor Supply / Ceiling Return (High Velocity)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2025', configuration: 'Floor Supply / Ceiling Return', applicableCondition: 'High Velocity', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', revision: 'Base' }
];

export const ASHRAE_621_2025_EXHAUST_RATES: Ashrae621ExhaustType[] = [
  { id: 'toilet_public', name: 'Toilet rooms - Public', category: 'Public', rate: 25, unitType: 'fixture', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2025', revision: 'Base' },
  { id: 'toilet_private', name: 'Toilet rooms - Private', category: 'Private', rate: 12.5, unitType: 'fixture', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2025', revision: 'Base' },
  { id: 'kitchen_commercial', name: 'Commercial kitchen', category: 'Commercial', rate: 3.5, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 3, reference: 'Table 6.5.1', edition: '2025', revision: 'Base' },
  { id: 'parking_garage', name: 'Enclosed parking garage', category: 'Parking', rate: 3.7, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2025', revision: 'Base' },
  { id: 'janitor', name: 'Janitor closet', category: 'Service', rate: 5.0, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2025', revision: 'Base' },
  { id: 'copy_room', name: 'Copy, printing room', category: 'Office', rate: 2.5, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2025', revision: 'Base' }
];

export * from '../types';
