const fs = require('fs');
const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Update FixtureRow interface
const oldInterface = `interface FixtureRow {
  id: string;
  name: string;
  wsfu: number; // Water Supply Fixture Unit (IPC)
  dfu: number;  // Drainage Fixture Unit (IPC)
  lu: number;   // Loading Unit (BS 8558 / BS EN 806)
  du: number;   // Discharge Unit (BS EN 12056)
  qty: number;
}`;
const newInterface = `interface FixtureRow {
  id: string;
  name: string;
  wsfu: number; // Water Supply Fixture Unit (IPC)
  dfu: number;  // Drainage Fixture Unit (IPC)
  lu: number;   // Loading Unit (BS 8558 / BS EN 806)
  du: number;   // Discharge Unit (BS EN 12056)
  qty: number;
  baseName?: string;
  usageType?: 'public' | 'private' | 'na';
  options?: {
    public?: string;
    private?: string;
    na?: string;
  };
}`;
code = code.replace(oldInterface, newInterface);

// 2. Import IPC_FIXTURES and getFixtureById
code = code.replace(/import \{ IPC_FIXTURES \} from '\.\.\/lib\/plumbingFixtures';/g, "import { IPC_FIXTURES, getFixtureById } from '../lib/plumbingFixtures';");

// 3. Update fixtures initialization
const oldInit = `  // State 1: Fixtures (IPC Appendix E & Chapter 7 Compliant)
  const [fixtures, setFixtures] = useState<FixtureRow[]>([
    { id: 'wc_pub_fv', name: 'Water Closet (Public) - Flushometer (1.6 GPF)', wsfu: 10, dfu: 4, lu: 2.0, du: 2.0, qty: 10 },
    { id: 'lav_pub', name: 'Lavatory (Public) - Faucet', wsfu: 2.0, dfu: 1, lu: 1.0, du: 0.5, qty: 12 },
    { id: 'shower_pub', name: 'Shower (Public) - Mixing Valve', wsfu: 4.0, dfu: 2, lu: 2.0, du: 0.6, qty: 8 },
    { id: 'sink_priv', name: 'Kitchen Sink (Private) - Faucet', wsfu: 1.4, dfu: 2, lu: 3.0, du: 0.8, qty: 4 },
    { id: 'urinal_pub_fv', name: 'Urinal (Public) - 1" Flushometer', wsfu: 10, dfu: 4, lu: 1.5, du: 0.5, qty: 4 },
  ]);`;

const newInit = `  // State 1: Fixtures (IPC Appendix E & Chapter 7 Compliant)
  const [fixtures, setFixtures] = useState<FixtureRow[]>([
    { ...getFixtureById('wc_pub_fv')!, qty: 10, baseName: 'Water Closet - Flushometer (1.6 GPF)', usageType: 'public', options: { public: 'wc_pub_fv', private: 'wc_priv_fv' } },
    { ...getFixtureById('wc_pub_ft')!, qty: 0, baseName: 'Water Closet - Flush Tank', usageType: 'public', options: { public: 'wc_pub_ft', private: 'wc_priv_ft' } },
    { ...getFixtureById('lav_pub')!, qty: 12, baseName: 'Lavatory - Faucet', usageType: 'public', options: { public: 'lav_pub', private: 'lav_priv' } },
    { ...getFixtureById('shower_pub')!, qty: 8, baseName: 'Shower - Mixing Valve', usageType: 'public', options: { public: 'shower_pub', private: 'shower_priv' } },
    { ...getFixtureById('sink_priv')!, qty: 4, baseName: 'Sink - Faucet', usageType: 'private', options: { public: 'sink_pub', private: 'sink_priv' } },
    { ...getFixtureById('urinal_pub_fv')!, qty: 4, baseName: 'Urinal - 1" Flushometer', usageType: 'public', options: { public: 'urinal_pub_fv' } },
    { ...getFixtureById('drink_fount')!, qty: 0, baseName: 'Drinking Fountain', usageType: 'na', options: { na: 'drink_fount' } },
    { ...getFixtureById('bathtub')!, qty: 0, baseName: 'Bathtub', usageType: 'private', options: { private: 'bathtub' } },
    { ...getFixtureById('bidet')!, qty: 0, baseName: 'Bidet', usageType: 'private', options: { private: 'bidet' } },
    { ...getFixtureById('dishwasher_dom')!, qty: 0, baseName: 'Dishwasher (Domestic)', usageType: 'private', options: { private: 'dishwasher_dom' } },
    { ...getFixtureById('washing_mach')!, qty: 0, baseName: 'Washing Machine (8 lb)', usageType: 'private', options: { private: 'washing_mach' } },
  ]);`;

code = code.replace(oldInit, newInit);

