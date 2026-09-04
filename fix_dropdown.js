const fs = require('fs');
let content = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf8');
content = content.replace(
  `<option value="single">Single Zone System</option>\n              <option value="multi">Multi-Zone System (VAV/CV)</option>`,
  `<option value="single">Single Zone System</option>\n              <option value="multi_simplified">Multi-Zone Simplified Procedure (6.2.5.3)</option>\n              <option value="multi_alternative">Multi-Zone Alternative Procedure (Appendix A)</option>`
);
fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', content);
