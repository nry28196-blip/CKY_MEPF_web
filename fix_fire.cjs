const fs = require('fs');
let content = fs.readFileSync('src/components/FireReferenceModal.tsx', 'utf8');

content = content.replace(
  'Standard hydraulic values and allowances per NFPA 13, NFPA 20, and BS EN 12845 guidelines.',
  '{isKhmer ? "តម្លៃអ៊ីដ្រូលីក និងការអនុញ្ញាតស្តង់ដារតាមគោលការណ៍ NFPA 13, NFPA 20 និង BS EN 12845។" : "Standard hydraulic values and allowances per NFPA 13, NFPA 20, and BS EN 12845 guidelines."}'
);

content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800">Hazard Class</th>',
  '<th className="px-4 py-3 border-b border-slate-800">{isKhmer ? "ចំណាត់ថ្នាក់គ្រោះថ្នាក់ (Hazard Class)" : "Hazard Class"}</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Design Density (GPM/ft²)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "កំហាប់រចនា (Design Density)" : "Design Density"} (GPM/ft²)</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Design Area (ft²)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "ផ្ទៃដីរចនា (Design Area)" : "Design Area"} (ft²)</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Duration (Mins)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "រយៈពេល (Duration)" : "Duration"} (Mins)</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Hose Allowance (GPM)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "ប្រព័ន្ធទុយោ (Hose Allowance)" : "Hose Allowance"} (GPM)</th>'
);

// Table 2
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Design Density (mm/min)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "កំហាប់រចនា (Design Density)" : "Design Density"} (mm/min)</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Area of Operation (m²)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "ផ្ទៃដីប្រតិបត្តិការ (Area of Operation)" : "Area of Operation"} (m²)</th>'
);

// Table 3
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800">US K-Factor (GPM/psi½)</th>',
  '<th className="px-4 py-3 border-b border-slate-800">{isKhmer ? "K-Factor (អាមេរិក)" : "US K-Factor"} (GPM/psi½)</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Metric K-Factor (Lpm/bar½)</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "K-Factor (ម៉ែត្រ)" : "Metric K-Factor"} (Lpm/bar½)</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Typical Application</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "កម្មវិធីប្រើប្រាស់ (Typical Application)" : "Typical Application"}</th>'
);
content = content.replace(
  '<th className="px-4 py-3 border-b border-slate-800 text-center">Thread Size</th>',
  '<th className="px-4 py-3 border-b border-slate-800 text-center">{isKhmer ? "ទំហំធ្មេញ (Thread Size)" : "Thread Size"}</th>'
);

fs.writeFileSync('src/components/FireReferenceModal.tsx', content, 'utf8');
