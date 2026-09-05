const fs = require('fs');
const file = 'src/components/MechanicalCalc.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/room\.tons\.toFixed/g, '(room.tons || 0).toFixed');
code = code.replace(/vrfResults\.totalConnectedTons\.toFixed/g, '(vrfResults.totalConnectedTons || 0).toFixed');
code = code.replace(/vrfResults\.coincidentTons\.toFixed/g, '(vrfResults.coincidentTons || 0).toFixed');
code = code.replace(/vrfResults\.oduTons\.toFixed/g, '(vrfResults.oduTons || 0).toFixed');
code = code.replace(/vrfResults\.combinationRatio\.toFixed/g, '(vrfResults.combinationRatio || 0).toFixed');
code = code.replace(/vrfResults\.deratedOduCapacityTons\.toFixed/g, '(vrfResults.deratedOduCapacityTons || 0).toFixed');
code = code.replace(/vrfResults\.toxicConcentration\.toFixed/g, '(vrfResults.toxicConcentration || 0).toFixed');
code = code.replace(/vrfResults\.additionalCharge\.toFixed/g, '(vrfResults.additionalCharge || 0).toFixed');

fs.writeFileSync(file, code);
