const fs = require('fs');
let content = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf8');

if (!content.includes('import EngineeringAuditTrail')) {
  content = content.replace(
    /import \{ Thermometer,[\s\S]*?\} from 'lucide-react';/,
    "import { Thermometer, Activity, Calculator, Cloud, Info, Navigation, Droplets, Fan, Settings, List, Save, ArrowRight, Share2, AlertTriangle, Plus, Trash2, ShieldAlert } from 'lucide-react';\nimport EngineeringAuditTrail from './common/EngineeringAuditTrail';"
  );
}

const auditTrailComponent = `
          <TrendVisualizer 
            type="cooling" 
            currentParams={{
              isVrf: isVrf,
              area: isVrf ? Math.round(vrfRooms.reduce((acc, r) => acc + (r.basis === 'area' ? r.size : r.size / 3), 0)) : area,
              volume: isVrf ? Math.round(vrfRooms.reduce((acc, r) => acc + (r.basis === 'volume' ? r.size : r.size * 3), 0)) : volume,
              estimationBasis: isVrf ? 'area' : estimationBasis,
              occupants: isVrf ? vrfRooms.reduce((acc, r) => acc + r.occupants, 0) : occupants,
              calculatedWatts: isVrf ? vrfResults.totalConnectedWatts : results.watts,
              results: results
            }} 
          />
          {results.auditTrail && results.auditTrail.length > 0 && (
             <EngineeringAuditTrail title="ASHRAE Fundamentals & 15 Audit Log" trail={results.auditTrail} className="mt-6" />
          )}
          {vrfResults.auditTrail && vrfResults.auditTrail.length > 0 && (
             <EngineeringAuditTrail title="VRF / AHRI 1230 System Audit Log" trail={vrfResults.auditTrail} className="mt-6" />
          )}
`;

content = content.replace(
  /<TrendVisualizer[\s\S]*?results: results\n            \}\} \n          \/>/,
  auditTrailComponent
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', content);

