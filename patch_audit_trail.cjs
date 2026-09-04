const fs = require('fs');
let code = fs.readFileSync('src/components/MechanicalCalc.tsx', 'utf-8');

// The request is to explicitly display 'INCOMPLETE' for any intermediate calculation step where required inputs were missing
// So wherever we display `Math.round(results.X)`, we should display `results.status === 'INCOMPLETE' ? 'INCOMPLETE' : Math.round(results.X)`.

const fieldsToPatch = [
    'peopleSensible', 'peopleLatent',
    'lightingSensible', 'equipmentSensible',
    'wallSensible', 'roofSensible', 'windowCondSensible',
    'solarSensible',
    'ventSensible', 'ventLatent',
    'infiltrationSensible', 'infiltrationLatent',
    'totalSensible', 'totalLatent',
    'calculatedTotal'
];

// E.g., {Math.round(results.peopleSensible)} -> {results.status === 'INCOMPLETE' ? 'INCOMPLETE' : Math.round(results.peopleSensible)}
// However, the text says `W` after it. So it might be better to output `INCOMPLETE` without `W` or just `INCOMPLETE W`. 
// "explicitly display 'INCOMPLETE' for any intermediate calculation step"
// Let's replace: {Math.round(results.peopleSensible)} W / {Math.round(results.peopleLatent)} W
// with: {results.status === 'INCOMPLETE' ? 'INCOMPLETE' : Math.round(results.peopleSensible) + ' W / ' + Math.round(results.peopleLatent) + ' W'}
// Wait, the template looks like:
// <div className="text-right">{Math.round(results.peopleSensible)} W / {Math.round(results.peopleLatent)} W</div>
// Let's just do a string replacement on that specific section.

const oldSection = `
                        <div className="text-slate-500">People:</div>
                        <div className="text-right">{Math.round(results.peopleSensible)} W / {Math.round(results.peopleLatent)} W</div>
                        
                        <div className="text-slate-500">Lighting/Equip:</div>
                        <div className="text-right">{Math.round(results.lightingSensible + results.equipmentSensible)} W / 0 W</div>
                        
                        <div className="text-slate-500">Envelope:</div>
                        <div className="text-right">{Math.round(results.wallSensible + results.roofSensible + results.windowCondSensible)} W / 0 W</div>
                        
                        <div className="text-slate-500">Solar (SHGC):</div>
                        <div className="text-right">{Math.round(results.solarSensible)} W / 0 W</div>
                        
                        <div className="text-slate-500">Ventilation:</div>
                        <div className="text-right">{Math.round(results.ventSensible)} W / {Math.round(results.ventLatent)} W</div>
                        
                        <div className="text-slate-500">Infiltration:</div>
                        <div className="text-right">{Math.round(results.infiltrationSensible)} W / {Math.round(results.infiltrationLatent)} W</div>
                        
                        <div className="text-slate-500 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">Total Unfactored:</div>
                        <div className="text-right font-bold text-slate-100 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">{Math.round(results.totalSensible)} W / {Math.round(results.totalLatent)} W</div>
                        <div className="text-slate-500 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">Calculated Final:</div>
                        <div className="text-right font-bold text-amber-400 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">{Math.round(results.calculatedTotal)} W</div>
`;

const newSection = `
                        <div className="text-slate-500">People:</div>
                        <div className="text-right">{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.peopleSensible)} W / \${Math.round(results.peopleLatent)} W\`}</div>
                        
                        <div className="text-slate-500">Lighting/Equip:</div>
                        <div className="text-right">{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.lightingSensible + results.equipmentSensible)} W / 0 W\`}</div>
                        
                        <div className="text-slate-500">Envelope:</div>
                        <div className="text-right">{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.wallSensible + results.roofSensible + results.windowCondSensible)} W / 0 W\`}</div>
                        
                        <div className="text-slate-500">Solar (SHGC):</div>
                        <div className="text-right">{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.solarSensible)} W / 0 W\`}</div>
                        
                        <div className="text-slate-500">Ventilation:</div>
                        <div className="text-right">{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.ventSensible)} W / \${Math.round(results.ventLatent)} W\`}</div>
                        
                        <div className="text-slate-500">Infiltration:</div>
                        <div className="text-right">{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.infiltrationSensible)} W / \${Math.round(results.infiltrationLatent)} W\`}</div>
                        
                        <div className="text-slate-500 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">Total Unfactored:</div>
                        <div className="text-right font-bold text-slate-100 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.totalSensible)} W / \${Math.round(results.totalLatent)} W\`}</div>
                        <div className="text-slate-500 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">Calculated Final:</div>
                        <div className="text-right font-bold text-amber-400 col-span-2 sm:col-span-1 pt-2 border-t border-slate-800">{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.calculatedTotal)} W\`}</div>
`;

if(code.indexOf(oldSection.trim()) === -1) {
    console.log("Could not find exact block. Let's just use regex.");
}

// Regex replace instead just in case whitespace differs
code = code.replace(
    /\{Math\.round\(results\.peopleSensible\)\} W \/ \{Math\.round\(results\.peopleLatent\)\} W/g,
    `{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.peopleSensible)} W / \${Math.round(results.peopleLatent)} W\`}`
);

code = code.replace(
    /\{Math\.round\(results\.lightingSensible \+ results\.equipmentSensible\)\} W \/ 0 W/g,
    `{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.lightingSensible + results.equipmentSensible)} W / 0 W\`}`
);

code = code.replace(
    /\{Math\.round\(results\.wallSensible \+ results\.roofSensible \+ results\.windowCondSensible\)\} W \/ 0 W/g,
    `{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.wallSensible + results.roofSensible + results.windowCondSensible)} W / 0 W\`}`
);

code = code.replace(
    /\{Math\.round\(results\.solarSensible\)\} W \/ 0 W/g,
    `{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.solarSensible)} W / 0 W\`}`
);

code = code.replace(
    /\{Math\.round\(results\.ventSensible\)\} W \/ \{Math\.round\(results\.ventLatent\)\} W/g,
    `{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.ventSensible)} W / \${Math.round(results.ventLatent)} W\`}`
);

code = code.replace(
    /\{Math\.round\(results\.infiltrationSensible\)\} W \/ \{Math\.round\(results\.infiltrationLatent\)\} W/g,
    `{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.infiltrationSensible)} W / \${Math.round(results.infiltrationLatent)} W\`}`
);

code = code.replace(
    /\{Math\.round\(results\.totalSensible\)\} W \/ \{Math\.round\(results\.totalLatent\)\} W/g,
    `{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.totalSensible)} W / \${Math.round(results.totalLatent)} W\`}`
);

code = code.replace(
    /\{Math\.round\(results\.calculatedTotal\)\} W/g,
    `{results.status === 'INCOMPLETE' ? 'INCOMPLETE' : \`\${Math.round(results.calculatedTotal)} W\`}`
);


fs.writeFileSync('src/components/MechanicalCalc.tsx', code);
