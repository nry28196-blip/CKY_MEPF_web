import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageType = 'en' | 'km';

export const translations: Record<LanguageType, Record<string, string>> = {
  en: {
    appTitle: "CKY_MEPF",
    appSubtitle: "Engineering Calculation Suite",
    formulaBtn: "Engineering Formulas",
    formulaBtnShort: "Formulas",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    autoCalc: "Auto-Calc",
    assistantTitle: "Advanced Design Assistant",
    recentRuns: "Recent Runs",
    clear: "Clear",
    noRecentRuns: "No recent calculations. Run a calculation to save.",
    quickConverters: "Quick Unit Converters",
    saveCalculation: "Save Run",
    calculateBtn: "Calculate Now",
    loading: "Loading...",
    
    // Tabs
    mechanical: "Mechanical / HVAC",
    electrical: "Electrical FLC",
    plumbing: "Plumbing Velocity",
    fire: "FIRE FIGHTING",

    // Mechanical
    mechCoolingTitle: "Cooling Load Sizing",
    mechDuctSizingTitle: "Duct Sizing",
    mechVentilationTitle: "Ventilation System",
    estimationBasis: "Estimation Basis",
    floorArea: "Floor Area",
    roomVolume: "Room Volume",
    occupantDensity: "Occupants Count",
    coolingLoadResult: "Estimated Cooling Capacity",
    totalPower: "Total Power",
    watts: "Watts",
    btuHr: "BTU/hr",
    tonsRef: "Tons (TR)",
    ductAirflow: "Design Airflow",
    frictionRate: "Friction Rate",
    ductHeight: "Duct Height",
    mainDuctCirc: "Circular Main Duct",
    hydraulicDiam: "Hydraulic Diam.",
    mainDuctRect: "Rectangular Main Duct",
    aspectRatio: "Aspect Ratio",
    velocityRound: "Velocity (Round)",
    velocityRect: "Velocity (Rect)",
    downstreamBranches: "Downstream Branches",
    numBranches: "Number of Branches",
    branchSizing: "Branch Sizing Breakdown",
    ductSizingVelocityHeader: "Duct Sizing (Velocity Method)",
    coolingThermalHeader: "Cooling Thermal Load Sizing",

    // Electrical
    elecTitle: "Electrical Load Calculation",
    elecDesc: "Determine full load current (FLC) and recommended circuit breaker sizes.",
    loadPower: "Load Power",
    phaseType: "Phase Configuration",
    singlePhase: "1-Phase (230V)",
    threePhase: "3-Phase (400V)",
    voltage: "System Voltage",
    powerFactor: "Power Factor (Cos φ)",
    currentAmps: "Full Load Current (FLC)",
    amps: "Amps",
    circuitBreaker: "Suggested Breaker",
    breakerDesc: "Sized at 125% of FLC according to standard engineering margins.",

    // Plumbing
    plumbingTitle: "Plumbing Fixture Unit Demand",
    plumbingDesc: "Calculate total water demand in loading units and flow rate according to DIN 1988/BS 6700.",
    fixtureType: "Fixture Classification",
    domestic: "Domestic (Residential)",
    commercial: "Commercial (Office/Retail)",
    industrial: "Industrial / Public",
    loadingUnits: "Total Loading Units (LU)",
    estimatedFlow: "Estimated Water Demand",
    flowLps: "Flow Rate (L/s)",
    pipeDiameter: "Suggested Pipe Diameter",
    pipeDiamDesc: "Sized to maintain water velocity below recommended limit (~1.5 m/s).",

    // Fire
    fireTitle: "Fire Sprinkler Sizing",
    fireDesc: "Calculate target water pressure, flow rates, and tank sizing for fire protection systems.",
    hazardClassification: "Hazard Classification",
    lightHazard: "Light Hazard (LH)",
    ordinaryHazard: "Ordinary Hazard (OH)",
    extraHazard: "Extra Hazard (EH)",
    designArea: "Design Protection Area",
    dischargeDensity: "Discharge Density",
    requiredFlow: "Required Sprinkler Flow",
    sprinklerDuration: "Required Duration",
    waterStorage: "Minimum Water Storage",
    m3: "m³",
    liters: "Liters",

    // Notifications
    toastParamsRestored: "Parameters loaded!",
    toastCalculationSaved: "Calculation saved to history!",
    toastCalculationsUpdated: "Calculations updated!",

    // Buttons & Actions
    saveIteration: "Save Iteration",
    copyReport: "Copy Report",
    exportCsv: "Export CSV",
    exportBOQ: "Export BOQ",
    shareEmail: "Share Email",

    // Sidebar units
    unitFlow: "Flow Rate",
    unitPressure: "Pressure",
    unitTemp: "Temperature",
    unitPower: "Power",
  },
  km: {
    appTitle: "CKY_MEPF",
    appSubtitle: "ប្រព័ន្ធគណនាវិស្វកម្ម MEPF",
    formulaBtn: "រូបមន្តវិស្វកម្ម",
    formulaBtnShort: "រូបមន្ត",
    lightMode: "ពន្លឺ",
    darkMode: "ងងឹត",
    autoCalc: "គណនាស្វ័យប្រវត្ត",
    assistantTitle: "ជំនួយការរចនាកម្រិតខ្ពស់",
    recentRuns: "ការគណនាថ្មីៗ",
    clear: "សម្អាត",
    noRecentRuns: "មិនទាន់មានការគណនាថ្មីៗទេ។ គណនាដើម្បីរក្សាទុក។",
    quickConverters: "បម្លែងឯកតារហ័ស",
    saveCalculation: "រក្សាទុកការគណនា",
    calculateBtn: "គណនាឥឡូវនេះ",
    loading: "កំពុងដំណើរការ...",

    // Tabs
    mechanical: "មេកានិច / HVAC",
    electrical: "អគ្គិសនី FLC",
    plumbing: "ទឹក និងលូ",
    fire: "ប្រព័ន្ធពន្លត់អគ្គីភ័យ",

    // Mechanical
    mechCoolingTitle: "ទំហំបន្ទុកម៉ាស៊ីនត្រជាក់",
    mechDuctSizingTitle: "ទំហំបំពង់ខ្យល់",
    mechVentilationTitle: "ប្រព័ន្ធខ្យល់ចេញចូល",
    estimationBasis: "មូលដ្ឋានប៉ាន់ស្មាន",
    floorArea: "ផ្ទៃក្រឡាកម្រាល",
    roomVolume: "មាឌបន្ទប់",
    occupantDensity: "ចំនួនមនុស្សនៅក្នុងបន្ទប់",
    coolingLoadResult: "សមត្ថភាពម៉ាស៊ីនត្រជាក់ប៉ាន់ស្មាន",
    totalPower: "ថាមពលសរុប",
    watts: "វ៉ាត់ (W)",
    btuHr: "BTU/ម៉ោង",
    tonsRef: "តោនត្រជាក់ (TR)",
    navyAirflow: "លំហូរខ្យល់រចនា",
    frictionRate: "អត្រាកកិត",
    ductHeight: "កម្ពស់បំពង់ខ្យល់",
    mainDuctCirc: "បំពង់ខ្យល់មេរង្វង់",
    hydraulicDiam: "អង្កត់ផ្ចិតអ៊ីដ្រូលីក",
    mainDuctRect: "បំពង់ខ្យល់មេចតុកោណ",
    aspectRatio: "សមាមាត្រជ្រុង",
    velocityRound: "ល្បឿនខ្យល់ (បំពង់មូល)",
    velocityRect: "ល្បឿនខ្យល់ (បំពង់ចតុកោណ)",
    downstreamBranches: "បំពង់ខ្នែងបន្តបន្ទាប់",
    numBranches: "ចំនួនបំពង់ខ្នែង",
    branchSizing: "ទំហំបំពង់ខ្នែងលម្អិត",
    ductSizingVelocityHeader: "ការគណនាបំពង់ខ្យល់ (Velocity Method)",
    coolingThermalHeader: "ការគណនាបន្ទុកកម្ដៅម៉ាស៊ីនត្រជាក់",

    // Electrical
    elecTitle: "ការគណនាបន្ទុកអគ្គិសនី",
    elecDesc: "គណនាចរន្តបន្ទុកពេញលេញ (FLC) និងទំហំឌីសង់ទ័រដែលសមស្រប។",
    loadPower: "ថាមពលបន្ទុក",
    phaseType: "ការកំណត់ហ្វារ",
    singlePhase: "ហ្វារទោល 1-Phase (230V)",
    threePhase: "ហ្វារបី 3-Phase (400V)",
    voltage: "តង់ស្យុងប្រព័ន្ធ",
    powerFactor: "កត្តាថាមពល (Cos φ)",
    currentAmps: "ចរន្តបន្ទុកពេញលេញ (FLC)",
    amps: "អំពែរ (A)",
    circuitBreaker: "ឌីសង់ទ័រដែលណែនាំ",
    breakerDesc: "ទំហំស្មើនឹង ១២៥% នៃចរន្ត FLC តាមស្តង់ដារវិស្វកម្ម។",

    // Plumbing
    plumbingTitle: "បន្ទុកឧបករណ៍ផ្គត់ផ្គង់ទឹក",
    plumbingDesc: "គណនាតម្រូវការទឹកសរុបជាឯកតាបន្ទុក (LU) និងលំហូរទឹកតាមស្តង់ដារ DIN 1988/BS 6700។",
    fixtureType: "ប្រភេទអគារ/ឧបករណ៍",
    domestic: "លំនៅដ្ឋាន (Residential)",
    commercial: "ការិយាល័យ/ពាណិជ្ជកម្ម",
    industrial: "ឧស្សហកម្ម / សាធារណៈ",
    loadingUnits: "ឯកតាបន្ទុករួម (LU)",
    estimatedFlow: "តម្រូវការទឹកប៉ាន់ស្មាន",
    flowLps: "អត្រាលំហូរ (L/s)",
    pipeDiameter: "ទំហំបំពង់ទឹកដែលណែនាំ",
    pipeDiamDesc: "រចនាឡើងដើម្បីរក្សាល្បឿនទឹកឱ្យនៅក្រោមដែនកំណត់ (~1.5 m/s)។",

    // Fire
    fireTitle: "ទំហំប្រព័ន្ធពន្លត់អគ្គីភ័យ",
    fireDesc: "គណនាសម្ពាធទឹក អត្រាលំហូរ និងទំហំអាងស្តុកទឹកសម្រាប់ប្រព័ន្ធពន្លត់អគ្គីភ័យ។",
    hazardClassification: "ចំណាត់ថ្នាក់គ្រោះថ្នាក់",
    lightHazard: "គ្រោះថ្នាក់កម្រិតស្រាល (LH)",
    ordinaryHazard: "គ្រោះថ្នាក់កម្រិតមធ្យម (OH)",
    extraHazard: "គ្រោះថ្នាក់កម្រិតខ្ពស់ (EH)",
    designArea: "ផ្ទៃដីការពារពន្លត់",
    dischargeDensity: "កំហាប់ទឹកបាញ់ចេញ",
    requiredFlow: "លំហូរទឹកពន្លត់ដែលត្រូវការ",
    sprinklerDuration: "រយៈពេលបាញ់ទឹកបញ្ជាក់",
    waterStorage: "មាឌអាងស្តុកទឹកអប្បបរមា",
    m3: "ម៉ែត្រគូប (m³)",
    liters: "លីត្រ (L)",

    // Notifications
    toastParamsRestored: "បានបញ្ចូលប៉ារ៉ាម៉ែត្ររួចរាល់!",
    toastCalculationSaved: "បានរក្សាទុកការគណនាទៅក្នុងប្រវត្តិ!",
    toastCalculationsUpdated: "បានធ្វើបច្ចុប្បន្នភាពការគណនា!",

    // Buttons & Actions
    saveIteration: "រក្សាទុកការគណនា",
    copyReport: "ចម្លងរបាយការណ៍",
    exportCsv: "នាំចេញជា CSV",
    exportBOQ: "នាំចេញតារាង BOQ",
    shareEmail: "ចែករំលែកអ៊ីមែល",

    // Sidebar units
    unitFlow: "អត្រាលំហូរ",
    unitPressure: "សម្ពាធ",
    unitTemp: "សីតុណ្ហភាព",
    unitPower: "ថាមពល",
  }
};

interface LanguageContextProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
  isKhmer: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    try {
      const saved = localStorage.getItem('cky_mepf_language');
      return (saved === 'km' ? 'km' : 'en') as LanguageType;
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('cky_mepf_language', lang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: string): string => {
    const section = translations[language];
    if (section && section[key]) {
      return section[key];
    }
    // Fallback to English
    const fallbackSection = translations['en'];
    if (fallbackSection && fallbackSection[key]) {
      return fallbackSection[key];
    }
    return key;
  };

  const isKhmer = language === 'km';

  // Set document lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'km') {
      document.body.classList.add('font-khmer');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.remove('font-khmer');
      document.body.classList.add('font-sans');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isKhmer }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
