const fs = require('fs');

let file = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// Replace ASHRAE_62_1_2022_EZ with dynamic fetch
file = file.replace(/import \{ ASHRAE_62_1_2022_EZ \} from '\.\.\/calculations\/data\/ashrae621\/AirDistributionData';/, '');

file = file.replace(/const ezConfig = ASHRAE_62_1_2022_EZ\.find\(e => e\.id === z\.ezId\) \|\| ASHRAE_62_1_2022_EZ\[0\];/, 
`const ezList = Ashrae621Service.getEzByEdition(edition);
    const ezConfig = ezList.find(e => e.id === z.ezId) || ezList[0];`);

file = file.replace(/\{ASHRAE_62_1_2022_EZ\.map\(ez => \(/g, `{Ashrae621Service.getEzByEdition(edition).map(ez => (`);

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', file);
