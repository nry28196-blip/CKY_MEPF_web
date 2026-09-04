const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf-8');

// We can replace the <p> elements that render the result values to check the status.
// Helper:
function replaceResult(code, pattern, expr) {
    return code.replace(pattern, `{results.status === 'INCOMPLETE' ? '-' : ${expr}}`);
}

code = code.replace(
    /\{Math\.round\(results\.calculatedTotal\)\.toLocaleString\(\)\}/,
    `{results.status === 'INCOMPLETE' ? '-' : Math.round(results.calculatedTotal).toLocaleString()}`
);
code = code.replace(
    /\{Math\.round\(results\.totalSensible\)\.toLocaleString\(\)\}/,
    `{results.status === 'INCOMPLETE' ? '-' : Math.round(results.totalSensible).toLocaleString()}`
);
code = code.replace(
    /\{Math\.round\(results\.totalLatent\)\.toLocaleString\(\)\}/,
    `{results.status === 'INCOMPLETE' ? '-' : Math.round(results.totalLatent).toLocaleString()}`
);
code = code.replace(
    /\{Math\.round\(results\.watts\)\.toLocaleString\(\)\}/,
    `{results.status === 'INCOMPLETE' ? '-' : Math.round(results.watts).toLocaleString()}`
);
code = code.replace(
    /\{Math\.round\(results\.btu\)\.toLocaleString\(\)\}/,
    `{results.status === 'INCOMPLETE' ? '-' : Math.round(results.btu).toLocaleString()}`
);
code = code.replace(
    /\{\(results\.tons\)\.toFixed\(2\)\}/,
    `{results.status === 'INCOMPLETE' ? '-' : (results.tons).toFixed(2)}`
);
code = code.replace(
    /\{Math\.ceil\(\(results\.tons\) \* 2\) \/ 2\}/,
    `{results.status === 'INCOMPLETE' ? '-' : Math.ceil((results.tons) * 2) / 2}`
);
code = code.replace(
    /\{Math\.round\(\(results\.totalSensible\) \/ 13\.31 \* 2\.11888\)\.toLocaleString\(\)\}/,
    `{results.status === 'INCOMPLETE' ? '-' : Math.round((results.totalSensible) / 13.31 * 2.11888).toLocaleString()}`
);
code = code.replace(
    /\{Math\.round\(\(results\.watts\) \/ 3\.5\)\.toLocaleString\(\)\}/,
    `{results.status === 'INCOMPLETE' ? '-' : Math.round((results.watts) / 3.5).toLocaleString()}`
);

// We also need to avoid rendering the chart when INCOMPLETE.
code = code.replace(
    /\{results\.watts > 0 && \(/,
    `{results.status !== 'INCOMPLETE' && results.watts > 0 && (`
);

fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
