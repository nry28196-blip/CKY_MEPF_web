const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

// Ensure TooltipLabel is imported
if (!code.includes('TooltipLabel')) {
  code = code.replace(
    `import ValidatedInput from './ValidatedInput';`,
    `import ValidatedInput from './ValidatedInput';\nimport TooltipLabel from './TooltipLabel';`
  );
}

// Replacements
code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Elevation ({isMetric ? 'm' : 'ft'})</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label={\`Elevation (\${isMetric ? 'm' : 'ft'})\`} tooltip="Used to calculate the local air density ratio (Eρ) per normative Appendix B. Affects the conversion between mass and volume flow rates." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Air Temp ({isMetric ? '°C' : '°F'})</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label={\`Air Temp (\${isMetric ? '°C' : '°F'})\`} tooltip="Used with elevation to calculate the air density correction factor." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">System Type</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="System Type" tooltip="Single-Zone: One zone per system. Simplified/Alternative: Multi-zone systems with varying methods for calculating system ventilation efficiency (Ev)." />`
);

// Peak System Population (appears multiple times)
code = code.split(`<label className="block text-xs font-bold text-sky-400 mb-1.5 uppercase">Peak System Population Ps (Optional)</label>`).join(
  `<TooltipLabel className="block text-xs font-bold text-sky-400 mb-1.5 uppercase" label="Peak System Population Ps (Optional)" tooltip="If known, the peak total population of the entire system can be used instead of the sum of zone populations to reduce required outdoor air through population diversity." />`
);

// Min System Primary Airflow (appears multiple times)
code = code.split(`<label className="block text-xs font-bold text-sky-400 mb-1.5 uppercase">Min System Primary Airflow Vps (Optional)</label>`).join(
  `<TooltipLabel className="block text-xs font-bold text-sky-400 mb-1.5 uppercase" label="Min System Primary Airflow Vps (Optional)" tooltip="System primary airflow rate. Required for alternative procedure Ev calculations. Enter the minimum expected supply airflow for VAV systems." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Space Type (Table 6.2.2.1)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Space Type (Table 6.2.2.1)" tooltip="ASHRAE 62.1 space categorization. Determines the breathing zone outdoor air rates for people (Rp) and area (Ra)." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Zone Ez (Table 6.2.2.2)</label>`,
  `<TooltipLabel className="block text-xs font-bold text-slate-400 mb-1.5 uppercase" label="Zone Ez (Table 6.2.2.2)" tooltip="Zone Air Distribution Effectiveness. Varies based on air distribution configuration (e.g., ceiling supply/return = 1.0, floor supply = 1.2)." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-amber-400 mb-1.5 uppercase">Design Vpz ({flowUnit})</label>`,
  `<TooltipLabel className="block text-xs font-bold text-amber-400 mb-1.5 uppercase" label={\`Design Vpz (\${flowUnit})\`} tooltip="Design zone primary airflow. Typically the peak cooling/heating supply airflow to the zone." />`
);

code = code.replace(
  `<label className="block text-xs font-bold text-amber-500 mb-1.5 uppercase">Min Vpz-min</label>`,
  `<TooltipLabel className="block text-xs font-bold text-amber-500 mb-1.5 uppercase" label="Min Vpz-min" tooltip="Minimum zone primary airflow. Crucial for VAV systems to determine the worst-case primary outdoor air fraction (Zp)." />`
);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
