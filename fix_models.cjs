const fs = require('fs');

// 1. Update VentilationModels.ts
let modelsCode = fs.readFileSync('src/models/VentilationModels.ts', 'utf8');
const interfaceCode = `
export interface VentilationSpaceType {
  id: string;
  name: string;
  standard: string;
  edition: string;
  category: string;
  rpImp: number; // CFM/person
  raImp: number; // CFM/ft2
  rpMetric: number; // L/s/person
  raMetric: number; // L/s/m2
  defaultOccupancyImp: number; // people/1000 ft2
  defaultOccupancyMetric: number; // people/100 m2
  exhaustRequired: boolean;
  exhaustCategory?: string;
  notes?: string;
  reference?: string;
}
`;
fs.writeFileSync('src/models/VentilationModels.ts', modelsCode + '\n' + interfaceCode);

// 2. Read SpaceTypesData.ts, update it and write to SpaceTypes.ts
let spaceData = fs.readFileSync('src/calculations/data/ashrae621/SpaceTypesData.ts', 'utf8');
// Remove the interface declaration
spaceData = spaceData.replace(/export interface VentilationSpaceType \{[\s\S]*?\}/, "import { VentilationSpaceType } from '../../../models/VentilationModels';");
fs.writeFileSync('src/calculations/data/ashrae621/SpaceTypes.ts', spaceData);
fs.unlinkSync('src/calculations/data/ashrae621/SpaceTypesData.ts');

// 3. Update Ashrae621Service.ts to use SpaceTypes.ts and use VentilationSpaceType from models
let serviceCode = fs.readFileSync('src/calculations/ventilation/Ashrae621Service.ts', 'utf8');
serviceCode = serviceCode.replace("import { VentilationSpaceType, ASHRAE_62_1_2022_SPACES, ASHRAE_62_1_2019_SPACES, ASHRAE_62_1_2025_SPACES } from '../data/ashrae621/SpaceTypesData';",
"import { VentilationSpaceType } from '../../models/VentilationModels';\nimport { ASHRAE_62_1_2022_SPACES, ASHRAE_62_1_2019_SPACES, ASHRAE_62_1_2025_SPACES } from '../data/ashrae621/SpaceTypes';");

fs.writeFileSync('src/calculations/ventilation/Ashrae621Service.ts', serviceCode);
