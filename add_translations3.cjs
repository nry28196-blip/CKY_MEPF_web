const fs = require('fs');
let content = fs.readFileSync('src/lib/translations.tsx', 'utf8');

const enInsert = `
    vrfDiversityTooltip: "Accounts for non-coincidence of peak loads across multiple zones (Standard: 1.1 - 1.25).",
    refrigerantTooltip: "Select refrigerant fluid type to adjust density and global warming potential (GWP) thresholds based on modern compliance standards.",
    pipingMatTooltip: "Type of piping material. Determines internal roughness coefficient for pressure drop calculations and refrigerant friction losses.",
    pipeLenTooltip: "Physical length of the main refrigerant liquid line. Impacts additional refrigerant charge.",
    syncTopologyTooltip: "Automatically sync piping length from the drawn 2D topology canvas diagram.",
    autoSizeTooltip: "Auto-sized logic applies standard diversity factoring. Manual override lets you specify exact HP condensing unit hardware.",
    unitCapTooltip: "Standard industry capacities for variable refrigerant flow condensing units. Overriding may trigger capacity ratio warnings.",
    capRatioTooltip: "Capacity Ratio limit. 130% is standard for VRF to prevent compressor short-cycling and ensure adequate part-load efficiency.",
    manualUnitTooltip: "Manually define an indoor unit capacity and location for the VRF circuit.",`;

const kmInsert = `
    vrfDiversityTooltip: "គិតគូរពីការមិនស្របគ្នានៃបន្ទុកអតិបរមានៅទូទាំងតំបន់ច្រើន (ស្តង់ដារ: 1.1 - 1.25)។",
    refrigerantTooltip: "ជ្រើសរើសប្រភេទសារធាតុរាវត្រជាក់ ដើម្បីលៃតម្រូវដង់ស៊ីតេ និងកម្រិតឡើងកម្តៅផែនដី (GWP) ផ្អែកលើស្តង់ដារ។",
    pipingMatTooltip: "ប្រភេទសម្ភារៈបំពង់។ កំណត់មេគុណកកិតខាងក្នុងសម្រាប់ការគណនាការធ្លាក់ចុះសម្ពាធ និងការបាត់បង់កកិត។",
    pipeLenTooltip: "ប្រវែងជាក់ស្តែងនៃបំពង់រាវត្រជាក់មេ។ ប៉ះពាល់ដល់ការបញ្ចូលសារធាតុត្រជាក់បន្ថែម។",
    syncTopologyTooltip: "ធ្វើសមកាលកម្មប្រវែងបំពង់ដោយស្វ័យប្រវត្តិពីគំនូរបណ្តាញ 2D។",
    autoSizeTooltip: "ការគណនាទំហំស្វ័យប្រវត្តិអនុវត្តកត្តាផ្សេងៗស្តង់ដារ។ ការបដិសេធដោយដៃអនុញ្ញាតឱ្យអ្នកបញ្ជាក់ពីផ្នែករឹងម៉ាស៊ីនពិតប្រាកដ។",
    unitCapTooltip: "សមត្ថភាពឧស្សាហកម្មស្តង់ដារសម្រាប់ម៉ាស៊ីនត្រជាក់ VRF។ ការបដិសេធអាចបណ្តាលឱ្យមានការព្រមានអំពីសមាមាត្រសមត្ថភាព។",
    capRatioTooltip: "ដែនកំណត់សមាមាត្រសមត្ថភាព។ 130% គឺជាស្តង់ដារសម្រាប់ VRF ដើម្បីការពារបញ្ហា និងធានាប្រសិទ្ធភាព។",
    manualUnitTooltip: "កំណត់សមត្ថភាពម៉ាស៊ីនក្នុង និងទីតាំងដោយដៃសម្រាប់ប្រព័ន្ធ VRF។",`;

content = content.replace(
  '    occupantTooltip: "ASHRAE Standard 62.1 dictates breathing zone outdoor air per person. Adjust to calculate precise sensible and latent human loads.",',
  '    occupantTooltip: "ASHRAE Standard 62.1 dictates breathing zone outdoor air per person. Adjust to calculate precise sensible and latent human loads.",' + enInsert
);

content = content.replace(
  '    occupantTooltip: "ស្តង់ដារ ASHRAE 62.1 កំណត់ខ្យល់ខាងក្រៅសម្រាប់មនុស្សម្នាក់។ លៃតម្រូវដើម្បីគណនាបន្ទុកកម្តៅមនុស្សជាក់លាក់។",',
  '    occupantTooltip: "ស្តង់ដារ ASHRAE 62.1 កំណត់ខ្យល់ខាងក្រៅសម្រាប់មនុស្សម្នាក់។ លៃតម្រូវដើម្បីគណនាបន្ទុកកម្តៅមនុស្សជាក់លាក់។",' + kmInsert
);

fs.writeFileSync('src/lib/translations.tsx', content, 'utf8');

let mech = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');
mech = mech.replace('tooltip="Accounts for non-coincidence of peak loads across multiple zones (Standard: 1.1 - 1.25)."', 'tooltip={t("vrfDiversityTooltip")}');
mech = mech.replace('tooltip="Select refrigerant fluid type to adjust density and global warming potential (GWP) thresholds based on modern compliance standards."', 'tooltip={t("refrigerantTooltip")}');
mech = mech.replace('tooltip="Type of piping material. Determines internal roughness coefficient for pressure drop calculations and refrigerant friction losses."', 'tooltip={t("pipingMatTooltip")}');
mech = mech.replace('tooltip="Physical length of the main refrigerant liquid line. Impacts additional refrigerant charge."', 'tooltip={t("pipeLenTooltip")}');
mech = mech.replace('tooltip="Automatically sync piping length from the drawn 2D topology canvas diagram."', 'tooltip={t("syncTopologyTooltip")}');
mech = mech.replace('tooltip="Auto-sized logic applies standard diversity factoring. Manual override lets you specify exact HP condensing unit hardware."', 'tooltip={t("autoSizeTooltip")}');
mech = mech.replace('tooltip="Standard industry capacities for variable refrigerant flow condensing units. Overriding may trigger capacity ratio warnings."', 'tooltip={t("unitCapTooltip")}');
mech = mech.replace(/tooltip="Capacity Ratio limit\. 130% is standard for VRF to prevent compressor short-cycling and ensure adequate part-load efficiency\."/g, 'tooltip={t("capRatioTooltip")}');
mech = mech.replace('tooltip="Manually define an indoor unit capacity and location for the VRF circuit."', 'tooltip={t("manualUnitTooltip")}');
fs.writeFileSync('src/components/MechanicalCalc.tsx', mech, 'utf8');
