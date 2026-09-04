const fs = require('fs');
let code = fs.readFileSync('src/components/VoltageDropCalc.tsx', 'utf-8');

if (!code.includes('EngineeringAuditTrail')) {
  code = code.replace(
    "import InputAlert from './InputAlert';",
    "import InputAlert from './InputAlert';\nimport EngineeringAuditTrail from './common/EngineeringAuditTrail';"
  );
  
  code = code.replace(
    "const calculateVoltageDrop = () => {",
    `const calculateVoltageDrop = () => {`
  );
  
  // Actually, I can just build the trail in the render method based on the state variables and calculated results.
  
  const trailCode = `
          {/* Audit Trail */}
          <div className="mt-6 w-full">
            <EngineeringAuditTrail
              title="Voltage Drop Calculation Audit"
              codeReference="NEC / IEC"
              trail={[
                { symbol: 'V', name: 'System Voltage', value: voltage, unit: 'V' },
                { symbol: 'I', name: 'Load Current', value: current, unit: 'A' },
                { symbol: 'L', name: 'Cable Length', value: length, unit: 'm' },
                { symbol: 'R', name: 'Resistance', value: cableResistance, unit: 'Ω/km' },
                { symbol: 'X', name: 'Reactance', value: cableReactance, unit: 'Ω/km' },
                { symbol: 'PF', name: 'Power Factor', value: powerFactor, unit: '' },
                { symbol: 'M', name: 'Phase Multiplier', value: phase === 'single' ? 2 : 1.732, unit: '' },
                { symbol: 'Z', name: 'Effective Impedance', formula: 'R×cos(φ) + X×sin(φ)', value: ((cableResistance * powerFactor) + (cableReactance * Math.sin(Math.acos(powerFactor)))).toFixed(4), unit: 'Ω/km' },
                { symbol: 'Vd', name: 'Voltage Drop', formula: '(M × I × L × Z) / 1000', value: results.vd.toFixed(2), unit: 'V', reference: 'Standard Equation' },
                { symbol: '%Vd', name: 'Percentage Drop', formula: '(Vd / V) × 100', value: results.percentage.toFixed(2), unit: '%' }
              ]}
            />
          </div>
`;
  code = code.replace(
    "</div>\n        </div>\n      </div>\n    </div>\n  );\n}",
    `</div>\n        </div>\n        ${trailCode}\n      </div>\n    </div>\n  );\n}`
  );
  
  fs.writeFileSync('src/components/VoltageDropCalc.tsx', code);
}
