const fs = require('fs');

let content = fs.readFileSync('src/components/StaticPressureCalc.tsx', 'utf8');

const importRegex = /import React.*? from 'react';/;
content = content.replace(importRegex, "import React, { useState, useEffect } from 'react';\nimport ValidationBanner, { ValidationItem } from './ValidationBanner';");

const mainLogicEndRegex = /\s*return \(\s*<div className="space-y-6 animate-fade-in">/;
const validationLogic = `
  // Validation Engine
  const validations: ValidationItem[] = [];
  if (results.designStaticPressure > (isMetric ? 750 : 3.0)) {
    validations.push({
      id: 'sp-high',
      severity: 'error',
      message: \`Total Design Static Pressure (\${results.designStaticPressure.toFixed(isMetric ? 0 : 2)} \${isMetric ? 'Pa' : 'in.wg'}) exceeds typical commercial limits. Fan motor power will be excessively high. Optimize duct sizing or equipment selection.\`,
    });
  } else if (results.designStaticPressure > (isMetric ? 500 : 2.0)) {
    validations.push({
      id: 'sp-warn',
      severity: 'warning',
      message: \`Total Design Static Pressure (\${results.designStaticPressure.toFixed(isMetric ? 0 : 2)} \${isMetric ? 'Pa' : 'in.wg'}) is high. Verify if a medium or high-pressure class duct system is required.\`,
    });
  }
  
  if (safetyFactor < 10) {
    validations.push({
      id: 'sf-low',
      severity: 'warning',
      message: \`Safety factor (\${safetyFactor}%) is low. Standard practice recommends 10% to 15% to account for installation variations.\`,
    });
  }
  
  // Find sections with very high velocity or friction
  results.sectionDetails.forEach(det => {
    if (det.velocity > (isMetric ? 12.7 : 2500)) {
      validations.push({
        id: \`sec-\${det.id}-vel\`,
        severity: 'error',
        message: \`Section "\${det.name}" velocity (\${det.velocity.toFixed(0)} \${isMetric ? 'm/s' : 'FPM'}) is dangerously high and will cause severe acoustic issues.\`,
      });
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <ValidationBanner validations={validations} />`;

content = content.replace(mainLogicEndRegex, validationLogic);

fs.writeFileSync('src/components/StaticPressureCalc.tsx', content);
console.log('Updated StaticPressureCalc');
