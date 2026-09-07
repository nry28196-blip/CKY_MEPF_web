const fs = require('fs');

let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

// Update VrfSystemResult
content = content.replace(
  /rooms: VrfRoomResult\[\];/,
  "enrichedRooms: VrfRoomResult[];\n  oduHP: number;\n  oduTons: number;\n  oduWatts: number;\n  autoHP: number;"
);
content = content.replace(
  /selectedHP: number;\n  oduCapacityTons: number;\n  oduCapacityWatts: number;/,
  ""
);

content = content.replace(
  /rooms: enrichedRooms,/,
  "enrichedRooms,"
);
content = content.replace(
  /selectedHP,\n      oduCapacityTons, oduCapacityWatts,/,
  "oduHP: selectedHP,\n      oduTons: oduCapacityTons,\n      oduWatts: oduCapacityWatts,\n      autoHP,"
);

fs.writeFileSync('src/lib/VentilationEngine.ts', content);

