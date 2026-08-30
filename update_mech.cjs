const fs = require('fs');

let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

content = content.replace(
  '<h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Thermal Inputs</h3>',
  '<h3 className="text-xs font-bold text-slate-300 tracking-wider uppercase">{t("thermalInputs")}</h3>'
);

content = content.replace(
  'tooltip="Estimation basis logic per ASHRAE Fundamentals Chapter 18 (Non-residential Cooling and Heating Load Calculations)."',
  'tooltip={t("estimationBasisTooltip")}'
);

content = content.replace(
  'tooltip="Total conditioned floor area. Used to estimate generalized sensible cooling loads (W/m²) per ASHRAE 90.1 standard building types."',
  'tooltip={t("floorAreaTooltip")}'
);

content = content.replace(
  'tooltip="Room volumetric footprint used for psychrometric air change rates (ACH) and precise infiltration load estimations."',
  'tooltip={t("roomVolumeTooltip")}'
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', content, 'utf8');
