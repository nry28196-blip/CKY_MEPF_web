const fs = require('fs');

const categories = {
  CORR: 'Correctional Facilities',
  EDU: 'Educational Facilities',
  FNB: 'Food and Beverage Service',
  GEN: 'General',
  HOTEL: 'Hotels, Motels, Resorts, Dormitories',
  OFFICE: 'Office Buildings',
  MISC: 'Miscellaneous Spaces',
  PUB: 'Public Assembly Spaces',
  RETAIL: 'Retail',
  SPORTS: 'Sports and Entertainment',
  HEALTH: 'Healthcare Facilities' // Some moved or outpatient
};

// Base data template (using 2022 values as baseline, will adjust for 2019/2025 if needed)
// { id, name, cat, rpImp, raImp, rpMet, raMet, occImp, occMet }
const data = [
  // Office
  ['office', 'Office space', 'OFFICE', 5, 0.06, 2.5, 0.3, 5, 5.4],
  ['reception', 'Reception areas', 'OFFICE', 5, 0.06, 2.5, 0.3, 30, 32],
  ['main_entry', 'Main entry lobbies', 'OFFICE', 5, 0.06, 2.5, 0.3, 10, 11],
  ['telephone', 'Telephone/data entry', 'OFFICE', 5, 0.06, 2.5, 0.3, 60, 65],
  // Educational
  ['daycare', 'Daycare (through age 4)', 'EDU', 10, 0.18, 5, 0.9, 25, 27],
  ['classroom_early', 'Daycare sickroom', 'EDU', 10, 0.18, 5, 0.9, 25, 27],
  ['classroom_age58', 'Classrooms (ages 5-8)', 'EDU', 10, 0.12, 5, 0.6, 25, 27],
  ['classroom_age9', 'Classrooms (age 9 plus)', 'EDU', 10, 0.12, 5, 0.6, 35, 38],
  ['lecture_hall', 'Lecture classroom', 'EDU', 7.5, 0.06, 3.8, 0.3, 65, 70],
  ['lecture_hall_fixed', 'Lecture hall (fixed seats)', 'EDU', 7.5, 0.06, 3.8, 0.3, 150, 161],
  ['art_classroom', 'Art classroom', 'EDU', 10, 0.18, 5, 0.9, 20, 22],
  ['science_lab', 'Science laboratories', 'EDU', 10, 0.18, 5, 0.9, 25, 27],
  ['wood_metal_shop', 'Wood/metal shop', 'EDU', 10, 0.18, 5, 0.9, 20, 22],
  ['computer_lab', 'Computer lab', 'EDU', 10, 0.12, 5, 0.6, 25, 27],
  ['media_center', 'Media center', 'EDU', 10, 0.12, 5, 0.6, 25, 27],
  ['multiuse_assembly', 'Multiuse assembly', 'EDU', 7.5, 0.06, 3.8, 0.3, 100, 108],
  ['music_theater', 'Music/theater/dance', 'EDU', 10, 0.06, 5, 0.3, 35, 38],
  // F&B
  ['restaurant_dining', 'Restaurant dining rooms', 'FNB', 7.5, 0.18, 3.8, 0.9, 70, 75],
  ['cafeteria_fastfood', 'Cafeteria/fast-food dining', 'FNB', 7.5, 0.18, 3.8, 0.9, 100, 108],
  ['bar_cocktail', 'Bars, cocktail lounges', 'FNB', 7.5, 0.18, 3.8, 0.9, 100, 108],
  ['kitchen', 'Kitchen (cooking)', 'FNB', 7.5, 0.12, 3.8, 0.6, 20, 22],
  // General
  ['break_room', 'Break rooms', 'GEN', 5, 0.06, 2.5, 0.3, 25, 27],
  ['coffee_station', 'Coffee stations', 'GEN', 5, 0.06, 2.5, 0.3, 20, 22],
  ['conference', 'Conference/meeting', 'GEN', 5, 0.06, 2.5, 0.3, 50, 54],
  ['corridor', 'Corridors', 'GEN', 0, 0.06, 0, 0.3, 0, 0],
  ['storage_rooms', 'Storage rooms', 'GEN', 0, 0.12, 0, 0.6, 0, 0],
  // Hotels
  ['bedroom', 'Bedroom/living room', 'HOTEL', 5, 0.06, 2.5, 0.3, 10, 11],
  ['barracks', 'Barracks sleeping areas', 'HOTEL', 5, 0.06, 2.5, 0.3, 20, 22],
  ['dorm_bedroom', 'Dormitory sleeping areas', 'HOTEL', 5, 0.06, 2.5, 0.3, 20, 22],
  ['hotel_lobby', 'Lobbies/prefunction', 'HOTEL', 7.5, 0.06, 3.8, 0.3, 30, 32],
  ['multipurpose', 'Multipurpose assembly', 'HOTEL', 5, 0.06, 2.5, 0.3, 120, 129],
  // Public Assembly
  ['auditorium', 'Auditorium seating area', 'PUB', 5, 0.06, 2.5, 0.3, 150, 161],
  ['worship', 'Places of religious worship', 'PUB', 5, 0.06, 2.5, 0.3, 120, 129],
  ['courtrooms', 'Courtrooms', 'PUB', 5, 0.06, 2.5, 0.3, 70, 75],
  ['legislative', 'Legislative chambers', 'PUB', 5, 0.06, 2.5, 0.3, 50, 54],
  ['library', 'Libraries', 'PUB', 5, 0.12, 2.5, 0.6, 10, 11],
  ['lobby', 'Lobbies', 'PUB', 5, 0.06, 2.5, 0.3, 150, 161],
  ['museum', 'Museums (childrens)', 'PUB', 7.5, 0.12, 3.8, 0.6, 40, 43],
  ['museum_gallery', 'Museums/galleries', 'PUB', 7.5, 0.06, 3.8, 0.3, 40, 43],
  // Retail
  ['retail', 'Sales (except below)', 'RETAIL', 7.5, 0.12, 3.8, 0.6, 15, 16],
  ['mall_concourse', 'Mall common areas', 'RETAIL', 7.5, 0.06, 3.8, 0.3, 40, 43],
  ['barber', 'Barber shop', 'RETAIL', 7.5, 0.06, 3.8, 0.3, 25, 27],
  ['beauty_salon', 'Beauty and nail salons', 'RETAIL', 20, 0.12, 10, 0.6, 25, 27],
  ['pet_shop', 'Pet shops (animal areas)', 'RETAIL', 7.5, 0.18, 3.8, 0.9, 10, 11],
  ['supermarket', 'Supermarket', 'RETAIL', 7.5, 0.06, 3.8, 0.3, 8, 9],
  ['coin_dryclean', 'Coin-operated laundries', 'RETAIL', 7.5, 0.06, 3.8, 0.3, 20, 22],
  // Sports
  ['gym_play', 'Gymnasium/sports arena (play area)', 'SPORTS', 20, 0.30, 10, 1.5, 30, 32],
  ['spectator_area', 'Spectator areas', 'SPORTS', 7.5, 0.06, 3.8, 0.3, 150, 161],
  ['swimming_pool', 'Swimming (pool & deck)', 'SPORTS', 0, 0.48, 0, 2.4, 0, 0],
  ['health_club', 'Health club/aerobics room', 'SPORTS', 20, 0.06, 10, 0.3, 40, 43],
  ['health_club_wt', 'Health club/weight room', 'SPORTS', 20, 0.06, 10, 0.3, 10, 11],
  ['bowling', 'Bowling alley (seating)', 'SPORTS', 10, 0.12, 5, 0.6, 40, 43],
  // Misc
  ['bank_vault', 'Bank vaults/safe deposit', 'MISC', 5, 0.06, 2.5, 0.3, 5, 5],
  ['pharmacy', 'Pharmacy (prep area)', 'MISC', 5, 0.18, 2.5, 0.9, 10, 11],
  ['photo_studio', 'Photo studios', 'MISC', 5, 0.12, 2.5, 0.6, 10, 11],
  ['shipping_recv', 'Shipping/receiving', 'MISC', 0, 0.12, 0, 0.6, 0, 0]
];

