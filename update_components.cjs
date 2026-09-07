const fs = require('fs');

// Ashrae621VentilationCalc.tsx
let calc621 = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');
calc621 = calc621.replace(/const spaceTypes = edition === '2019' \? ASHRAE_621_2019_SPACE_TYPES : edition === '2022' \? ASHRAE_621_2022_SPACE_TYPES : ASHRAE_621_2025_SPACE_TYPES;/g, 
  "const spaceTypes = StandardDataProvider.get621SpaceTypes(edition);");
calc621 = calc621.replace(/const ezValues = edition === '2019' \? ASHRAE_621_2019_EZ_VALUES : edition === '2022' \? ASHRAE_621_2022_EZ_VALUES : ASHRAE_621_2025_EZ_VALUES;/g, 
  "const ezValues = StandardDataProvider.get621EzValues(edition);");
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', calc621);

// ResidentialVentilationCalc.tsx
let resCalc = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf8');
resCalc = resCalc.replace(/import \{ ASHRAE_622_2025_COEFFICIENTS \} from '\.\.\/data\/ventilation\/ashrae622\/2025\/data';/, 
  "import { StandardDataProvider } from '../data/ventilation/StandardDataProvider';");
resCalc = resCalc.replace(/import \{ ASHRAE_622_2022_COEFFICIENTS \} from '\.\.\/data\/ventilation\/ashrae622\/2022\/data';/, "");
resCalc = resCalc.replace(/import \{ ASHRAE_622_2019_COEFFICIENTS \} from '\.\.\/data\/ventilation\/ashrae622\/2019\/data';/, "");
resCalc = resCalc.replace(/let coefficients = ASHRAE_622_2025_COEFFICIENTS;\s*if \(edition === '2022'\) coefficients = ASHRAE_622_2022_COEFFICIENTS;\s*else if \(edition === '2019'\) coefficients = ASHRAE_622_2019_COEFFICIENTS;/g, 
  "const coefficients = StandardDataProvider.get622Coefficients(edition);");
fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', resCalc);

// Ashrae621ExhaustCalc.tsx
let exhCalc = fs.readFileSync('src/components/Ashrae621ExhaustCalc.tsx', 'utf8');
exhCalc = exhCalc.replace(/import \{ ASHRAE_621_2025_EXHAUST_RATES \} from '\.\.\/data\/ventilation\/ashrae621\/2025\/data';/, 
  "import { StandardDataProvider } from '../data/ventilation/StandardDataProvider';");
exhCalc = exhCalc.replace(/import \{ ASHRAE_621_2022_EXHAUST_RATES \} from '\.\.\/data\/ventilation\/ashrae621\/2022\/data';/, "");
exhCalc = exhCalc.replace(/import \{ ASHRAE_621_2019_EXHAUST_RATES \} from '\.\.\/data\/ventilation\/ashrae621\/2019\/data';/, "");
exhCalc = exhCalc.replace(/const exhaustRates = edition === '2019' \? ASHRAE_621_2019_EXHAUST_RATES : edition === '2022' \? ASHRAE_621_2022_EXHAUST_RATES : ASHRAE_621_2025_EXHAUST_RATES;/g, 
  "const exhaustRates = StandardDataProvider.get621ExhaustRates(edition);");
fs.writeFileSync('src/components/Ashrae621ExhaustCalc.tsx', exhCalc);
