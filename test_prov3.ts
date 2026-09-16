import { StandardDataProvider } from './src/data/ventilation/StandardDataProvider';
import { Ashrae621ZoneService } from './src/calculations/ventilation/Ashrae621ZoneService';

const pz = 10;
const az = 100;
const eRho = 1.3;
const zoneResult = Ashrae621ZoneService.calculateZone({
  expectedStandard: 'ASHRAE 62.1',
  expectedEdition: '2022',
  area: az,
  designOccupancy: pz,
  useDefaultOccupancy: false,
  spaceType: StandardDataProvider.get621SpaceTypes('2022').find(s => s.id === 'office')!,
  ezConfig: StandardDataProvider.get621EzValues('2022').find(e => e.id === 'ez-1')!,
  eRho
});
console.log(JSON.stringify(zoneResult, null, 2));
