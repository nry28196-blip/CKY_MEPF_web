const fs = require('fs');

let content = fs.readFileSync('src/components/ReferenceModal.tsx', 'utf8');

// Add useLanguage import if not exists
if (!content.includes('useLanguage')) {
  content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useLanguage } from '../lib/translations';");
}

// Extract isKhmer and setLanguage
if (!content.includes('const { isKhmer, setLanguage, language } = useLanguage();')) {
  content = content.replace("const [activeTab, setActiveTab] = useState<RefTab>('all');", "const [activeTab, setActiveTab] = useState<RefTab>('all');\n  const { isKhmer, setLanguage, language } = useLanguage();");
}

// Add language switch button to the modal header
const targetHeader = `<div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-950/50 border border-sky-500/20 text-sky-400 rounded-xl">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">MEP Calculation References & Formulas</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Citing official standards and engineering equations for system compliance audits.</p>
            </div>
          </div>
          <button
            onClick={onClose}`;

const replaceHeader = `<div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-950/50 border border-sky-500/20 text-sky-400 rounded-xl">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">{isKhmer ? 'ឯកសារយោង និងរូបមន្តវិស្វកម្ម MEP' : 'MEP Calculation References & Formulas'}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">{isKhmer ? 'ដកស្រង់ស្ដង់ដារផ្លូវការ និងសមីការវិស្វកម្មសម្រាប់ការត្រួតពិនិត្យប្រព័ន្ធ។' : 'Citing official standards and engineering equations for system compliance audits.'}</p>
            </div>
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

// add closing div for the new wrapper around the close button and lang toggle
content = content.replace(`className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 hover:text-white transition-all cursor-pointer hover:border-slate-700"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>`, `className="p-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 hover:text-white transition-all cursor-pointer hover:border-slate-700"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>`);

fs.writeFileSync('src/components/ReferenceModal.tsx', content, 'utf8');
