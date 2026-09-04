const fs = require('fs');
let code = fs.readFileSync('src/components/SystemPerformanceCalc.tsx', 'utf-8');

if (!code.includes('EngineeringAuditTrail')) {
  code = code.replace(
    "import TooltipLabel from './TooltipLabel';",
    "import TooltipLabel from './TooltipLabel';\nimport EngineeringAuditTrail from './common/EngineeringAuditTrail';"
  );
  
  const trailCode = `
      {/* Audit Trail */}
      <div className="mt-6 w-full">
        <EngineeringAuditTrail
          title="System Performance Calculation Audit"
          codeReference="ASHRAE Standard 90.1"
          trail={[
            { symbol: 'Q_oa', name: 'Outdoor Air', value: qOutdoorAir, unit: flowUnit },
            { symbol: 'Q_ra', name: 'Return Air', value: qReturnAir, unit: flowUnit },
            { symbol: 'Q_total', name: 'Total System Airflow', formula: 'Q_oa + Q_ra', value: result.qTotalStd, unit: flowUnit },
            { symbol: 'Eρ', name: 'Air Density Ratio', value: densityRatio.toFixed(3), unit: '' },
            { symbol: 'Q_act', name: 'Actual Total Airflow', formula: 'Q_total / Eρ', value: result.qTotalAct.toFixed(1), unit: flowUnit },
            { symbol: 'L', name: 'Critical Duct Length', value: criticalDuctLength, unit: lengthUnit },
            { symbol: 'F', name: 'Friction Rate', value: ductFrictionRate, unit: frictionUnit },
            { symbol: 'ΔP_f', name: 'Fitting Losses', value: fittingLosses, unit: pressureUnit },
            { symbol: 'ΔP_eq', name: 'Equipment Drop', value: equipmentPressureDrop, unit: pressureUnit },
            { symbol: 'ΔP_total', name: 'Total Static Pressure', formula: 'L×F (converted) + ΔP_f + ΔP_eq', value: result.tsp.toFixed(2), unit: pressureUnit },
            { symbol: 'P_fan', name: 'Fan Shaft Power', formula: isMetric ? '(Q_act × ΔP_total) / (1000 × η_fan)' : '(Q_act × ΔP_total) / (6356 × η_fan)', value: result.fanPower.toFixed(2), unit: powerUnit },
            { symbol: 'P_motor', name: 'Motor Input Power', formula: 'P_fan / η_motor', value: result.motorPower.toFixed(2), unit: powerUnit }
          ]}
        />
      </div>
`;
  code = code.replace(
    "            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}",
    `            </div>\n          </div>\n        </div>\n      </div>\n      ${trailCode}\n    </div>\n  );\n}`
  );
  
  fs.writeFileSync('src/components/SystemPerformanceCalc.tsx', code);
}
