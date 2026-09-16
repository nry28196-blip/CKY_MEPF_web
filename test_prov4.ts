import { Ashrae621ZoneService } from './src/calculations/ventilation/Ashrae621ZoneService';
import { SourceType, Ashrae621SpaceType, Ashrae621Ez } from './src/data/ventilation/ashrae621/types';

const syntheticSpaceType: Ashrae621SpaceType = {
  id: 'synthetic-office',
  name: 'Synthetic Office',
  standard: 'ASHRAE 62.1',
  edition: '2022',
  category: 'Office',
  rpMetric: 2.5,
  raMetric: 0.3,
  defaultOccupancyMetric: 5,
  units: 'L/s-person, L/s-m2',
  exhaustRequired: false,
  reference: 'Table 6.2.2.1',
  notes: 'Synthetic',
  sourceType: SourceType.UNKNOWN,
  verificationStatus: 'NOT_VERIFIED',
  revisionState: {
    standard: 'ASHRAE 62.1',
    edition: '2022',
    baseEdition: '2022',
    publishedAddendaApplied: ['Addendum j'],
    publishedErrataApplied: [],
    source: SourceType.UNKNOWN
  }
};

const syntheticEz: Ashrae621Ez = {
  id: 'synthetic-ez',
  name: 'Synthetic Ez',
  ez: 0.8,
  reference: 'Table 6-4',
  standard: 'ASHRAE 62.1',
  edition: '2022',
  configuration: 'Ceiling Supply / Ceiling Return',
  applicableCondition: 'Cooling',
  supplyArrangement: 'Ceiling',
  returnArrangement: 'Ceiling',
  sourceType: SourceType.UNKNOWN,
  verificationStatus: 'NOT_VERIFIED',
  revisionState: {
    standard: 'ASHRAE 62.1',
    edition: '2022',
    baseEdition: '2022',
    publishedAddendaApplied: ['Addendum j'],
    publishedErrataApplied: [],
    source: SourceType.UNKNOWN
  }
};

console.log(Ashrae621ZoneService.calculateZone({
      expectedStandard: 'ASHRAE 62.1',
      expectedEdition: '2022',
      area: 100,
      designOccupancy: 10,
      useDefaultOccupancy: false,
      spaceType: syntheticSpaceType,
      ezConfig: syntheticEz,
      eRho: 1.3
    }));
