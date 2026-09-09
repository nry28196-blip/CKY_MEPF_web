import fs from 'fs';
const files = [
  'src/tests/ventilation/golden.test.ts',
  'src/tests/ventilation/Ventilation.test.ts',
  'src/tests/ventilation/ashrae-621-numerical.test.ts'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/};\n};\n};/g, '};\n};');
  fs.writeFileSync(file, content);
}
