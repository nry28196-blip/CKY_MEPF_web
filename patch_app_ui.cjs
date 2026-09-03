const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove the large google-pro borders on the workspace wrapper
code = code.replace(
  /} bg-slate-900\/40 backdrop-blur-md rounded-2xl google-pro-gradient-border google-pro-animated-gradient google-pro-glow overflow-hidden shadow-2xl transition-all duration-300`}>/,
  "} bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl transition-all duration-300`}>"
);

// 2. Remove the google-pro borders on the history sidebar
code = code.replace(
  /className="bg-slate-900\/40 backdrop-blur-md rounded-2xl google-pro-gradient-border google-pro-glow p-5 space-y-4 shadow-xl flex flex-col"/,
  'className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col"'
);

// 3. Change Mechanical / HVAC nav item to use cyan
const mechNavRegex = /id: 'mechanical' as TabType,\s*label: 'Mechanical \/ HVAC',\s*icon: Wind,\s*color: 'text-emerald-400',\s*bgHover: 'hover:bg-slate-900 hover:text-emerald-300',\s*activeBg: 'bg-emerald-950\/30 border-emerald-500\/40 text-emerald-400'/;
const newMechNav = `id: 'mechanical' as TabType, 
      label: 'Mechanical / HVAC', 
      icon: Wind, 
      color: 'text-cyan-400', 
      bgHover: 'hover:bg-slate-900 hover:text-cyan-300', 
      activeBg: 'bg-cyan-950/30 border-cyan-500/40 text-cyan-400'`;

code = code.replace(mechNavRegex, newMechNav);

// 4. Also fix the lock-in highlight on the specific tab content if it exists
code = code.replace(
  /className=\{`p-1 rounded-2xl relative transition-all duration-500 overflow-hidden \$\{\n\s*activeTab === 'mechanical'\s*\?\s*'google-pro-gradient-border google-pro-glow'\s*:\s*''\n\s*\}\`\}/g,
  "className={`p-1 rounded-2xl relative transition-all duration-500 overflow-hidden`}"
);

code = code.replace(
  /className=\{`relative bg-slate-900 border rounded-2xl p-6 transition-colors duration-500 z-10 h-full \$\{\n\s*activeTab === 'mechanical'\s*\?\s*'border-transparent'\s*\/\/ gradient takes over\n\s*:\s*'border-slate-800'\n\s*\}\`\}/g,
  "className={`relative bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-colors duration-500 z-10 h-full`}"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx UI");
