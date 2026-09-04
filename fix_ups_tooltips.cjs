const fs = require('fs');
let code = fs.readFileSync('src/components/UpsSizingCalc.tsx', 'utf-8');

code = code.replace(
  `                <TooltipLabel \n                  label="Load Power Factor"`,
  `                <TooltipLabel \n                  label="Load Power Factor"\n                  tooltip="The aggregate power factor of the connected load (often ~0.8 to 0.9 for mixed IT equipment). Used to convert required kW to apparent kVA."`
);

code = code.replace(
  `                <TooltipLabel \n                  label="Design Margin (e.g. 1.25 for 25%)"`,
  `                <TooltipLabel \n                  label="Design Margin (e.g. 1.25 for 25%)"\n                  tooltip="Safety multiplier for future expansion and preventing overload (typically 1.2 to 1.25)."`
);

code = code.replace(
  `                <TooltipLabel \n                  label="Backup Time (Minutes)"`,
  `                <TooltipLabel \n                  label="Backup Time (Minutes)"\n                  tooltip="Required battery runtime at full design load. Drives the calculation of total battery Ah and string configuration."`
);

fs.writeFileSync('src/components/UpsSizingCalc.tsx', code);