// 4. Update handlers
const addFixtureRegex = /const addFixtureGroup = \[\s\S\]*?const handleQtyChange = \(id: string, value: number\) => \{[\s\S]*?\};\n/m;
// Let's just find addFixtureGroup and replace up to end of handleQtyChange
// Actually, it's safer to use indexOf and slice
const addFixStart = code.indexOf('  const addFixtureGroup =');
if (addFixStart !== -1) {
  const handleQtyEnd = code.indexOf('};', code.indexOf('const handleQtyChange', addFixStart)) + 2;
  const newHandlers = `  const handleQtyChange = (baseName: string, value: number) => {
    const clampedValue = Math.min(9999, Math.max(0, value));
    setFixtures(prev => prev.map(f => (f.baseName || f.id) === baseName ? { ...f, qty: clampedValue } : f));
  };

  const handleUsageChange = (baseName: string, newUsage: 'public' | 'private' | 'na') => {
    setFixtures(prev => prev.map(f => {
      if ((f.baseName || f.id) === baseName) {
        const newId = f.options?.[newUsage];
        if (newId) {
          const newData = getFixtureById(newId);
          if (newData) {
             return { ...newData, qty: f.qty, baseName: f.baseName, usageType: newUsage, options: f.options };
          }
        }
      }
      return f;
    }));
  };`;
  code = code.slice(0, addFixStart) + newHandlers + code.slice(handleQtyEnd);
} else {
  // Try finding just handleQtyChange
  const handleQtyStart = code.indexOf('  const handleQtyChange =');
  if (handleQtyStart !== -1) {
    const handleQtyEnd = code.indexOf('};', handleQtyStart) + 2;
    const newHandlers = `  const handleQtyChange = (baseName: string, value: number) => {
    const clampedValue = Math.min(9999, Math.max(0, value));
    setFixtures(prev => prev.map(f => (f.baseName || f.id) === baseName ? { ...f, qty: clampedValue } : f));
  };

  const handleUsageChange = (baseName: string, newUsage: 'public' | 'private' | 'na') => {
    setFixtures(prev => prev.map(f => {
      if ((f.baseName || f.id) === baseName) {
        const newId = f.options?.[newUsage];
        if (newId) {
          const newData = getFixtureById(newId);
          if (newData) {
             return { ...newData, qty: f.qty, baseName: f.baseName, usageType: newUsage, options: f.options };
          }
        }
      }
      return f;
    }));
  };`;
    code = code.slice(0, handleQtyStart) + newHandlers + code.slice(handleQtyEnd);
  }
}

// 5. Remove 'Add Fixtures Controls' UI block
const addControlsStart = code.indexOf('{/* Add Fixtures Controls */}');
if (addControlsStart !== -1) {
  const addControlsEnd = code.indexOf('{(() => {', addControlsStart);
  code = code.slice(0, addControlsStart) + code.slice(addControlsEnd);
}

// 6. Update the row render
const tableRowRegex = /<div className="min-w-0 pr-3">[\s\S]*?<div className="flex items-center space-x-3 shrink-0">/;
const match = code.match(tableRowRegex);
if (match) {
  const oldRow = match[0];
  const newRow = `<div className="min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="block text-xs font-bold text-slate-200 leading-snug">{fix.baseName || fix.name}</span>
                        {fix.options && Object.keys(fix.options).length > 1 && (
                          <select
                            value={fix.usageType}
                            onChange={(e) => handleUsageChange(fix.baseName!, e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 text-slate-300 text-[10px] rounded px-1 py-0.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                          >
                            {fix.options.public && <option value="public">Public</option>}
                            {fix.options.private && <option value="private">Private</option>}
                          </select>
                        )}
                        {fix.options && Object.keys(fix.options).length === 1 && fix.options.public && !fix.options.private && (
                          <span className="text-[10px] text-slate-500 bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-800">Public</span>
                        )}
                        {fix.options && Object.keys(fix.options).length === 1 && fix.options.private && !fix.options.public && (
                          <span className="text-[10px] text-slate-500 bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-800">Private</span>
                        )}
                      </div>
                      <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                        {standard === 'bs'
                          ? \`Loading Units (LU): \${fix.lu} | Discharge Units (DU): \${fix.du}\`
                          : \`WSFU: \${fix.wsfu} | DFU: \${fix.dfu}\`
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">`;
  code = code.replace(oldRow, newRow);
  
  // also update button onChange calls to use baseName
  // We need to replace handleQtyChange(fix.id to handleQtyChange(fix.baseName || fix.id
  code = code.replace(/handleQtyChange\(fix\.id,/g, 'handleQtyChange(fix.baseName || fix.id,');
}

fs.writeFileSync(file, code);
