const fs = require('fs');

let content = fs.readFileSync('src/components/IAQCalc.tsx', 'utf8');

// 1. Add import
if (!content.includes("import ashrae2025Data")) {
  content = content.replace(
    "import ValidatedInput from './ValidatedInput';",
    "import ValidatedInput from './ValidatedInput';\nimport ashrae2025Data from '../data/ashrae62_1_2025.json';"
  );
}

// 2. Add ASHRAE 2025 constants in the component
const constsToAdd = `
  const minMerv = ashrae2025Data.airQualityStandards.filtrationRequirements.minimumMERV;
  const pm25Threshold = ashrae2025Data.airQualityStandards.filtrationRequirements.pm25DesignThreshold;
  const exhaustClasses = ashrae2025Data.airQualityStandards.exhaustClasses;
`;

if (!content.includes("const minMerv")) {
  content = content.replace(
    "export default function IAQCalc() {",
    "export default function IAQCalc() {" + constsToAdd
  );
}

// 3. Update Filtration Module UI
const filtrationTarget = `<h3 className="text-sm font-semibold text-white mb-5 flex items-center">
            <Filter className="w-4 h-4 mr-2 text-sky-400" />
            Filtration Effectiveness
          </h3>`;
const filtrationReplacement = `<h3 className="text-sm font-semibold text-white mb-5 flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-sky-400" />
              Filtration Effectiveness
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] uppercase tracking-wider font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded">
                ASHRAE 2025 Min: MERV {minMerv}
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold bg-amber-950/30 text-amber-400 border border-amber-900/50 px-2 py-1 rounded">
                PM2.5 Threshold: {pm25Threshold} μg/m³
              </span>
            </div>
          </h3>`;

content = content.replace(filtrationTarget, filtrationReplacement);

// 4. Update Separation Distance UI
// We have this block:
/*
<select 
                value={exhaustSource} onChange={(e) => setExhaustSource(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-amber-500"
              >
                <option value="class1">Class 1 Exhaust (Clean)</option>
                <option value="class2">Class 2 Exhaust (Mildly Contaminated)</option>
                <option value="class3">Class 3 Exhaust (Significant Contaminant)</option>
                <option value="class4">Class 4 Exhaust (Highly Objectionable)</option>
                <option value="plumbing">Plumbing Vents</option>
                <option value="garage">Parking Garage Exhaust</option>
                <option value="cooling_tower">Cooling Tower Exhaust</option>
              </select>
*/

const selectTarget = `<select 
                value={exhaustSource} onChange={(e) => setExhaustSource(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-amber-500"
              >
                <option value="class1">Class 1 Exhaust (Clean)</option>
                <option value="class2">Class 2 Exhaust (Mildly Contaminated)</option>
                <option value="class3">Class 3 Exhaust (Significant Contaminant)</option>
                <option value="class4">Class 4 Exhaust (Highly Objectionable)</option>
                <option value="plumbing">Plumbing Vents</option>
                <option value="garage">Parking Garage Exhaust</option>
                <option value="cooling_tower">Cooling Tower Exhaust</option>
              </select>`;

const selectReplacement = `<select 
                value={exhaustSource} onChange={(e) => setExhaustSource(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-lg px-3 py-2 text-sm border border-slate-800 focus:border-amber-500"
              >
                {exhaustClasses.map((ec: any) => (
                  <option key={\`class\${ec.class}\`} value={\`class\${ec.class}\`}>Class {ec.class} Exhaust ({ec.description})</option>
                ))}
                <option value="plumbing">Plumbing Vents</option>
                <option value="garage">Parking Garage Exhaust</option>
                <option value="cooling_tower">Cooling Tower Exhaust</option>
              </select>`;

content = content.replace(selectTarget, selectReplacement);

fs.writeFileSync('src/components/IAQCalc.tsx', content);
console.log("IAQCalc.tsx updated.");
