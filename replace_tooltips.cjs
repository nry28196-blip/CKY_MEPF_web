const fs = require('fs');

const files = [
  'src/components/UpsSizingCalc.tsx',
  'src/components/KitchenVentilationCalc.tsx',
  'src/components/VentilationCalc.tsx',
  'src/components/ElectricalCalc.tsx',
  'src/components/PlumbingCalc.tsx',
  'src/components/DuctSizingCalc.tsx',
  'src/components/FireCalc.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('const { t }')) {
    content = content.replace(
      'export default function', 
      'export default function' // dummy
    );
    // we need to make sure t is available
    if (content.includes('const { isKhmer')) {
       content = content.replace('const { isKhmer', 'const { t, isKhmer');
    }
  }

  // UPS
  content = content.replace('tooltip="Influences the total Apparent Power (kVA). Typical design range for server/IT loads: 0.90 to 0.99."', 'tooltip={t("powerFactorTooltip")}');
  content = content.replace('tooltip="Safety factor applied to the total load. Typical design range: 1.2 to 1.3 (20% to 30% margin) to accommodate future expansion."', 'tooltip={t("safetyFactorTooltip")}');
  content = content.replace('tooltip="Required autonomy time. Determines the total Ampere-hour (Ah) capacity required from the battery string."', 'tooltip={t("autonomyTooltip")}');

  // Kitchen
  content = content.replace('tooltip="Wall-mounted canopies require less airflow than island canopies due to the wall preventing cross-drafts."', 'tooltip={t("wallMountedTooltip")}');
  content = content.replace('tooltip="Light (ovens, steamers), Medium (griddles, fryers), Heavy (charbroilers), Extra Heavy (solid fuel)."', 'tooltip={t("dutyLevelTooltip")}');
  content = content.replace('tooltip="Total length of the cooking equipment line."', 'tooltip={t("cookLineTooltip")}');
  content = content.replace('tooltip="Hood extension beyond the equipment on each side (Standard minimum is 6 inches or 0.15m)."', 'tooltip={t("hoodExtTooltip")}');
  content = content.replace('tooltip="Code typically requires a minimum grease duct velocity of 500 FPM (2.5 m/s). Typical design range: 1500 - 2200 FPM (7.6 - 11 m/s) to keep grease particulates entrained."', 'tooltip={t("ductVelTooltip")}');

  // Ventilation
  content = content.replace('tooltip="Total occupiable floor area of the zone."', 'tooltip={t("floorAreaVentTooltip")}');
  content = content.replace('tooltip="Number of people in the zone."', 'tooltip={t("occupantsTooltip")}');
  content = content.replace('tooltip="Table 6.2.2.2 typical design limits: 1.0 (Ceiling cooling), 0.8 (Ceiling heating, T_sup > T_room + 15°F), 1.2 (Floor supply)."', 'tooltip={t("ezTooltip")}');
  content = content.replace('tooltip="Adjust calculations to reflect actual air density based on temperature, converting Standard volume to Actual volume."', 'tooltip={t("airTempTooltip")}');
  content = content.replace('tooltip="ASHRAE 62.1-2019 Sec 6.2.2.1: Vbz represents the ventilation required directly in the breathing zone for occupants, before accounting for distribution losses."', 'tooltip={t("vbzTooltip")}');
  content = content.replace('tooltip="ASHRAE 62.1-2019 Sec 6.2.2.3: Voz represents the total ventilation that must be provided to the zone by the supply system to ensure Vbz is satisfied, accounting for mixing effectiveness (Ez)."', 'tooltip={t("vozTooltip")}');

  // Electrical
  content = content.replace('tooltip="Electrical phase distribution. Three-phase formulas include the square root of 3 (1.732) in standard power calculations."', 'tooltip={t("phaseTooltip")}');
  content = content.replace('tooltip="Apparent Power (kVA) or Real Power (kW) input requirement of the mechanical or electrical equipment."', 'tooltip={t("loadPowerTooltip")}');
  content = content.replace('tooltip={phase === \'three\' ? "Line-to-Line voltage for 3-phase systems. Typical design range: 400V (EU/UK/Asia/ME) or 480V (US)." : "Line-to-Neutral voltage for single-phase systems. Typical design range: 230V (EU/UK/Asia/ME) or 120V (US)."}', 'tooltip={phase === \'three\' ? t("voltageTooltipThree") : t("voltageTooltipSingle")}');
  content = content.replace('tooltip="Ratio of real working power to apparent power. Typical values: 0.85 (motors), 0.95 (lighting), 1.0 (resistive heating)."', 'tooltip={t("pfTooltip")}');

  // Plumbing
  content = content.replace('tooltip="Maximum allowable velocity in water distribution pipes to prevent water hammer and excessive noise. Typical range: 1.2 to 2.4 m/s (4 to 8 ft/s)."', 'tooltip={t("waterVelTooltip")}');
  content = content.replace('tooltip="Minimum slope per IPC to maintain self-cleansing velocity. Typical design range: 1% (1/8 in/ft) for pipes ≥ 3 inches, or 2% (1/4 in/ft) for pipes < 3 inches."', 'tooltip={t("slopeTooltip")}');
  content = content.replace('tooltip="Average daily domestic cold water consumption. Values vary by building class (e.g. 150-250 L/p/d for residential)."', 'tooltip={t("dailyConsumpTooltip")}');
  content = content.replace('tooltip="Soil absorption rate per person. Used to size primary anaerobic breakdown chambers per WHO/local health standards."', 'tooltip={t("soilAbsTooltip")}');
  content = content.replace('tooltip="Required residual pressure at the highest/most hydraulically remote fixture per IPC (typically 1.0 - 2.0 bar)."', 'tooltip={t("residualPresTooltip")}');

  // Duct
  content = content.replace('tooltip="Total air volume flow rate entering the main duct branch."', 'tooltip={t("mainAirflowTooltip")}');
  content = content.replace('tooltip="Target pressure drop per unit length. Typical design range: 0.08 to 0.12 in. wg/100 ft (0.8 - 1.2 Pa/m) for standard low-pressure systems."', 'tooltip={t("frictionLossTooltip")}');
  content = content.replace('tooltip="Determines the target reference velocity ranges based on the application."', 'tooltip={t("ductTypeTooltip")}');
  content = content.replace('tooltip={ductType === \'supply\' ? "Maximum allowable air velocity. Typical Supply Range: 1000 - 2000 FPM (5 - 10 m/s)." : ductType === \'return\' ? "Maximum allowable air velocity. Typical Return Range: 800 - 1500 FPM (4 - 7.5 m/s)." : "Maximum allowable air velocity. Typical Exhaust Range: 1500 - 2500 FPM (7.5 - 12.5 m/s)."}', 'tooltip={ductType === \'supply\' ? t("maxVelSupply") : ductType === \'return\' ? t("maxVelReturn") : t("maxVelExhaust")}');
  content = content.replace('tooltip="Fixed vertical dimension of rectangular duct. Width will be calculated."', 'tooltip={t("ductHeightTooltip")}');

  // Fire
  content = content.replace('tooltip="Total facility sprinkler heads. Used to estimate total system volume and secondary water reserve mandates."', 'tooltip={t("totalHeadsTooltip")}');
  content = content.replace('tooltip="Class II/III standpipe hose reels. Adds supplemental concurrent flow demands per NFPA 14."', 'tooltip={t("hoseReelsTooltip")}');
  content = content.replace('tooltip="Vertical distance from the fire pump to the highest hydraulic sprinkler or hose connection. Determines minimum static pressure."', 'tooltip={t("staticHeadTooltip")}');
  content = content.replace('tooltip="Pump mechanical efficiency factor (typically 65-75% for horizontal split-case pumps) used to calculate motor brake horsepower."', 'tooltip={t("pumpEffTooltip")}');

  fs.writeFileSync(file, content, 'utf8');
}
