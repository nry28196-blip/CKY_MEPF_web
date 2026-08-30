const fs = require('fs');

let content = fs.readFileSync('src/lib/translations.tsx', 'utf8');

// EN replacements
const enSection = `    // Mechanical
    mechCoolingTitle: "Cooling Load Sizing",`;
const enInsert = `    // Mechanical
    thermalInputs: "Thermal Inputs",
    estimationBasisTooltip: "Estimation basis logic per ASHRAE Fundamentals Chapter 18 (Non-residential Cooling and Heating Load Calculations).",
    floorAreaTooltip: "Total conditioned floor area. Used to estimate generalized sensible cooling loads (W/m²) per ASHRAE 90.1 standard building types.",
    roomVolumeTooltip: "Room volumetric footprint used for psychrometric air change rates (ACH) and precise infiltration load estimations.",
    mechCoolingTitle: "Cooling Load Sizing",`;
content = content.replace(enSection, enInsert);

// KM replacements
const kmSection = `    // Mechanical
    mechCoolingTitle: "ទំហំបន្ទុកម៉ាស៊ីនត្រជាក់",`;
const kmInsert = `    // Mechanical
    thermalInputs: "ទិន្នន័យកម្តៅ (THERMAL INPUTS)",
    estimationBasisTooltip: "ការប៉ាន់ស្មានផ្អែកលើ ASHRAE Fundamentals Chapter 18 (Non-residential Cooling and Heating Load Calculations)។",
    floorAreaTooltip: "ផ្ទៃក្រឡាសរុបដែលបានកំណត់។ ប្រើដើម្បីប៉ាន់ស្មានបន្ទុកកម្តៅទូទៅ (W/m²) យោងតាម ASHRAE 90.1 standard building types។",
    roomVolumeTooltip: "ទំហំមាឌបន្ទប់ដែលប្រើប្រាស់សម្រាប់អត្រាផ្លាស់ប្តូរខ្យល់ (ACH) និងការប៉ាន់ស្មានបន្ទុកជ្រៀតចូលច្បាស់លាស់។",
    mechCoolingTitle: "ទំហំបន្ទុកម៉ាស៊ីនត្រជាក់",`;
content = content.replace(kmSection, kmInsert);

fs.writeFileSync('src/lib/translations.tsx', content, 'utf8');
