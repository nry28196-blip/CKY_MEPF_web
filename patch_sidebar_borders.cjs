const fs = require('fs');
let code = fs.readFileSync('src/components/SidebarConversionList.tsx', 'utf8');

code = code.replace(/google-pro-gradient-border google-pro-glow/g, 'border border-slate-800');

fs.writeFileSync('src/components/SidebarConversionList.tsx', code);
console.log("Patched SidebarConversionList");
