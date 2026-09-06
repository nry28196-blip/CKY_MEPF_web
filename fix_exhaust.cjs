const fs = require('fs');
const file = '/app/applet/src/components/Ashrae621ExhaustCalc.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { ASHRAE_621_2025_EXHAUST_RATES } from '../data/ventilation/ashrae621/2025/data';",
  `import { ASHRAE_621_2025_EXHAUST_RATES } from '../data/ventilation/ashrae621/2025/data';
import { ASHRAE_621_2022_EXHAUST_RATES } from '../data/ventilation/ashrae621/2022/data';
import { ASHRAE_621_2019_EXHAUST_RATES } from '../data/ventilation/ashrae621/2019/data';`
);

content = content.replace(
  'const { unitSystem } = useUnit();',
  `const { unitSystem } = useUnit();
  const exhaustRates = edition === '2019' ? ASHRAE_621_2019_EXHAUST_RATES : edition === '2022' ? ASHRAE_621_2022_EXHAUST_RATES : ASHRAE_621_2025_EXHAUST_RATES;`
);

content = content.replace(
  'const exhaustType = ASHRAE_621_2025_EXHAUST_RATES.find(e => e.id === r.categoryId) || null;',
  'const exhaustType = exhaustRates.find(e => e.id === r.categoryId) || null;'
);

content = content.replace(
  '}, [rows, isMetric]);',
  '}, [rows, isMetric, exhaustRates]);'
);

content = content.replace(
  '{ASHRAE_621_2025_EXHAUST_RATES.map(e => (',
  '{exhaustRates.map(e => ('
);

fs.writeFileSync(file, content);
