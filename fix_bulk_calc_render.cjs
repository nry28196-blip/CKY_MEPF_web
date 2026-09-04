const fs = require('fs');
let code = fs.readFileSync('src/components/BulkCalc.tsx', 'utf-8');

// Add an option to the dropdown
code = code.replace(
  `<option value="pipe">Plumbing: Pipe Velocity</option>`,
  `<option value="pipe">Plumbing: Pipe Velocity</option>\n            <option value="dashboard">Summary Dashboard</option>`
);

// We need to inject the Dashboard rendering
const renderDashboard = `
  const renderDashboard = () => {
    let totalCooling = 0;
    let totalAirflow = 0;
    let totalFireWater = 0;
    
    const coolingData: any[] = [];
    const airflowData: any[] = [];
    const fireData: any[] = [];

    history.forEach(item => {
      if (item.tab === 'mechanical' && item.subType === 'cooling') {
        const match = item.summary.match(/([\\d\\.]+)\\s*TR/);
        if (match) {
          const val = parseFloat(match[1]);
          totalCooling += val;
          coolingData.push({ name: item.title || 'Cooling', value: val });
        }
      }
      if (item.tab === 'mechanical' && item.subType === 'ductSizing') {
        if (item.parameters && item.parameters.airflow) {
          const val = parseFloat(item.parameters.airflow);
          totalAirflow += val;
          airflowData.push({ name: item.title || 'Duct', value: val });
        }
      }
      if (item.tab === 'fire') {
        const match = item.summary.match(/Flows?:\\s*([\\d\\.]+)\\s*Lpm/i);
        if (match) {
          const val = parseFloat(match[1]);
          totalFireWater += val;
          fireData.push({ name: item.title || 'Fire', value: val });
        }
      }
    });

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    return (
      <div className="space-y-8 animate-fade-in pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Cooling Capacity</span>
            <span className="text-4xl font-black text-sky-400 font-mono">{totalCooling.toFixed(1)} <span className="text-lg">TR</span></span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Airflow</span>
            <span className="text-4xl font-black text-emerald-400 font-mono">{Math.round(totalAirflow)} <span className="text-lg">CFM</span></span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col items-center justify-center">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Fire Water Demand</span>
            <span className="text-4xl font-black text-rose-400 font-mono">{Math.round(totalFireWater)} <span className="text-lg">Lpm</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-sm font-semibold text-white mb-6">Cooling Breakdown</h3>
            {coolingData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={coolingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tick={{fill: '#94a3b8'}} />
                    <YAxis stroke="#94a3b8" fontSize={10} tick={{fill: '#94a3b8'}} />
                    <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc'}} />
                    <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} name="TR" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500 italic text-sm">No cooling data saved.</div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-sm font-semibold text-white mb-6">Airflow Breakdown</h3>
            {airflowData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={airflowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tick={{fill: '#94a3b8'}} />
                    <YAxis stroke="#94a3b8" fontSize={10} tick={{fill: '#94a3b8'}} />
                    <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc'}} />
                    <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} name="CFM" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500 italic text-sm">No airflow data saved.</div>
            )}
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg md:col-span-2">
            <h3 className="text-sm font-semibold text-white mb-6">Fire Water Demand Breakdown</h3>
            {fireData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fireData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => \`\${name} (\${(percent * 100).toFixed(0)}%)\`}
                    >
                      {fireData.map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500 italic text-sm">No fire data saved.</div>
            )}
          </div>
        </div>
      </div>
    );
  };
`;

code = code.replace(`  return (\n    <div className="w-full`, renderDashboard + `\n  return (\n    <div className="w-full`);

const tableCode = `<div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">`;

code = code.replace(
  tableCode,
  `{systemType === 'dashboard' ? (\n        renderDashboard()\n      ) : (\n      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">`
);

code = code.replace(
  `</div>\n    </div>\n  );\n}`,
  `</div>\n      )}\n    </div>\n  );\n}`
);


// wait, if systemType is dashboard, we should disable the Export CSV button or something?
code = code.replace(
  `          <button\n            onClick={handleExportCsv}`,
  `          {systemType !== 'dashboard' && (\n          <button\n            onClick={handleExportCsv}`
);

code = code.replace(
  `            <span>Export CSV</span>\n          </button>\n        </div>`,
  `            <span>Export CSV</span>\n          </button>\n          )}\n        </div>`
);

fs.writeFileSync('src/components/BulkCalc.tsx', code);
