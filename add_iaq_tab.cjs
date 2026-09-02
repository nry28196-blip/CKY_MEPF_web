const fs = require('fs');
let file = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// Add "iaq" to TabType
file = file.replace(
  /type MechTabType = 'ventilation' \| 'exhaust' \| 'airBalance' \| 'fanDuty' \| 'cooling' \| 'formulas' \| 'ductSizing';/,
  `type MechTabType = 'ventilation' | 'exhaust' | 'airBalance' | 'iaq' | 'fanDuty' | 'cooling' | 'formulas' | 'ductSizing';`
);

// Add IAQ tab to the nav map
file = file.replace(
  /\{ id: 'airBalance', label: 'Air Balance', icon: Sliders \},/,
  `{ id: 'airBalance', label: 'Air Balance', icon: Sliders },
      { id: 'iaq', label: 'IAQ & DCV', icon: ShieldAlert },`
);

// Add IAQ rendering logic
file = file.replace(
  /subTab === 'airBalance' \? \(/,
  `subTab === 'iaq' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <IAQCalc />
        </div>
      ) : subTab === 'airBalance' ? (`
);

// Add import for IAQCalc and ShieldAlert
file = file.replace(
  /import AirBalanceCalc from '\.\/AirBalanceCalc';/,
  `$&
import IAQCalc from './IAQCalc';`
);

if (!file.includes('ShieldAlert')) {
  file = file.replace(
    /Wind, Layers,/,
    `ShieldAlert, Wind, Layers,`
  );
}

fs.writeFileSync('src/components/MechanicalCalc.tsx', file);
