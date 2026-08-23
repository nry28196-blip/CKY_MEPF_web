import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# Replace the initial fixtures with a dynamic list
search_fixtures = """  // State 1: Fixtures (IPC Appendix E & Chapter 7 Compliant)
  const [fixtures, setFixtures] = useState<FixtureRow[]>([
    { id: 'wc_pub_fv', name: 'Water Closet (Public) - Flushometer', wsfu: 10, dfu: 6, lu: 2.0, du: 2.0, qty: 10 },
    { id: 'wc_pub_ft', name: 'Water Closet (Public) - Flush Tank', wsfu: 5, dfu: 4, lu: 2.0, du: 2.0, qty: 0 },
    { id: 'wc_priv_fv', name: 'Water Closet (Private) - Flushometer', wsfu: 6, dfu: 4, lu: 2.0, du: 2.0, qty: 0 },
    { id: 'wc_priv_ft', name: 'Water Closet (Private) - Flush Tank', wsfu: 2.2, dfu: 3, lu: 2.0, du: 2.0, qty: 0 },
    { id: 'lav_pub', name: 'Lavatory (Public) - Faucet', wsfu: 2.0, dfu: 1, lu: 1.0, du: 0.5, qty: 12 },
    { id: 'lav_priv', name: 'Lavatory (Private) - Faucet', wsfu: 0.7, dfu: 1, lu: 1.0, du: 0.5, qty: 0 },
    { id: 'shower_pub', name: 'Shower (Public) - Mixing Valve', wsfu: 4.0, dfu: 2, lu: 2.0, du: 0.6, qty: 8 },
    { id: 'shower_priv', name: 'Shower (Private) - Mixing Valve', wsfu: 1.4, dfu: 2, lu: 2.0, du: 0.6, qty: 0 },
    { id: 'sink_pub', name: 'Service Sink (Public) - Faucet', wsfu: 3.0, dfu: 2, lu: 3.0, du: 0.8, qty: 0 },
    { id: 'sink_priv', name: 'Kitchen Sink (Private) - Faucet', wsfu: 1.4, dfu: 2, lu: 3.0, du: 0.8, qty: 4 },
    { id: 'urinal_pub_fv', name: 'Urinal (Public) - 1" Flushometer', wsfu: 5.0, dfu: 4, lu: 1.5, du: 0.5, qty: 4 },
    { id: 'drink_fount', name: 'Drinking Fountain (Public/Private)', wsfu: 0.25, dfu: 0.5, lu: 0.1, du: 0.1, qty: 0 },
  ]);"""

replace_fixtures = """  // State 1: Fixtures (IPC Appendix E & Chapter 7 Compliant)
  const [fixtures, setFixtures] = useState<FixtureRow[]>([
    { id: 'wc_pub_fv', name: 'Water Closet (Public) - Flushometer', wsfu: 10, dfu: 6, lu: 2.0, du: 2.0, qty: 10 },
    { id: 'lav_pub', name: 'Lavatory (Public) - Faucet', wsfu: 2.0, dfu: 1, lu: 1.0, du: 0.5, qty: 12 },
    { id: 'shower_pub', name: 'Shower (Public) - Mixing Valve', wsfu: 4.0, dfu: 2, lu: 2.0, du: 0.6, qty: 8 },
    { id: 'sink_priv', name: 'Kitchen Sink (Private) - Faucet', wsfu: 1.4, dfu: 2, lu: 3.0, du: 0.8, qty: 4 },
    { id: 'urinal_pub_fv', name: 'Urinal (Public) - 1" Flushometer', wsfu: 5.0, dfu: 4, lu: 1.5, du: 0.5, qty: 4 },
  ]);"""

content = content.replace(search_fixtures, replace_fixtures)

# Add imports for IPC_FIXTURES
search_imports = "import { exportPlumbingToCsv } from '../lib/exportCsv';"
replace_imports = "import { exportPlumbingToCsv } from '../lib/exportCsv';\nimport { IPC_FIXTURES } from '../lib/plumbingFixtures';"
content = content.replace(search_imports, replace_imports)

