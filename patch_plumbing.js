const fs = require('fs');
const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf8');

const addGroupCode = `
  const addFixtureGroup = (group: 'public' | 'private' | 'all') => {
    const toAdd = IPC_FIXTURES.filter(f => {
      if (group === 'all') return true;
      if (group === 'public') return f.name.includes('(Public)');
      if (group === 'private') return f.name.includes('(Private)') || f.name.includes('Domestic');
      return false;
    });
    
    setFixtures(prev => {
      const currentIds = new Set(prev.map(p => p.id));
      const newFixtures = toAdd.filter(f => !currentIds.has(f.id)).map(f => ({ ...f, qty: 0 }));
      return [...prev, ...newFixtures];
    });
  };
`;

code = code.replace('const handleQtyChange = (id: string, value: number) => {', addGroupCode + '\n  const handleQtyChange = (id: string, value: number) => {');

const buttonsCode = `
              </div>

              {/* Add Fixtures Controls */}
              <div className="flex flex-wrap gap-2 pt-1 pb-3">
                <button
                  onClick={() => addFixtureGroup('all')}
                  className="bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add All Fixtures</span>
                </button>
                <button
                  onClick={() => addFixtureGroup('public')}
                  className="bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Public Fixtures</span>
                </button>
                <button
                  onClick={() => addFixtureGroup('private')}
                  className="bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Private Fixtures</span>
                </button>
              </div>

              {(() => {
`;

code = code.replace(`              </div>\n\n              {(() => {\n                const currentTotalWSFU`, buttonsCode + '\n                const currentTotalWSFU');

fs.writeFileSync(file, code);
