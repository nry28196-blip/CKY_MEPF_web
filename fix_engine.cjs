const fs = require('fs');

let content = fs.readFileSync('src/lib/VentilationEngine.ts', 'utf8');

// Replace imports
content = content.replace(
  /import \{ Ashrae621DensityService, DensityInput, DensityResult \} from '\.\.\/calculations\/ventilation\/Ashrae621DensityService';/,
  "import { DensityCorrectionService, DensityInput, DensityResult } from './DensityCorrectionService';"
);

// Replace usages
content = content.replace(/Ashrae621DensityService\.calculateDensityCorrection/g, "DensityCorrectionService.calculate");

fs.writeFileSync('src/lib/VentilationEngine.ts', content);
