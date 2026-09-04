const fs = require('fs');
let code = fs.readFileSync('src/components/ElvUpsSizingCalc.tsx', 'utf-8');

if (!code.includes('EngineeringAuditTrail')) {
  code = code.replace(
    "import TooltipLabel from './TooltipLabel';",
    "import TooltipLabel from './TooltipLabel';\nimport EngineeringAuditTrail from './common/EngineeringAuditTrail';"
  );
  
  const trailCode = `
          {/* Audit Trail */}
          <div className="mt-6">
            <EngineeringAuditTrail
              title="ELV Rack-Mount UPS Sizing Audit"
              trail={[
                { symbol: 'P_w', name: 'Applied Load', value: appliedLoadWatts, unit: 'W' },
                { symbol: 'PF', name: 'Power Factor', value: appliedLoadPf, unit: '' },
                { symbol: 'S_kva', name: 'Apparent Power', formula: '(P_w / 1000) / PF', value: results.kva.toFixed(3), unit: 'kVA' },
                { symbol: 'M', name: 'Design Margin', value: appliedDesignMargin, unit: '' },
                { symbol: 'S_req', name: 'Required Capacity', formula: 'S_kva × M', value: results.recommendedKva.toFixed(3), unit: 'kVA' },
                { symbol: 't', name: 'Backup Time', value: appliedBackupTime, unit: 'min' },
                { symbol: 'V_dc', name: 'Estimated DC Bus', value: results.dcBusVoltage, unit: 'V' },
                { symbol: 'η', name: 'Estimated Inverter Eff.', value: 0.9, unit: '' },
                { symbol: 'C_ah', name: 'Required Battery Capacity', formula: '(P_w × (t/60)) / (V_dc × η)', value: results.requiredAh.toFixed(2), unit: 'Ah' }
              ]}
            />
          </div>
`;
  code = code.replace(
    "                </BarChart>\n              </ResponsiveContainer>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}",
    `                </BarChart>\n              </ResponsiveContainer>\n            </div>\n          </div>\n          ${trailCode}\n        </div>\n      </div>\n    </div>\n  );\n}`
  );
  
  fs.writeFileSync('src/components/ElvUpsSizingCalc.tsx', code);
}
