import fs from 'fs';
let code = fs.readFileSync('src/components/PlumbingCalc.tsx', 'utf8');

code = code.replace(
  /const totalLength = appliedPipeLength \+ equivFittings;\n      \/\/ Metric Hazen-Williams\n      const Hf = 10.67 \* Math\.pow\(q_m3s, 1.85\) \/ \(Math\.pow\(cFactor, 1.85\) \* Math\.pow\(d_m, 4.87\)\);\n      const frictionLossM = Hf \* totalLength;\n      \n      const totalHeadLossM = frictionLossM \+ appliedElevationChange;\n      const totalHeadLossBar = totalHeadLossM \/ 10.197;\n      \n      const residualBar = appliedAvailablePressure - totalHeadLossBar;/g,
  `const totalLength = appliedPipeLength + equivFittings;
      // Metric Hazen-Williams
      const Hf = 10.67 * Math.pow(q_m3s, 1.85) / (Math.pow(cFactor, 1.85) * Math.pow(d_m, 4.87));
      const frictionLossM = Hf * totalLength;
      
      const totalHeadLossM = frictionLossM + appliedElevationChange;
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

code = code.replace(
  /const totalHeadLossBar = \(Hf \* totalLength \+ appliedElevationChange\) \/ 10.197;/g,
  `const totalHeadLossBar = (Hf * totalLength + appliedElevationChange) / 10.197;
      
      console.log(\`[Hydraulic Sizing Trace - Max Size Fallback] Dia: >200mm\`);
      console.log(\`  - Flow (m³/s): \${q_m3s}\`);
      console.log(\`  - Pipe Length (m): \${appliedPipeLength}\`);
      console.log(\`  - Equiv Fittings (m): \${equivFittings}\`);
      console.log(\`  - Total Length (m): \${totalLength}\`);
      console.log(\`  - Friction Loss (m): \${Hf * totalLength}\`);
      console.log(\`  - Elevation Change (m): \${appliedElevationChange}\`);
      console.log(\`  - Total Head Loss (bar): \${totalHeadLossBar}\`);
      console.log(\`  - Available Pressure (bar): \${appliedAvailablePressure}\`);
      console.log(\`  - Residual Pressure (bar): \${appliedAvailablePressure - totalHeadLossBar}\`);`
);

code = code.replace(
  /const totalHeadLossM = cumFrictionM \+ cumElevationM;\n      const totalHeadLossBar = totalHeadLossM \/ 10.197;\n      const residualBar = appliedAvailablePressure - totalHeadLossBar;/g,
  `const totalHeadLossM = cumFrictionM + cumElevationM;
      const totalHeadLossBar = totalHeadLossM / 10.197;
      const residualBar = appliedAvailablePressure - totalHeadLossBar;
      
      console.log(\`[Hydraulic Sizing Trace - Multi-Segment]\`);
      console.log(\`  - Flow (m³/s): \${q_m3s}\`);
      console.log(\`  - Cum Friction (m): \${cumFrictionM}\`);
      console.log(\`  - Cum Elevation (m): \${cumElevationM}\`);
      console.log(\`  - Total Head Loss (m): \${totalHeadLossM}\`);
      console.log(\`  - Total Head Loss (bar): \${totalHeadLossBar}\`);
      console.log(\`  - Available Pressure (bar): \${appliedAvailablePressure}\`);
      console.log(\`  - Residual Pressure (bar): \${residualBar}\`);`
);

fs.writeFileSync('src/components/PlumbingCalc.tsx', code);
