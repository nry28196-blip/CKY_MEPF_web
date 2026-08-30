const fs = require('fs');
let content = fs.readFileSync('src/lib/translations.tsx', 'utf8');

const enInsert = `
    // Tooltips
    powerFactorTooltip: "Influences the total Apparent Power (kVA). Typical design range for server/IT loads: 0.90 to 0.99.",
    safetyFactorTooltip: "Safety factor applied to the total load. Typical design range: 1.2 to 1.3 (20% to 30% margin) to accommodate future expansion.",
    autonomyTooltip: "Required autonomy time. Determines the total Ampere-hour (Ah) capacity required from the battery string.",
    wallMountedTooltip: "Wall-mounted canopies require less airflow than island canopies due to the wall preventing cross-drafts.",
    dutyLevelTooltip: "Light (ovens, steamers), Medium (griddles, fryers), Heavy (charbroilers), Extra Heavy (solid fuel).",
    cookLineTooltip: "Total length of the cooking equipment line.",
    hoodExtTooltip: "Hood extension beyond the equipment on each side (Standard minimum is 6 inches or 0.15m).",
    ductVelTooltip: "Code typically requires a minimum grease duct velocity of 500 FPM (2.5 m/s). Typical design range: 1500 - 2200 FPM (7.6 - 11 m/s) to keep grease particulates entrained.",
    floorAreaVentTooltip: "Total occupiable floor area of the zone.",
    occupantsTooltip: "Number of people in the zone.",
    ezTooltip: "Table 6.2.2.2 typical design limits: 1.0 (Ceiling cooling), 0.8 (Ceiling heating, T_sup > T_room + 15°F), 1.2 (Floor supply).",
    airTempTooltip: "Adjust calculations to reflect actual air density based on temperature, converting Standard volume to Actual volume.",
    vbzTooltip: "ASHRAE 62.1-2019 Sec 6.2.2.1: Vbz represents the ventilation required directly in the breathing zone for occupants, before accounting for distribution losses.",
    vozTooltip: "ASHRAE 62.1-2019 Sec 6.2.2.3: Voz represents the total ventilation that must be provided to the zone by the supply system to ensure Vbz is satisfied, accounting for mixing effectiveness (Ez).",
    phaseTooltip: "Electrical phase distribution. Three-phase formulas include the square root of 3 (1.732) in standard power calculations.",
    loadPowerTooltip: "Apparent Power (kVA) or Real Power (kW) input requirement of the mechanical or electrical equipment.",
    voltageTooltipThree: "Line-to-Line voltage for 3-phase systems. Typical design range: 400V (EU/UK/Asia/ME) or 480V (US).",
    voltageTooltipSingle: "Line-to-Neutral voltage for single-phase systems. Typical design range: 230V (EU/UK/Asia/ME) or 120V (US).",
    pfTooltip: "Ratio of real working power to apparent power. Typical values: 0.85 (motors), 0.95 (lighting), 1.0 (resistive heating).",
    waterVelTooltip: "Maximum allowable velocity in water distribution pipes to prevent water hammer and excessive noise. Typical range: 1.2 to 2.4 m/s (4 to 8 ft/s).",
    slopeTooltip: "Minimum slope per IPC to maintain self-cleansing velocity. Typical design range: 1% (1/8 in/ft) for pipes ≥ 3 inches, or 2% (1/4 in/ft) for pipes < 3 inches.",
    dailyConsumpTooltip: "Average daily domestic cold water consumption. Values vary by building class (e.g. 150-250 L/p/d for residential).",
    soilAbsTooltip: "Soil absorption rate per person. Used to size primary anaerobic breakdown chambers per WHO/local health standards.",
    residualPresTooltip: "Required residual pressure at the highest/most hydraulically remote fixture per IPC (typically 1.0 - 2.0 bar).",
    mainAirflowTooltip: "Total air volume flow rate entering the main duct branch.",
    frictionLossTooltip: "Target pressure drop per unit length. Typical design range: 0.08 to 0.12 in. wg/100 ft (0.8 - 1.2 Pa/m) for standard low-pressure systems.",
    ductTypeTooltip: "Determines the target reference velocity ranges based on the application.",
    maxVelSupply: "Maximum allowable air velocity. Typical Supply Range: 1000 - 2000 FPM (5 - 10 m/s).",
    maxVelReturn: "Maximum allowable air velocity. Typical Return Range: 800 - 1500 FPM (4 - 7.5 m/s).",
    maxVelExhaust: "Maximum allowable air velocity. Typical Exhaust Range: 1500 - 2500 FPM (7.5 - 12.5 m/s).",
    ductHeightTooltip: "Fixed vertical dimension of rectangular duct. Width will be calculated.",
    totalHeadsTooltip: "Total facility sprinkler heads. Used to estimate total system volume and secondary water reserve mandates.",
    hoseReelsTooltip: "Class II/III standpipe hose reels. Adds supplemental concurrent flow demands per NFPA 14.",
    staticHeadTooltip: "Vertical distance from the fire pump to the highest hydraulic sprinkler or hose connection. Determines minimum static pressure.",
    pumpEffTooltip: "Pump mechanical efficiency factor (typically 65-75% for horizontal split-case pumps) used to calculate motor brake horsepower.",
`;