function buildArray(edition) {
  let output = `export const ASHRAE_62_1_${edition}_SPACES: VentilationSpaceType[] = [\n`;
  for (let i = 0; i < data.length; i++) {
    const [id, name, catKey, rpImp, raImp, rpMet, raMet, occImp, occMet] = data[i];
    
    // adjust occupancy depending on edition
    // In 2019, metric occupancy is usually exactly same as imperial. In 2022/2025, they mathematically converted it per 100 sq m vs 1000 sq ft, so it differs by ~1.076.
    let mOcc = occMet;
    let iOcc = occImp;
    
    if (edition === '2019') {
      mOcc = occImp; // 2019 used the exact same numbers for both columns usually
    }
    
    let exhaustRequired = false;
    let exhaustCat = '';
    if (id === 'beauty_salon') { exhaustRequired = true; exhaustCat = ", exhaustCategory: 'salon'"; }
    if (id === 'pet_shop') { exhaustRequired = true; exhaustCat = ", exhaustCategory: 'pet'"; }
    
    output += `  { id: '${id}', name: '${name}', standard: 'ASHRAE 62.1', edition: '${edition}', category: '${categories[catKey]}', rpImp: ${rpImp}, raImp: ${raImp}, rpMetric: ${rpMet}, raMetric: ${raMet}, defaultOccupancyImp: ${iOcc}, defaultOccupancyMetric: ${mOcc}, exhaustRequired: ${exhaustRequired}${exhaustCat}, reference: 'Table 6.2.2.1' }`;
    if (i < data.length - 1) output += ',\n';
    else output += '\n';
  }
  output += `];\n`;
  return output;
}

const fileContent = `import { VentilationSpaceType } from '../../../models/VentilationModels';\n\n` 
  + buildArray('2019') + '\n' 
  + buildArray('2022') + '\n' 
  + buildArray('2025');

fs.writeFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', fileContent);
