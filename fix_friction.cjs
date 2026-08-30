const fs = require('fs');
let content = fs.readFileSync('src/components/FrictionLossReference.tsx', 'utf8');

content = content.replace(
  'Recommended Equal Friction Rate limits (in. w.g. per 100 ft) for different types of ductwork systems.',
  '{isKhmer ? "កម្រិតអត្រាកកិត (Friction Rate) ដែលណែនាំសម្រាប់ប្រព័ន្ធបំពង់ខ្យល់ (in. w.g. / 100 ft)។" : "Recommended Equal Friction Rate limits (in. w.g. per 100 ft) for different types of ductwork systems."}'
);

content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800">Application</th>',
  '<th className="px-4 py-3 border-b border-slate-800">{isKhmer ? "ប្រភេទកម្មវិធី (Application)" : "Application"}</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-sky-400">Supply Rate (in/100ft)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-sky-400">{isKhmer ? "ផ្គត់ផ្គង់ (Supply)" : "Supply Rate"} (in/100ft)</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-amber-400">Return Rate (in/100ft)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center text-amber-400">{isKhmer ? "ត្រលប់ (Return)" : "Return Rate"} (in/100ft)</th>'
);

fs.writeFileSync('src/components/FrictionLossReference.tsx', content, 'utf8');
