const fs = require('fs');
let content = fs.readFileSync('src/components/FireCalc.tsx', 'utf8');

const targetStr = '<div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-850">';
const replaceStr = `        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRefModalOpen(true)}
            className="flex items-center space-x-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>Reference</span>
          </button>
          <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-850">`;

content = content.replace(targetStr, replaceStr);

// Now we need to add the closing div after the toggleStandard buttons
const bsStandardBtnEnd = `            BS STANDARD
          </button>
        </div>`;

content = content.replace(bsStandardBtnEnd, bsStandardBtnEnd + '\n        </div>');

fs.writeFileSync('src/components/FireCalc.tsx', content);
