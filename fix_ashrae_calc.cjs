const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');

// Replace import
code = code.replace(
  "import { ASHRAE_62_1_2022_SPACES } from '../calculations/data/ashrae621/SpaceTypesData';",
  ""
);

// Add state for edition
code = code.replace(
  "  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);",
  "  const [airTemp, setAirTemp] = useState<number>(isMetric ? 20 : 70);\n  const [edition, setEdition] = useState<'2019' | '2022' | '2025'>('2022');"
);

// Replace ASHRAE_62_1_2022_SPACES references with dynamic ones
code = code.replace(
  "const spaceType = ASHRAE_62_1_2022_SPACES.find(s => s.id === z.spaceTypeId) || ASHRAE_62_1_2022_SPACES[0];",
  "const spaces = Ashrae621Service.getSpacesByEdition(edition);\n    const spaceType = spaces.find(s => s.id === z.spaceTypeId) || spaces[0];"
);

code = code.replace(
  "{ASHRAE_62_1_2022_SPACES.map(s => (",
  "{Ashrae621Service.getSpacesByEdition(edition).map(s => ("
);

// We need an edition selector in the UI
const uiSelector = `
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Edition</label>
            <select
              value={edition}
              onChange={(e) => setEdition(e.target.value as any)}
              className="bg-slate-950 text-white rounded px-2 py-1 text-xs border border-slate-800"
            >
              <option value="2019">ASHRAE 62.1-2019</option>
              <option value="2022">ASHRAE 62.1-2022</option>
              <option value="2025">ASHRAE 62.1-2025</option>
            </select>
          </div>
`;

code = code.replace('        </div>\n        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">', uiSelector + '        </div>\n        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">');


fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
