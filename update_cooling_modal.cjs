const fs = require('fs');
let content = fs.readFileSync('src/components/CoolingLoadReference.tsx', 'utf8');

if (!content.includes('useLanguage')) {
  content = content.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '../lib/translations';");
}

if (!content.includes('const { isKhmer, setLanguage, language } = useLanguage();')) {
  content = content.replace("if (!isOpen) return null;", "const { isKhmer, setLanguage, language } = useLanguage();\n  if (!isOpen) return null;");
}

const targetHeader = `<div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Cooling Load Estimation Rules of Thumb</h2>
          </div>
          <button 
            onClick={onClose}`;

const replaceHeader = `<div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{isKhmer ? 'ឯកសារយោងបន្ទុកម៉ាស៊ីនត្រជាក់' : 'Cooling Load Estimation Rules of Thumb'}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
              className="px-3 py-1.5 text-[10px] font-bold text-sky-400 bg-sky-950/40 border border-sky-900/50 hover:bg-sky-900/30 hover:border-sky-500/30 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
            >
              {isKhmer ? 'English' : 'ភាសាខ្មែរ'}
            </button>
            <button 
              onClick={onClose}`;

content = content.replace(targetHeader, replaceHeader);

content = content.replace(`className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>`, `className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>`);

fs.writeFileSync('src/components/CoolingLoadReference.tsx', content, 'utf8');
