const fs = require('fs');
let code = fs.readFileSync('src/components/BulkCalc.tsx', 'utf-8');

// Add HistoryItem import
if (!code.includes('HistoryItem')) {
  code = code.replace(
    `import { CONVERSIONS, convertValue, deltaCelsiusToFahrenheit, deltaFahrenheitToCelsius } from '../lib/unitConverter';`,
    `import { CONVERSIONS, convertValue, deltaCelsiusToFahrenheit, deltaFahrenheitToCelsius } from '../lib/unitConverter';\nimport { HistoryItem } from '../types';\nimport { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';`
  );
}

// Update BulkSystemType
code = code.replace(
  `type BulkSystemType = 'duct' | 'cooling' | 'flc' | 'pipe';`,
  `type BulkSystemType = 'duct' | 'cooling' | 'flc' | 'pipe' | 'dashboard';`
);

// Add interface Props
code = code.replace(
  `export default function BulkCalc() {`,
  `export default function BulkCalc({ history = [] }: { history?: HistoryItem[] }) {`
);

fs.writeFileSync('src/components/BulkCalc.tsx', code);
