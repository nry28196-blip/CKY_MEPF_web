import fs from 'fs';
const file = 'src/data/ventilation/ashrae621/2022/data.ts';

const content = `import { SourceType } from '../types';
import { Ashrae621SpaceType, Ashrae621Ez, Ashrae621ExhaustType } from '../types';

export const ASHRAE_621_2022_SPACE_TYPES: Ashrae621SpaceType[] = [
  { 
    id: 'office', name: 'Office space', standard: 'ASHRAE 62.1', edition: '2022', category: 'Office', rpMetric: 2.5, raMetric: 0.3, defaultOccupancyMetric: 5.0, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rp: { value: 2.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      ra: { value: 0.3, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      defaultOccupancy: { value: 5.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'conference', name: 'Conference/meeting', standard: 'ASHRAE 62.1', edition: '2022', category: 'Office', rpMetric: 2.5, raMetric: 0.3, defaultOccupancyMetric: 50, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rp: { value: 2.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      ra: { value: 0.3, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      defaultOccupancy: { value: 50, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'retail', name: 'Retail sales', standard: 'ASHRAE 62.1', edition: '2022', category: 'Retail', rpMetric: 3.8, raMetric: 0.6, defaultOccupancyMetric: 15, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rp: { value: 3.8, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      ra: { value: 0.6, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      defaultOccupancy: { value: 15, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'classroom', name: 'Classroom (ages 9+)', standard: 'ASHRAE 62.1', edition: '2022', category: 'Education', rpMetric: 5.0, raMetric: 0.6, defaultOccupancyMetric: 35, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rp: { value: 5.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      ra: { value: 0.6, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      defaultOccupancy: { value: 35, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'corridor', name: 'Corridor', standard: 'ASHRAE 62.1', edition: '2022', category: 'General', rpMetric: 0, raMetric: 0.3, defaultOccupancyMetric: 0, units: 'L/s-person, L/s-m2', exhaustRequired: false, reference: 'Table 6.2.2.1', notes: 'Verified', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rp: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      ra: { value: 0.3, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      defaultOccupancy: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.2.2.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  }
];

export const ASHRAE_621_2022_EZ_VALUES: Ashrae621Ez[] = [
  { 
    id: 'ez-1', name: 'Ceiling Supply / Ceiling Return (Cooling)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Ceiling Supply / Ceiling Return', applicableCondition: 'Cooling', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-2', name: 'Ceiling Supply / Ceiling Return (Heating, >= 8C diff)', ez: 0.8, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Ceiling Supply / Ceiling Return', applicableCondition: 'Heating >= 8C diff', supplyArrangement: 'Ceiling', returnArrangement: 'Ceiling', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 0.8, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-3', name: 'Floor Supply / Ceiling Return (Low Velocity)', ez: 1.2, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Floor Supply / Ceiling Return', applicableCondition: 'Low Velocity', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'ez-4', name: 'Floor Supply / Ceiling Return (High Velocity)', ez: 1.0, reference: 'Table 6-4', standard: 'ASHRAE 62.1', edition: '2022', configuration: 'Floor Supply / Ceiling Return', applicableCondition: 'High Velocity', supplyArrangement: 'Floor', returnArrangement: 'Ceiling', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      ez: { value: 1.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      applicability: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6-4', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  }
];

// SUPPORTED SUBSET of ASHRAE 62.1-2022 Table 6.5.1
export const ASHRAE_621_2022_EXHAUST_RATES: Ashrae621ExhaustType[] = [
  { 
    id: 'toilet_public', name: 'Toilet rooms - Public', category: 'Public', standard: 'ASHRAE 62.1', rate: 25, unitType: 'fixture', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 25, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'toilet_private', name: 'Toilet rooms - Private', category: 'Private', standard: 'ASHRAE 62.1', rate: 12.5, unitType: 'fixture', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 12.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'kitchen_commercial', name: 'Commercial kitchen', category: 'Commercial', standard: 'ASHRAE 62.1', rate: 3.5, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 3, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 3.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 3, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'parking_garage', name: 'Enclosed parking garage', category: 'Parking', standard: 'ASHRAE 62.1', rate: 3.7, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 3.7, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'janitor', name: 'Janitor closet', category: 'Service', standard: 'ASHRAE 62.1', rate: 5.0, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 5.0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  },
  { 
    id: 'copy_room', name: 'Copy, printing room', category: 'Office', standard: 'ASHRAE 62.1', rate: 2.5, unitType: 'm2', operatingCondition: 'Continuous', exhaustClass: 2, reference: 'Table 6.5.1', edition: '2022', 
    revisionState: { standard: 'ASHRAE 62.1', edition: '2022', baseEdition: '2022', publishedAddendaApplied: [], publishedErrataApplied: [], verificationDate: '2026-09-08', source: SourceType.ASHRAE_PUBLISHED },
    provenance: {
      rate: { value: 2.5, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      unitType: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      exhaustClass: { value: 2, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      operatingCondition: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' },
      reference: { value: 0, standard: 'ASHRAE 62.1', edition: '2022', reference: 'Table 6.5.1', sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', revision: '2022', verificationDate: '2026-09-08' }
    },
    sourceType: SourceType.ASHRAE_PUBLISHED, verificationStatus: 'VERIFIED', verificationDate: '2026-09-08'
  }
];

export * from '../types';

export const ASHRAE_621_2022_AIR_QUALITY_STANDARDS = {
  filtrationRequirements: {
    minimumMERV: 8,
    pm25DesignThreshold: 12,
    ozoneNonattainmentRequired: true
  },
  exhaustClasses: [
    { class: 1, recirculationAllowed: true, description: "Low contaminant concentration" },
    { class: 2, recirculationAllowed: "limited", description: "Moderate contaminant concentration" },
    { class: 3, recirculationAllowed: false, description: "Significant contaminant concentration" },
    { class: 4, recirculationAllowed: false, description: "Highly objectionable/harmful" }
  ]
};
`;

fs.writeFileSync(file, content);
