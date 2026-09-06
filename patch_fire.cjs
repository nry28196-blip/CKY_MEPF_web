const fs = require('fs');
let code = fs.readFileSync('src/components/FireCalc.tsx', 'utf-8');

code = code.replace(
  '                  {pipeFrictionPercent !== 0 && (pipeFrictionPercent < 5 || pipeFrictionPercent > 50) && (\n                    <InputAlert type="error" message="Safe range: 5% to 50%" />\n                  )}',
  `                  {pipeFrictionPercent !== 0 && (pipeFrictionPercent < 5 || pipeFrictionPercent > 50) && (
                    <InputAlert type="error" message="Absolute calculation limits: 5% to 50%" />
                  )}
                  {pipeFrictionPercent !== 0 && pipeFrictionPercent >= 5 && pipeFrictionPercent <= 50 && (pipeFrictionPercent < 10 || pipeFrictionPercent > 30) && (
                    <InputAlert type="warning" message={\`Typical NFPA/BS standard friction allowance is 10% - 30%.\`} />
                  )}`
);

fs.writeFileSync('src/components/FireCalc.tsx', code);
