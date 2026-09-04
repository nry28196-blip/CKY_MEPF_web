const fs = require('fs');
let code = fs.readFileSync('src/components/Ashrae621VentilationCalc.tsx', 'utf-8');

code = code.replace(/Math\.round\(zr\.result\.vbp\)/g, "zr.result.vbp.toFixed(1)");
code = code.replace(/Math\.round\(zr\.result\.vba\)/g, "zr.result.vba.toFixed(1)");
code = code.replace(/Math\.round\(zr\.result\.vbz\)/g, "zr.result.vbz.toFixed(1)");
code = code.replace(/Math\.round\(zr\.result\.voz\)/g, "zr.result.voz.toFixed(1)");
code = code.replace(/Math\.round\(zr\.result\.pz\)/g, "zr.result.pz.toFixed(1)");

fs.writeFileSync('src/components/Ashrae621VentilationCalc.tsx', code);
