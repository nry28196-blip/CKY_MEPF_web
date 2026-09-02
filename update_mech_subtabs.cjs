const fs = require('fs');
let file = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

// Add "exhaust" to TabType
file = file.replace(
  /type MechTabType = 'ventilation' \| 'fanDuty' \| 'cooling' \| 'formulas' \| 'ductSizing';/,
  `type MechTabType = 'ventilation' | 'exhaust' | 'fanDuty' | 'cooling' | 'formulas' | 'ductSizing';`
);

// Add Exhaust tab to the nav map
file = file.replace(
  /\{ id: 'fanDuty', label: 'Fan Duty', icon: Fan \},/,
  `{ id: 'fanDuty', label: 'Fan Duty', icon: Fan },
      { id: 'exhaust', label: 'Exhaust', icon: Wind },`
);

// Add Exhaust rendering logic
file = file.replace(
  /subTab === 'fanDuty' \? \(/,
  `subTab === 'exhaust' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Ashrae621ExhaustCalc />
        </div>
      ) : subTab === 'fanDuty' ? (`
);

// Need to import Ashrae621ExhaustCalc
file = file.replace(
  /import Ashrae621VentilationCalc from '\.\/Ashrae621VentilationCalc';/,
  `$&
import Ashrae621ExhaustCalc from './Ashrae621ExhaustCalc';`
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', file);
