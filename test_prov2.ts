import { StandardDataProvider } from './src/data/ventilation/StandardDataProvider';
const ezValues = StandardDataProvider.get621EzValues('2022');
const ez1 = ezValues.find(e => e.id === 'ez-1');
console.log(JSON.stringify(ez1, null, 2));
