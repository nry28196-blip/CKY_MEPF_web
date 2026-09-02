const fs = require('fs');
let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// The multizone output is currently in the same file. I need to make sure System Population and System Primary Airflow states were initialized correctly.
if (!file.includes('const [systemPopulation')) {
  file = file.replace(
    /const \[edition, setEdition\] = useState\('2022'\);/,
    `$&
  const [systemPopulation, setSystemPopulation] = useState<number | ''>('');
  const [systemPrimaryAirflow, setSystemPrimaryAirflow] = useState<number | ''>('');`
  );
}

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
