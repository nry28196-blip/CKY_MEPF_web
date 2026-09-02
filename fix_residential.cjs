const fs = require('fs');
let file = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf8');

file = file.replace(
  /const \[edition, setEdition\] = useState<'2022' \| '2019'>\('2022'\);/,
  `const [edition, setEdition] = useState<'2025' | '2022' | '2019'>('2025');`
);

file = file.replace(
  /onChange=\{\(e\) => setEdition\(e\.target\.value as '2022' \| '2019'\)\}/,
  `onChange={(e) => setEdition(e.target.value as '2025' | '2022' | '2019')}`
);

file = file.replace(
  /<option value="2022">ASHRAE 62\.2-2022<\/option>/,
  `<option value="2025">ASHRAE 62.2-2025</option>
          <option value="2022">ASHRAE 62.2-2022</option>`
);

fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', file);
