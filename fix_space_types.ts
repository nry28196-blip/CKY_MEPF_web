import fs from 'fs';

let content = fs.readFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', 'utf8');

// The array starts at "export const ASHRAE_62_1_2025_SPACES"
const targetStart = "export const ASHRAE_62_1_2025_SPACES: VentilationSpaceType[] = [";
const idx = content.indexOf(targetStart);
if (idx !== -1) {
  // Replace everything from targetStart to the end of the file with the JSON import logic
  // Wait, first let's see if there are other exports after it.
}
