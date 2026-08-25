import fs from 'fs';
let code = fs.readFileSync('src/components/PlumbingCalc.tsx', 'utf8');

code = code.replace(
  /const totalHeadLossM = frictionLossM \+ appliedElevationChange;\n      const totalHeadLossBar = totalHeadLossM \/ 10.197;\n         \n      const residualBar = appliedAvailablePressure - totalHeadLossBar;/g,
  `const totalHeadLossM = frictionLossM + appliedElevationChange;
      const totalHeadLossBar = totalHeadLossM / 10.197;
         
      const residualBar = appliedAvailablePressure - totalHeadLossBar;
      console.log(\`[Hydraulic Sizing Trace] Dia: \${dia}mm\`);
      console.log(\`  - Flow (m³/s): \${q_m3s}\`);
      console.log(\`  - Pipe Length (m): \${appliedPipeLength}\`);
      console.log(\`  - Equiv Fittings (m): \${equivFittings}\`);
      console.log(\`  - Total Length (m): \${totalLength}\`);
      console.log(\`  - Friction Loss (m): \${frictionLossM}\`);
      console.log(\`  - Elevation Change (m): \${appliedElevationChange}\`);
      console.log(\`  - Total Head Loss (m): \${totalHeadLossM}\`);
      console.log(\`  - Total Head Loss (bar): \${totalHeadLossBar}\`);
      console.log(\`  - Available Pressure (bar): \${appliedAvailablePressure}\`);
      console.log(\`  - Residual Pressure (bar): \${residualBar}\`);`
);

fs.writeFileSync('src/components/PlumbingCalc.tsx', code);
