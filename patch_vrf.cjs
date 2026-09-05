const fs = require('fs');
const file = 'src/components/MechanicalCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

const getVrfCalculationsReplacement = `
  const getVrfCalculations = () => {
    let totalConnectedTons = 0;
    let totalConnectedWatts = 0;
    let totalOccupants = 0;
    
    const enrichedRooms = vrfRooms.map(r => {
      const loads = calcRoomTonsAndWatts(r.basis, r.size, r.occupants);
      return {
        ...r,
        tons: loads.tons,
        watts: loads.watts
      };
    });

    enrichedRooms.forEach(r => {
      totalConnectedTons += r.tons;
      totalConnectedWatts += r.watts;
      totalOccupants += r.occupants;
    });
`;

code = code.replace(
  /const getVrfCalculations = \(\) => \{\s*let totalConnectedTons = 0;\s*let totalConnectedWatts = 0;\s*let totalOccupants = 0;\s*vrfRooms\.forEach\(r => \{\s*totalConnectedTons \+= r\.tons;\s*totalConnectedWatts \+= r\.watts;\s*totalOccupants \+= r\.occupants;\s*\}\);/,
  getVrfCalculationsReplacement
);

// We need to also return enrichedRooms from getVrfCalculations.
// Look for the return object
const returnReplacement = `
      baseOduCharge,
      totalCharge,
      enrichedRooms
    };
  };`;

code = code.replace(
  /baseOduCharge,\s*totalCharge\s*\};\s*\};\s*const vrfResults = getVrfCalculations\(\);/,
  returnReplacement + '\n\n  const vrfResults = getVrfCalculations();'
);

// Now replace usages of vrfRooms with vrfResults.enrichedRooms in the UI.
// But wait, VrfTopologyCanvas also receives vrfRooms!
// Let's replace `vrfRooms={vrfRooms}` with `vrfRooms={vrfResults.enrichedRooms}` for VrfTopologyCanvas.
code = code.replace(/vrfRooms=\{vrfRooms\}/g, 'vrfRooms={vrfResults.enrichedRooms}');

// For the room list rendering in MechanicalCalc:
// `{vrfRooms.map(room => (`
code = code.replace(/\{vrfRooms\.map\(room => \(/g, '{vrfResults.enrichedRooms.map(room => (');

// Wait! When adding a new room, we don't need to save tons and watts, but we can, it doesn't hurt.
// And what about `vrfRooms.length`? It's fine to keep using `vrfRooms.length`.

fs.writeFileSync(file, code);
