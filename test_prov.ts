import { StandardDataProvider } from './src/data/ventilation/StandardDataProvider';
const spaceTypes = StandardDataProvider.get621SpaceTypes('2022');
const office = spaceTypes.find(s => s.id === 'office');
console.log(JSON.stringify(office, null, 2));
