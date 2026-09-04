const fs = require('fs');
let code = fs.readFileSync('src/components/UpsSizingCalc.tsx', 'utf-8');

if (!code.includes('EngineeringAuditTrail')) {
  code = code.replace(
    "import TooltipLabel from './TooltipLabel';",
    "import TooltipLabel from './TooltipLabel';\nimport EngineeringAuditTrail from './common/EngineeringAuditTrail';"
  );
  
  const trailCode = `
          {/* Audit Trail */}
          <div className="mt-6">
            <EngineeringAuditTrail
              title="UPS & Battery Sizing Calculation Audit"
              codeReference="IEEE Standard 446 / 1184"
              trail={[
                { symbol: 'P_kw', name: 'Applied Load', value: appliedLoadKw, unit: 'kW' },
                { symbol: 'PF', name: 'Power Factor', value: appliedLoadPf, unit: '' },
                { symbol: 'S_kva', name: 'Apparent Power', formula: 'P_kw / PF', value: results.kva.toFixed(2), unit: 'kVA' },
                { symbol: 'M', name: 'Design Margin', value: appliedDesignMargin, unit: '' },
                { symbol: 'S_req', name: 'Required Capacity', formula: 'S_kva × M', value: results.recommendedKva.toFixed(2), unit: 'kVA' },
                { symbol: 't', name: 'Backup Time', value: appliedBackupTime, unit: 'min' },
                { symbol: 'V_dc', name: 'DC Bus Voltage', value: appliedDcBusVoltage, unit: 'V' },
                { symbol: 'η', name: 'Inverter Efficiency', value: appliedInverterEff, unit: '' },
                { symbol: 'C_ah', name: 'Required Battery Capacity', formula: '(P_kw × 1000 × (t/60)) / (V_dc × η)', value: results.requiredAh.toFixed(2), unit: 'Ah' },
                { symbol: 'N_blocks', name: 'Blocks per String', formula: 'V_dc / V_battery', value: results.blocksPerString, unit: 'blocks' }
              ]}
            />
          </div>
`;
  code = code.replace(
    "                </BarChart>\n              </ResponsiveContainer>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}",
    `                </BarChart>\n              </ResponsiveContainer>\n            </div>\n          </div>\n          ${trailCode}\n        </div>\n      </div>\n    </div>\n  );\n}`
  );
  
  fs.writeFileSync('src/components/UpsSizingCalc.tsx', code);
}
