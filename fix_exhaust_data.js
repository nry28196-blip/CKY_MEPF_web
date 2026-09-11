import fs from 'fs';

const files = [
  'src/data/ventilation/ashrae621/2019/data.ts',
  'src/data/ventilation/ashrae621/2022/data.ts',
  'src/data/ventilation/ashrae621/2025/data.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/rate:/g, "standard: 'ASHRAE 62.1',\n    rate:");
  fs.writeFileSync(file, content);
}
