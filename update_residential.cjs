const fs = require('fs');
let content = fs.readFileSync('src/components/ResidentialVentilationCalc.tsx', 'utf8');

// add import
content = content.replace(
  `import TooltipLabel from './TooltipLabel';`,
  `import TooltipLabel from './TooltipLabel';\nimport EngineeringAuditTrail from './common/EngineeringAuditTrail';`
);

// add audit trail
const auditTrail = `
              <div className="mt-4 pt-4 border-t border-purple-900/30 w-full z-10 text-left">
                 <EngineeringAuditTrail
                    codeReference="ASHRAE 62.2"
                    title="Whole-Dwelling Audit Trail"
                    trail={[
                       { symbol: 'A_floor', name: 'Floor Area', value: floorArea, unit: areaUnit },
                       { symbol: 'N_br', name: 'Bedrooms', value: bedrooms, unit: '' },
                       { symbol: 'Qtot', name: 'Total Required Ventilation Rate', formula: isMetric ? '0.15 × A_floor + 3.5 × (N_br + 1)' : '0.03 × A_floor + 7.5 × (N_br + 1)', value: Math.ceil(totalAirflow), unit: flowUnit, reference: 'Eq. 4.1.1' },
                       { symbol: 'Qinf', name: 'Infiltration Rate', value: qInf, unit: flowUnit },
                       { symbol: 'Φ', name: 'Infiltration Credit Factor', value: phi, unit: '' },
                       { symbol: 'Qfan', name: 'Required Fan Airflow', formula: 'Qtot - Φ × Qinf', value: Math.ceil(qFan), unit: flowUnit, reference: 'Eq. 4.1.2' }
                    ]}
                 />
              </div>
`;

content = content.replace(
  `<p className="text-[10px] text-slate-500 mt-2">Qfan = Qtot - Φ * Qinf</p>\n              </div>`,
  `<p className="text-[10px] text-slate-500 mt-2">Qfan = Qtot - Φ * Qinf</p>\n              ${auditTrail}\n              </div>`
);

fs.writeFileSync('src/components/ResidentialVentilationCalc.tsx', content);
