const fs = require('fs');
let file = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// Add "airBalance" to TabType
file = file.replace(
  /type MechTabType = 'ventilation' \| 'exhaust' \| 'fanDuty' \| 'cooling' \| 'formulas' \| 'ductSizing';/,
  `type MechTabType = 'ventilation' | 'exhaust' | 'airBalance' | 'fanDuty' | 'cooling' | 'formulas' | 'ductSizing';`
);

// Add Air Balance tab to the nav map
file = file.replace(
  /\{ id: 'exhaust', label: 'Exhaust', icon: Wind \},/,
  `{ id: 'exhaust', label: 'Exhaust', icon: Wind },
      { id: 'airBalance', label: 'Air Balance', icon: Sliders },`
);

// Add Air Balance rendering logic
file = file.replace(
  /subTab === 'exhaust' \? \(/,
  `subTab === 'airBalance' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AirBalanceCalc />
        </div>
      ) : subTab === 'exhaust' ? (`
);

// Add import
file = file.replace(
  /import Ashrae621ExhaustCalc from '\.\/Ashrae621ExhaustCalc';/,
  `$&
import AirBalanceCalc from './AirBalanceCalc';`
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', file);