# Add add/remove handler methods
search_helpers = """  // Fixture helpers
  const handleQtyChange = (id: string, value: number) => {
    setFixtures(prev => prev.map(f => f.id === id ? { ...f, qty: Math.max(0, value) } : f));
  };"""

replace_helpers = """  // Fixture helpers
  const handleQtyChange = (id: string, value: number) => {
    setFixtures(prev => prev.map(f => f.id === id ? { ...f, qty: Math.max(0, value) } : f));
  };

  const handleRemoveFixture = (id: string) => {
    setFixtures(prev => prev.filter(f => f.id !== id));
  };

  const [selectedNewFixture, setSelectedNewFixture] = useState<string>('');
  
  const handleAddFixture = () => {
    if (!selectedNewFixture) return;
    const existing = fixtures.find(f => f.id === selectedNewFixture);
    if (existing) {
      handleQtyChange(selectedNewFixture, existing.qty + 1);
    } else {
      const fixtureData = IPC_FIXTURES.find(f => f.id === selectedNewFixture);
      if (fixtureData) {
        setFixtures(prev => [...prev, { ...fixtureData, qty: 1 }]);
      }
    }
    setSelectedNewFixture('');
  };"""

content = content.replace(search_helpers, replace_helpers)


# Update the UI
search_ui = """              <div className="space-y-2">
                {fixtures.map((fix) => (
                  <div key={fix.id} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-850 hover:border-slate-800 transition-colors">
                    <div className="min-w-0 pr-3">
                      <span className="block text-xs font-bold text-slate-200 leading-snug">{fix.name}</span>
                      <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                        {standard === 'bs'
                          ? `Loading Units (LU): ${fix.lu} | Discharge Units (DU): ${fix.du} per unit`
                          : `WSFU: ${fix.wsfu} | DFU: ${fix.dfu} per unit`
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => handleQtyChange(fix.id, fix.qty - 1)}
                        className="h-7 w-7 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-black cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={fix.qty}
                        onChange={(e) => handleQtyChange(fix.id, Number(e.target.value))}
                        className="w-12 bg-slate-950 border border-slate-800 text-white font-mono text-xs text-center rounded py-1 invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      />
                      <button
                        onClick={() => handleQtyChange(fix.id, fix.qty + 1)}
                        className="h-7 w-7 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>"""

replace_ui = """              <div className="space-y-2">
                {fixtures.map((fix) => (
                  <div key={fix.id} className="flex items-center justify-between bg-slate-950/40 p-3 rounded-xl border border-slate-850 hover:border-slate-800 transition-colors group">
                    <div className="min-w-0 pr-3">
                      <span className="block text-xs font-bold text-slate-200 leading-snug">{fix.name}</span>
                      <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                        {standard === 'bs'
                          ? `Loading Units (LU): ${fix.lu} | Discharge Units (DU): ${fix.du} per unit`
                          : `WSFU: ${fix.wsfu} | DFU: ${fix.dfu} per unit`
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => handleQtyChange(fix.id, fix.qty - 1)}
                        className="h-7 w-7 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-black cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={fix.qty}
                        onChange={(e) => handleQtyChange(fix.id, Number(e.target.value))}
                        className="w-12 bg-slate-950 border border-slate-800 text-white font-mono text-xs text-center rounded py-1 invalid:border-red-500 invalid:text-red-400 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                      />
                      <button
                        onClick={() => handleQtyChange(fix.id, fix.qty + 1)}
                        className="h-7 w-7 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-black cursor-pointer"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveFixture(fix.id)}
                        className="h-7 w-7 rounded bg-red-950/30 border border-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-200 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Fixture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Add Fixture Dropdown */}
                <div className="mt-4 flex gap-2 items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <select
                    value={selectedNewFixture}
                    onChange={(e) => setSelectedNewFixture(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 text-white rounded px-3 py-2 text-xs font-mono outline-none focus:border-cyan-500"
                  >
                    <option value="">-- Select Fixture to Add --</option>
                    {IPC_FIXTURES.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddFixture}
                    disabled={!selectedNewFixture}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>"""

content = content.replace(search_ui, replace_ui)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)

