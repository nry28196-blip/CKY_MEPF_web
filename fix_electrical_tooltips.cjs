const fs = require('fs');
let code = fs.readFileSync('src/components/ElectricalCalc.tsx', 'utf-8');

code = code.replace(
  `            <TooltipLabel \n              label="System Phase"`,
  `            <TooltipLabel \n              label="System Phase"\n              tooltip="Single-phase is typically for residential/light commercial (e.g., 120V/230V). Three-phase is for commercial/industrial motors and heavy loads, offering higher efficiency and power density."`
);

code = code.replace(
  `              <TooltipLabel \n                label="Load Power Input"`,
  `              <TooltipLabel \n                label="Load Power Input"\n                tooltip="Total required power for the load. Select standard HP for motors or input custom kW for static loads."`
);

code = code.replace(
  `              <TooltipLabel \n                label="Voltage (V)"`,
  `              <TooltipLabel \n                label="Voltage (V)"\n                tooltip="Nominal system voltage. Note that line-to-line vs line-to-neutral impacts three-phase calculations (I = P / (√3 × V × PF))."`
);

code = code.replace(
  `              <TooltipLabel \n                label="Power Factor (cos φ)"`,
  `              <TooltipLabel \n                label="Power Factor (cos φ)"\n                tooltip="Ratio of working power (kW) to apparent power (kVA). Lower PF increases the full load current required to deliver the same real power."`
);

fs.writeFileSync('src/components/ElectricalCalc.tsx', code);
