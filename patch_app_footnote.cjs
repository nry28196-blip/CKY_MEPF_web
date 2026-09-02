const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* Footnote */}
        <div className="mt-8 text-center text-[10px] text-slate-600 font-mono">
          <p>
            CKY_MEPF Engineering Systems Solver &copy; {new Date().getFullYear()}. Certified calculations matching general design and NFPA standards.
          </p>
        </div>`;

const replace = `{/* Professional Disclaimer Footnote */}
        <div className="mt-8 mb-4 max-w-4xl mx-auto p-4 rounded-xl border border-amber-900/30 bg-amber-950/10 text-center">
          <p className="text-[10px] text-amber-500/70 font-mono font-bold uppercase tracking-widest mb-2">Professional Disclaimer</p>
          <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
            This software is an engineering calculation aid. Results must be reviewed by a qualified engineer and checked against the governing code, adopted standard edition, project specifications, AHJ requirements, and manufacturer data before construction or submission.
          </p>
          <p className="text-[9px] text-slate-600 mt-2">
            CKY_MEPF Engineering Systems Solver &copy; {new Date().getFullYear()}.
          </p>
        </div>`;

content = content.replace(target, replace);
fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx footnote");
