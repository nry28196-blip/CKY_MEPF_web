const fs = require('fs');
let content = fs.readFileSync('src/components/common/EngineeringAuditTrail.tsx', 'utf8');

content = content.replace(
  /<div className="flex items-start">\n                          <Calculator className="w-3 h-3 text-slate-500 mr-1\.5 mt-0\.5 flex-shrink-0" \/>\n                          <span className="text-\[10px\] font-mono text-slate-400 leading-tight">\{v\.formula\}<\/span>\n                        <\/div>\n                        \{v\.inputs && Object\.keys\(v\.inputs\)\.length > 0 && \(/g,
  `<><div className="flex items-start">
                          <Calculator className="w-3 h-3 text-slate-500 mr-1.5 mt-0.5 flex-shrink-0" />
                          <span className="text-[10px] font-mono text-slate-400 leading-tight">{v.formula}</span>
                        </div>
                        {v.inputs && Object.keys(v.inputs).length > 0 && (`
);

content = content.replace(
  /                        \)\}\n                      \) : \(/g,
  `                        )}</>\n                      ) : (`
);

fs.writeFileSync('src/components/common/EngineeringAuditTrail.tsx', content);
