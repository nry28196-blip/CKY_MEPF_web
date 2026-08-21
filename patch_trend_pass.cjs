const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

const oldPass = `          {/* Interactive Trend Chart Section */}
          <TrendVisualizer 
            type="cooling" 
            currentParams={{
              isVrf: isVrf,
              area: isVrf ? Math.round(vrfRooms.reduce((acc, r) => acc + (r.basis === 'area' ? r.size : r.size / 3), 0)) : area,
              volume: isVrf ? Math.round(vrfRooms.reduce((acc, r) => acc + (r.basis === 'volume' ? r.size : r.size * 3), 0)) : volume,
              estimationBasis: isVrf ? 'area' : estimationBasis,
              occupants: isVrf ? vrfRooms.reduce((acc, r) => acc + r.occupants, 0) : occupants,
              calculatedWatts: isVrf ? vrfResults.totalConnectedWatts : results.watts
            }} 
          />`;

const newPass = `          {/* Interactive Trend Chart Section */}
          <TrendVisualizer 
            type="cooling" 
            currentParams={{
              isVrf: isVrf,
              area: isVrf ? Math.round(vrfRooms.reduce((acc, r) => acc + (r.basis === 'area' ? r.size : r.size / 3), 0)) : area,
              volume: isVrf ? Math.round(vrfRooms.reduce((acc, r) => acc + (r.basis === 'volume' ? r.size : r.size * 3), 0)) : volume,
              estimationBasis: isVrf ? 'area' : estimationBasis,
              occupants: isVrf ? vrfRooms.reduce((acc, r) => acc + r.occupants, 0) : occupants,
              calculatedWatts: isVrf ? vrfResults.totalConnectedWatts : results.watts,
              results: results
            }} 
          />`;

content = content.replace(oldPass, newPass);
fs.writeFileSync('src/components/MechanicalCalc.tsx', content);
