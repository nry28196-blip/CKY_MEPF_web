const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir('src/calculations/ventilation');
ensureDir('src/data/ventilation/ashrae621/2025');
ensureDir('src/data/ventilation/ashrae622/2025');
ensureDir('src/services');

// Data models
const data621_2025 = `
export const ASHRAE_621_2025_ZONES = [
  { id: 'office', name: 'Office space', rp: 2.5, ra: 0.3, density: 5, unit: 'L/s' },
  { id: 'conference', name: 'Conference/meeting', rp: 2.5, ra: 0.3, density: 50, unit: 'L/s' },
  { id: 'retail', name: 'Retail sales', rp: 3.8, ra: 0.6, density: 15, unit: 'L/s' },
  { id: 'classroom', name: 'Classroom (ages 9+)', rp: 5.0, ra: 0.6, density: 35, unit: 'L/s' }
];

export const ASHRAE_621_2025_EZ = [
  { id: 'ez_cooling_ceiling', name: 'Cooling, ceiling supply', ez: 1.0 },
  { id: 'ez_heating_ceiling', name: 'Heating, ceiling supply', ez: 0.8 },
  { id: 'ez_makeup_ceiling', name: 'Makeup air drawn in on opposite side', ez: 0.8 }
];

export const ASHRAE_621_2025_EXHAUST = [
  { id: 'toilet_public', name: 'Toilet rooms - Public', rate: 25, unitType: 'fixture', class: 2 },
  { id: 'kitchen_commercial', name: 'Commercial kitchen', rate: 3.5, unitType: 'm2', class: 3 },
  { id: 'parking_garage', name: 'Enclosed parking garage', rate: 3.7, unitType: 'm2', class: 2 }
];
`;
fs.writeFileSync('src/data/ventilation/ashrae621/2025/data.ts', data621_2025);

const data622_2025 = `
export const ASHRAE_622_2025_LOCAL_EXHAUST = [
  { id: 'kitchen', name: 'Kitchen', continuous: 5, intermittent: 50 },
  { id: 'bathroom', name: 'Bathroom', continuous: 10, intermittent: 25 }
];
`;
fs.writeFileSync('src/data/ventilation/ashrae622/2025/data.ts', data622_2025);

console.log("Directories created.");
