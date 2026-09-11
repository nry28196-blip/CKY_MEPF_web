import { StandardDataProvider } from './src/data/ventilation/StandardDataProvider.ts';
import { Ashrae621ZoneService } from './src/calculations/ventilation/Ashrae621ZoneService.ts';
import { Ashrae621ExhaustService } from './src/calculations/ventilation/Ashrae621ExhaustService.ts';

// Get datasets
const spaces2019 = StandardDataProvider.get621SpaceTypes('2019');
const spaces2022 = StandardDataProvider.get621SpaceTypes('2022');
const spaces2025 = StandardDataProvider.get621SpaceTypes('2025');

const ez2019 = StandardDataProvider.get621EzValues('2019');
const ez2022 = StandardDataProvider.get621EzValues('2022');
const ez2025 = StandardDataProvider.get621EzValues('2025');

const ex2019 = StandardDataProvider.get621ExhaustRates('2019');
const ex2022 = StandardDataProvider.get621ExhaustRates('2022');
const ex2025 = StandardDataProvider.get621ExhaustRates('2025');

console.log('--- PRODUCTION DATA VERIFICATION GATE ---');

function testSpace(space, edition) {
  const result = Ashrae621ZoneService.calculateZone({
    zoneId: 'test',
    spaceType: space,
    area: 100,
    occupants: 5,
    ezConfig: ez2025[0], // Using some Ez, doesn't matter much if space is blocked
    expectedStandard: 'ASHRAE 62.1',
    expectedEdition: edition
  });
  return result.status;
}

function testEz(ez, edition) {
  const result = Ashrae621ZoneService.calculateZone({
    zoneId: 'test',
    spaceType: spaces2025[0],
    area: 100,
    occupants: 5,
    ezConfig: ez,
    expectedStandard: 'ASHRAE 62.1',
    expectedEdition: edition
  });
  return result.status;
}

function testExhaust(ex, edition) {
  const result = Ashrae621ExhaustService.calculate({
    exhaustType: ex,
    qty: 1,
    designExhaust: 1000,
    expectedStandard: 'ASHRAE 62.1',
    expectedEdition: edition
  });
  return result.status;
}

console.log('2019 Space Types: ' + testSpace(spaces2019.find(s => s.verificationStatus === 'NOT_VERIFIED'), '2019'));
console.log('2022 Space Types: ' + testSpace(spaces2022.find(s => s.verificationStatus === 'NOT_VERIFIED'), '2022'));
console.log('2025 Space Types: ' + testSpace(spaces2025.find(s => s.verificationStatus === 'NOT_VERIFIED'), '2025'));

console.log('2019 Ez: ' + testEz(ez2019.find(e => e.verificationStatus === 'NOT_VERIFIED'), '2019'));
console.log('2022 Ez: ' + testEz(ez2022.find(e => e.verificationStatus === 'NOT_VERIFIED'), '2022'));
console.log('2025 Ez: ' + testEz(ez2025.find(e => e.verificationStatus === 'NOT_VERIFIED'), '2025'));

console.log('2019 Exhaust: ' + testExhaust(ex2019.find(e => e.verificationStatus === 'NOT_VERIFIED'), '2019'));
console.log('2022 Exhaust: ' + testExhaust(ex2022.find(e => e.verificationStatus === 'NOT_VERIFIED'), '2022'));
console.log('2025 Exhaust: ' + testExhaust(ex2025.find(e => e.verificationStatus === 'NOT_VERIFIED'), '2025'));

console.log('\n--- EXHAUST SAFETY PROOF ---');
const realExhaust2025 = ex2025.find(e => e.name.toLowerCase().includes('toilet'));
const exRes = Ashrae621ExhaustService.calculate({
  exhaustType: realExhaust2025,
  qty: 10,
  designExhaust: 9999, // greater than required
  expectedStandard: 'ASHRAE 62.1',
  expectedEdition: '2025'
});
console.log('Status: ' + exRes.status);
console.log('Required Exhaust: ' + exRes.requiredExhaust);

console.log('\n--- SPACE-TYPE SAFETY PROOF ---');
const realOffice2025 = spaces2025.find(s => s.name === 'Office space');
const spaceRes = Ashrae621ZoneService.calculateZone({
  zoneId: 'office-1',
  spaceType: realOffice2025,
  area: 100, // valid
  occupants: 5, // valid
  ezConfig: ez2025[0], // valid
  expectedStandard: 'ASHRAE 62.1',
  expectedEdition: '2025'
});
console.log('Status: ' + spaceRes.status);
console.log('Vbz: ' + spaceRes.vbz);
console.log('Voz: ' + spaceRes.voz);

