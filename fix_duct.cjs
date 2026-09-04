const fs = require('fs');
let code = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf-8');

if (!code.includes('EngineeringAuditTrail')) {
  code = code.replace(
    "import TooltipLabel from './TooltipLabel';",
    "import TooltipLabel from './TooltipLabel';\nimport EngineeringAuditTrail from './common/EngineeringAuditTrail';"
  );
  
  const trailCode = `
            {/* Audit Trail */}
            <div className="mt-8">
              <EngineeringAuditTrail
                title="Duct Sizing Calculation Audit (Equal Friction Method)"
                codeReference="ASHRAE Fundamentals Handbook"
                trail={[
                  { symbol: 'Q', name: 'Design Airflow', value: appliedAirflow, unit: 'CFM' },
                  { symbol: 'F', name: 'Target Friction Rate', value: appliedFrictionRate, unit: 'in.wg/100ft' },
                  { symbol: 'D_e', name: 'Equivalent Round Diameter', formula: '((0.10913 × Q^1.9) / F)^(1/5.02)', value: deMain.toFixed(2), unit: 'in', reference: 'Altshul-Tsal Eq.' },
                  { symbol: 'H', name: 'Constrained Height', value: appliedDuctHeight, unit: 'in' },
                  { symbol: 'W', name: 'Required Width (Huebscher Eq)', formula: 'D_e = 1.30 × (W×H)^0.625 / (W+H)^0.25', value: widthMain, unit: 'in' },
                  { symbol: 'A', name: 'Rectangular Area', formula: '(W × H) / 144', value: ((widthMain * appliedDuctHeight)/144).toFixed(2), unit: 'sq.ft' },
                  { symbol: 'V', name: 'Air Velocity', formula: 'Q / A', value: Math.round(velRectMain), unit: 'FPM' }
                ]}
              />
            </div>
`;
  code = code.replace(
    "                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}",
    `                </div>\n              </div>\n            </div>\n            ${trailCode}\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}`
  );
  
  fs.writeFileSync('src/components/DuctSizingCalc.tsx', code);
}
