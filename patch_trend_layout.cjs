const fs = require('fs');
let content = fs.readFileSync('src/components/TrendVisualizer.tsx', 'utf8');

const targetHeader = `<div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center space-x-2.5">
            <TrendingUp className={\`h-4.5 w-4.5 \${header.iconColor}\`} />
            <h4 className="text-sm font-bold uppercase text-white tracking-wide">{header.title}</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">{header.description}</p>
        </div>
           
        {/* Dynamic Chart Mode Switcher & Metric Selectors */}
        <div className="flex flex-col gap-2 items-start justify-end w-full md:w-auto ml-auto self-start md:self-center">
          <div className="flex items-center space-x-1 text-[10px] bg-sky-950/40 border border-sky-800/40 text-sky-400 px-2 py-0.5 rounded-full font-sans font-semibold" style={{ height: "35px", width: "129.844px", marginTop: "24px", marginLeft: "72px" }}>
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Sensitivity Analysis</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center w-full">
          {/* Main Chart Type Selector */}
          <div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-lg text-[9px] font-bold uppercase" style={{ height: "28.5px" }}>
            <button
              onClick={() => setViewType('trend')}
              className={\`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 \${
                viewType === 'trend' ? 'bg-sky-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
              }\`}
            >
              <Activity className="h-3 w-3" />
              <span>Sensitivity Curve</span>
            </button>
            <button
              onClick={() => setViewType('results')}
              className={\`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center space-x-1 \${
                viewType === 'results' ? 'bg-sky-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
              }\`}
            >
              {type === 'cooling' ? <PieIcon className="h-3 w-3" /> : <BarChart2 className="h-3 w-3" />}
              <span>Results Chart</span>
            </button>
          </div>
          </div>

          {/* Sub-selectors (Only visible in Trend mode) */}
          {viewType === 'trend' && type === 'cooling' && (
            <div className="flex bg-slate-950 border border-slate-850 p-0.5 rounded-lg text-[9px] font-bold uppercase gap-1 overflow-x-auto max-w-full items-center">
              <div className="px-2 py-1 text-slate-500">Benchmarks:</div>
              {coolingBenchmarks.map(b => (
                <div key={b.id} className={\`flex items-center rounded-md border \${b.enabled ? 'bg-slate-800 border-slate-700' : 'opacity-60 border-transparent'} overflow-hidden\`}>
                  <button
                    onClick={() => {
                      const newB = [...coolingBenchmarks];
                      const idx = newB.findIndex(x => x.id === b.id);
                      newB[idx].enabled = !newB[idx].enabled;
                      setCoolingBenchmarks(newB);
                    }}
                    className={\`px-2 py-1 transition-all cursor-pointer \${b.enabled ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-500'}\`}
                  >
                    {b.enabled ? '✓' : '✗'}
                  </button>
                  <input
                    type="number"
                    value={b.value}
                    onChange={(e) => {
                      const newB = [...coolingBenchmarks];
                      const idx = newB.findIndex(x => x.id === b.id);
                      newB[idx].value = Number(e.target.value);
                      setCoolingBenchmarks(newB);
                    }}
                    className="w-12 bg-transparent text-white focus:outline-none text-center py-1"
                    disabled={!b.enabled}
                  />
                  <span className="pr-2 text-[8px] text-slate-400 normal-case">W/m²</span>
                </div>
              ))}
            </div>
          )}`;

const replacementHeader = `<div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2.5">
            <TrendingUp className={\`h-4.5 w-4.5 \${header.iconColor}\`} />
            <h4 className="text-sm font-bold uppercase text-white tracking-wide w-[314px]">{header.title}</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans mt-[11px]">{header.description}</p>
        </div>
           
        {/* Dynamic Chart Mode Switcher & Metric Selectors */}
        <div className="flex flex-col gap-3 items-start lg:items-end w-full lg:w-auto flex-shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5 text-[10px] bg-sky-950/40 border border-sky-800/40 text-sky-400 px-3 py-1.5 rounded-full font-sans font-semibold">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Sensitivity Analysis</span>
            </div>
            
            {/* Main Chart Type Selector */}
            <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-lg text-[10px] font-bold uppercase">
              <button
                onClick={() => setViewType('trend')}
                className={\`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1.5 \${
                  viewType === 'trend' ? 'bg-sky-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }\`}
              >
                <Activity className="h-3 w-3" />
                <span>Sensitivity Curve</span>
              </button>
              <button
                onClick={() => setViewType('results')}
                className={\`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center space-x-1.5 \${
                  viewType === 'results' ? 'bg-sky-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }\`}
              >
                {type === 'cooling' ? <PieIcon className="h-3 w-3" /> : <BarChart2 className="h-3 w-3" />}
                <span>Results Chart</span>
              </button>
            </div>
          </div>

          {/* Sub-selectors (Only visible in Trend mode) */}
          {viewType === 'trend' && type === 'cooling' && (
            <div className="flex flex-wrap bg-slate-950 border border-slate-850 p-1 rounded-lg text-[9px] font-bold uppercase gap-1.5 max-w-full items-center">
              <div className="px-2 py-1 text-slate-500">Benchmarks:</div>
              {coolingBenchmarks.map(b => (
                <div key={b.id} className={\`flex items-center rounded-md border \${b.enabled ? 'bg-slate-800 border-slate-700' : 'opacity-60 border-transparent'} overflow-hidden\`}>
                  <button
                    onClick={() => {
                      const newB = [...coolingBenchmarks];
                      const idx = newB.findIndex(x => x.id === b.id);
                      newB[idx].enabled = !newB[idx].enabled;
                      setCoolingBenchmarks(newB);
                    }}
                    className={\`px-2 py-1 transition-all cursor-pointer \${b.enabled ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-500'}\`}
                  >
                    {b.enabled ? '✓' : '✗'}
                  </button>
                  <input
                    type="number"
                    value={b.value}
                    onChange={(e) => {
                      const newB = [...coolingBenchmarks];
                      const idx = newB.findIndex(x => x.id === b.id);
                      newB[idx].value = Number(e.target.value);
                      setCoolingBenchmarks(newB);
                    }}
                    className="w-10 bg-transparent text-white focus:outline-none text-center py-1"
                    disabled={!b.enabled}
                  />
                  <span className="pr-2 text-[8px] text-slate-400 normal-case">W/m²</span>
                </div>
              ))}
            </div>
          )}`;
          
content = content.replace(targetHeader, replacementHeader);
fs.writeFileSync('src/components/TrendVisualizer.tsx', content);
