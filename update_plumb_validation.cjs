const fs = require('fs');

let content = fs.readFileSync('src/components/PlumbingCalc.tsx', 'utf8');

const importRegex = /import React.*? from 'react';/;
content = content.replace(importRegex, "import React, { useState, useEffect } from 'react';\nimport ValidationBanner, { ValidationItem } from './ValidationBanner';");

const mainLogicEndRegex = /\s*const handleSave = \(\) => {/;
const validationLogic = `
  // Validation Engine
  const validations: ValidationItem[] = [];
  if (subTab === 'fixtures') {
    if (designVelocity > 2.4) {
      validations.push({
        id: 'vel-high',
        severity: 'error',
        message: \`Design velocity (\${designVelocity} m/s) exceeds the standard maximum limit of 2.4 m/s. This can cause severe pipe erosion, cavitation, and water hammer.\`,
      });
    } else if (designVelocity > 1.8) {
      validations.push({
        id: 'vel-warn',
        severity: 'warning',
        message: \`Design velocity (\${designVelocity} m/s) is high. Ensure proper pipe supports and consider water hammer arrestors.\`,
      });
    }

    if (slope < 1) {
      validations.push({
        id: 'slope-low',
        severity: 'error',
        message: \`Sewage pipe slope (\${slope}%) is below the absolute minimum of 1.0%. This will lead to solid waste blockages.\`,
      });
    } else if (slope < 2 && (totalWSFU <= 20 || totalDU <= 20)) {
      validations.push({
        id: 'slope-warn',
        severity: 'warning',
        message: \`A minimum slope of 2.0% is typically recommended for branches with low fixture unit loads to maintain self-cleansing velocity.\`,
      });
    }
  } else if (subTab === 'tanks') {
    if (storageDays < 1) {
      validations.push({
        id: 'storage-low',
        severity: 'warning',
        message: \`Storage days (\${storageDays}) is below 1. Ensure the municipal water supply is highly reliable, or increase storage capacity.\`,
      });
    }
    if (septicDesludgeInterval > 5) {
      validations.push({
        id: 'desludge-high',
        severity: 'warning',
        message: \`Septic desludge interval (\${septicDesludgeInterval} years) is unusually long. Standard intervals are typically 1 to 5 years. This significantly inflates tank volume.\`,
      });
    }
  }

  const handleSave = () => {`;

content = content.replace(mainLogicEndRegex, validationLogic);

const renderPointRegex = /\s*<div className="flex flex-col sm:flex-row gap-3 mt-4">/;
const renderValidationBanner = `
          <ValidationBanner validations={validations} />
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">`;

content = content.replace(renderPointRegex, renderValidationBanner);

fs.writeFileSync('src/components/PlumbingCalc.tsx', content);
console.log('Updated PlumbingCalc');