const kmInsert = `
    // Tooltips
    powerFactorTooltip: "ជះឥទ្ធិពលដល់ថាមពលសរុប (kVA)។ កម្រិតស្តង់ដារសម្រាប់ IT/Server: 0.90 ដល់ 0.99។",
    safetyFactorTooltip: "កត្តាសុវត្ថិភាពអនុវត្តលើបន្ទុកសរុប។ កម្រិតរចនាស្តង់ដារ: 1.2 ដល់ 1.3 (20% ទៅ 30%) សម្រាប់ការប្រើប្រាស់ពេលអនាគត។",
    autonomyTooltip: "ពេលវេលាដំណើរការទាមទារ។ កំណត់សមត្ថភាពសរុប Ampere-hour (Ah) ដែលទាមទារពីថ្ម។",
    wallMountedTooltip: "គម្របហឺតជាប់ជញ្ជាំងត្រូវការខ្យល់តិចជាងគម្របកណ្តាល ព្រោះជញ្ជាំងការពារខ្យល់បោកបក់។",
    dutyLevelTooltip: "ស្រាល (ឡ, ម៉ាស៊ីនចំហុយ), មធ្យម (ខ្ទះ, ឆ្នាំងបំពង), ធ្ងន់ (ចង្ក្រានអាំង), ធ្ងន់ខ្លាំង (ឥន្ធនៈរឹង)។",
    cookLineTooltip: "ប្រវែងសរុបនៃខ្សែឧបករណ៍ចម្អិនអាហារ។",
    hoodExtTooltip: "ការពង្រីកគម្របហឺតឱ្យផុតឧបករណ៍ទាំងសងខាង (ស្តង់ដារអប្បបរមា 6 inches ឬ 0.15m)។",
    ductVelTooltip: "ស្តង់ដារទាមទារល្បឿនបំពង់ខ្លាញ់អប្បបរមា 500 FPM (2.5 m/s)។ កម្រិតរចនាស្តង់ដារ: 1500 - 2200 FPM ដើម្បីរក្សាភាគល្អិតខ្លាញ់កុំឲ្យស្ទះ។",
    floorAreaVentTooltip: "ផ្ទៃក្រឡាកម្រាលដែលអាចរស់នៅបានសរុបនៅក្នុងតំបន់។",
    occupantsTooltip: "ចំនួនមនុស្សនៅក្នុងតំបន់។",
    ezTooltip: "Table 6.2.2.2 កម្រិតរចនាស្តង់ដារ: 1.0 (ម៉ាស៊ីនត្រជាក់ពិដាន), 0.8 (កម្ដៅពិដាន, T_sup > T_room + 15°F), 1.2 (ប្រព័ន្ធបញ្ចេញខ្យល់តាមកម្រាល)។",
    airTempTooltip: "លៃតម្រូវការគណនាដើម្បីឆ្លុះបញ្ចាំងពីដង់ស៊ីតេខ្យល់ជាក់ស្តែងផ្អែកលើសីតុណ្ហភាព ដោយបំប្លែងពីមាឌស្តង់ដារទៅជាមាឌជាក់ស្តែង។",
    vbzTooltip: "ASHRAE 62.1-2019 Sec 6.2.2.1: Vbz តំណាងឱ្យខ្យល់ដែលត្រូវការដោយផ្ទាល់នៅក្នុងតំបន់ដកដង្ហើមសម្រាប់អ្នករស់នៅ មុនពេលគិតពីការបាត់បង់តាមប្រព័ន្ធខ្យល់។",
    vozTooltip: "ASHRAE 62.1-2019 Sec 6.2.2.3: Voz តំណាងឱ្យខ្យល់សរុបដែលត្រូវផ្គត់ផ្គង់ទៅក្នុងតំបន់ ដើម្បីធានាថា Vbz ត្រូវបានបំពេញ ដោយគិតគូរពីប្រសិទ្ធភាពនៃការលាយបញ្ចូល (Ez)។",
    phaseTooltip: "ប្រភេទប្រព័ន្ធអគ្គិសនី។ រូបមន្ត 3-Phase រួមបញ្ចូលឫសទី 3 (1.732) ក្នុងការគណនាថាមពលស្តង់ដារ។",
    loadPowerTooltip: "តម្រូវការថាមពល (kVA) ឬ ថាមពលពិត (kW) នៃឧបករណ៍មេកានិច ឬអគ្គិសនី។",
    voltageTooltipThree: "តង់ស្យុង Line-to-Line សម្រាប់ប្រព័ន្ធ 3-Phase។ កម្រិតរចនាស្តង់ដារ: 400V (EU/UK/Asia) ឬ 480V (US)។",
    voltageTooltipSingle: "តង់ស្យុង Line-to-Neutral សម្រាប់ប្រព័ន្ធ 1-Phase។ កម្រិតរចនាស្តង់ដារ: 230V (EU/UK/Asia) ឬ 120V (US)។",
    pfTooltip: "សមាមាត្រនៃថាមពលធ្វើការជាក់ស្តែងទៅនឹងថាមពលសរុប។ តម្លៃស្តង់ដារ: 0.85 (ម៉ូទ័រ), 0.95 (ភ្លើង), 1.0 (ឧបករណ៍កម្ដៅ)។",
    waterVelTooltip: "ល្បឿនទឹកអតិបរមានៅក្នុងបំពង់ ដើម្បីការពារការទង្គិចទឹក (water hammer) និងសំឡេងរំខាន។ កម្រិតស្តង់ដារ: 1.2 ដល់ 2.4 m/s។",
    slopeTooltip: "ជម្រាលអប្បបរមាតាម IPC ដើម្បីធានាល្បឿនហូរស្អាតដោយឯកឯង។ កម្រិតរចនាស្តង់ដារ: 1% សម្រាប់បំពង់ ≥ 3 inches ឬ 2% សម្រាប់បំពង់ < 3 inches។",
    dailyConsumpTooltip: "ការប្រើប្រាស់ទឹកត្រជាក់ប្រចាំថ្ងៃជាមធ្យម។ តម្លៃប្រែប្រួលតាមប្រភេទអគារ (ឧ. 150-250 L/p/d សម្រាប់លំនៅដ្ឋាន)។",
    soilAbsTooltip: "អត្រាស្រូបយករបស់ដីសម្រាប់មនុស្សម្នាក់។ ប្រើដើម្បីកំណត់ទំហំអាងប្រព្រឹត្តកម្មតាមស្តង់ដារ WHO។",
    residualPresTooltip: "សម្ពាធទឹកដែលទាមទារនៅឧបករណ៍ដែលខ្ពស់បំផុត ឬឆ្ងាយបំផុតតាម IPC (ជាទូទៅ 1.0 - 2.0 bar)។",
    mainAirflowTooltip: "បរិមាណខ្យល់សរុបដែលហូរចូលបំពង់មេ។",
    frictionLossTooltip: "សម្ពាធធ្លាក់ចុះគោលដៅក្នុងមួយឯកតាប្រវែង។ កម្រិតរចនាស្តង់ដារ: 0.08 ដល់ 0.12 in. wg/100 ft សម្រាប់ប្រព័ន្ធសម្ពាធទាប។",
    ductTypeTooltip: "កំណត់កម្រិតល្បឿនយោងផ្អែកលើប្រភេទការប្រើប្រាស់។",
    maxVelSupply: "ល្បឿនខ្យល់អតិបរមាអនុញ្ញាត។ ល្បឿនផ្គត់ផ្គង់ស្តង់ដារ: 1000 - 2000 FPM (5 - 10 m/s)។",
    maxVelReturn: "ល្បឿនខ្យល់អតិបរមាអនុញ្ញាត។ ល្បឿនត្រលប់ស្តង់ដារ: 800 - 1500 FPM (4 - 7.5 m/s)។",
    maxVelExhaust: "ល្បឿនខ្យល់អតិបរមាអនុញ្ញាត។ ល្បឿនបញ្ចេញស្តង់ដារ: 1500 - 2500 FPM (7.5 - 12.5 m/s)។",
    ductHeightTooltip: "ទំហំបញ្ឈរថេរនៃបំពង់ចតុកោណ។ ទទឹងនឹងត្រូវបានគណនា។",
    totalHeadsTooltip: "ចំនួនក្បាល Sprinkler សរុប។ ប្រើដើម្បីប៉ាន់ស្មានមាឌប្រព័ន្ធសរុប និងតម្រូវការបម្រុងទឹកបន្ថែម។",
    hoseReelsTooltip: "ទុយោទឹក Class II/III។ បន្ថែមតម្រូវការលំហូរទឹកស្របគ្នាតាម NFPA 14។",
    staticHeadTooltip: "ចម្ងាយបញ្ឈរពីម៉ាស៊ីនបូមទៅកាន់ក្បាល Sprinkler ឬទុយោដែលខ្ពស់បំផុត។ កំណត់សម្ពាធឋិតិវន្តអប្បបរមា។",
    pumpEffTooltip: "កត្តាប្រសិទ្ធភាពមេកានិចរបស់ម៉ាស៊ីនបូម (ជាទូទៅ 65-75%) ប្រើដើម្បីគណនាថាមពលម៉ូទ័រ។",
`;

content = content.replace(
  '    mechCoolingTitle: "Cooling Load Sizing",',
  '    mechCoolingTitle: "Cooling Load Sizing",' + enInsert
);

content = content.replace(
  '    mechCoolingTitle: "ទំហំបន្ទុកម៉ាស៊ីនត្រជាក់",',
  '    mechCoolingTitle: "ទំហំបន្ទុកម៉ាស៊ីនត្រជាក់",' + kmInsert
);

fs.writeFileSync('src/lib/translations.tsx', content, 'utf8');
