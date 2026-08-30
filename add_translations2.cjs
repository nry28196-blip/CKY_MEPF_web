const fs = require('fs');
let content = fs.readFileSync('src/lib/translations.tsx', 'utf8');

const enSection = `    roomVolumeTooltip: "Room volumetric footprint used for psychrometric air change rates (ACH) and precise infiltration load estimations.",`;
const enInsert = `    roomVolumeTooltip: "Room volumetric footprint used for psychrometric air change rates (ACH) and precise infiltration load estimations.",
    occupantTooltip: "ASHRAE Standard 62.1 dictates breathing zone outdoor air per person. Adjust to calculate precise sensible and latent human loads.",`;
content = content.replace(enSection, enInsert);

const kmSection = `    roomVolumeTooltip: "ទំហំមាឌបន្ទប់ដែលប្រើប្រាស់សម្រាប់អត្រាផ្លាស់ប្តូរខ្យល់ (ACH) និងការប៉ាន់ស្មានបន្ទុកជ្រៀតចូលច្បាស់លាស់។",`;
const kmInsert = `    roomVolumeTooltip: "ទំហំមាឌបន្ទប់ដែលប្រើប្រាស់សម្រាប់អត្រាផ្លាស់ប្តូរខ្យល់ (ACH) និងការប៉ាន់ស្មានបន្ទុកជ្រៀតចូលច្បាស់លាស់។",
    occupantTooltip: "ស្តង់ដារ ASHRAE 62.1 កំណត់ខ្យល់ខាងក្រៅសម្រាប់មនុស្សម្នាក់។ លៃតម្រូវដើម្បីគណនាបន្ទុកកម្តៅមនុស្សជាក់លាក់។",`;
content = content.replace(kmSection, kmInsert);

fs.writeFileSync('src/lib/translations.tsx', content, 'utf8');

let mech = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');
mech = mech.replace(
  'tooltip="ASHRAE Standard 62.1 dictates breathing zone outdoor air per person. Adjust to calculate precise sensible and latent human loads."',
  'tooltip={t("occupantTooltip")}'
);
fs.writeFileSync('src/components/MechanicalCalc.tsx', mech, 'utf8');
