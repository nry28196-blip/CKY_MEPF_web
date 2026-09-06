const fs = require('fs');
let code = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf-8');

code = code.replace(
  '              {frictionRate !== 0 && (frictionRate < 0.01 || frictionRate > 1.5) && (\n                <InputAlert type="warning" message="Recommended safe range: 0.01 to 1.5 in. wg/100 ft" />\n              )}',
  `              {frictionRate !== 0 && (frictionRate < 0.01 || frictionRate > 1.5) && (
                <InputAlert type="error" message="Absolute calculation limits: 0.01 to 1.5 in. wg/100 ft" />
              )}
              {frictionRate !== 0 && frictionRate >= 0.01 && frictionRate <= 1.5 && (frictionRate < 0.05 || frictionRate > 0.15) && (
                <InputAlert type="warning" message={\`Typical standard design range is 0.05 - 0.15 in. wg/100 ft. \${frictionRate > 0.15 ? 'Higher rates may increase noise/energy.' : 'Lower rates may result in oversized ducts.'}\`} />
              )}`
);

code = code.replace(
  '                {velocityLimit !== 0 && (velocityLimit < 400 || velocityLimit > 6000) && (\n                  <InputAlert type="warning" message="Recommended safe range: 400 to 6,000 FPM" />\n                )}',
  `                {velocityLimit !== 0 && (velocityLimit < 400 || velocityLimit > 6000) && (
                  <InputAlert type="error" message="Absolute calculation limits: 400 to 6,000 FPM" />
                )}
                {velocityLimit !== 0 && velocityLimit >= 400 && velocityLimit <= 6000 && (velocityLimit < 500 || velocityLimit > 2500) && (
                  <InputAlert type="warning" message={\`Typical standard design range is 500 - 2,500 FPM. \${velocityLimit > 2500 ? 'Velocities above 2,500 FPM may cause severe acoustic noise.' : 'Velocities below 500 FPM may be economically oversized.'}\`} />
                )}`
);

fs.writeFileSync('src/components/DuctSizingCalc.tsx', code);
