const fs = require('fs');

let content = fs.readFileSync('src/components/DuctSizingCalc.tsx', 'utf8');

const importRegex = /import React.*? from 'react';/;
content = content.replace(importRegex, "import React, { useState, useEffect } from 'react';\nimport ValidationBanner, { ValidationItem } from './ValidationBanner';");

const mainLogicEndRegex = /\s*\/\/\s*Preset heights standard in duct manufacturing/;
const validationLogic = `
  // Validation Engine
  const validations: ValidationItem[] = [];
  if (velRectMain > appliedVelocityLimit) {
    validations.push({
      id: 'vel-main',
      severity: 'error',
      message: \`Main duct velocity (\${Math.round(velRectMain)} FPM) exceeds the design limit (\${appliedVelocityLimit} FPM). Increase duct size or reduce airflow.\`,
    });
  }
  if (appliedFrictionRate > 0.15) {
    validations.push({
      id: 'fric-high',
      severity: 'warning',
      message: \`Friction rate (\${appliedFrictionRate} in.wg/100ft) is above the typical maximum for commercial systems (0.15). This may cause high energy consumption and noise.\`,
    });
  }
  if (enableSplitting) {
    const highVelBranches = branches.filter(b => b.status === 'danger');
    if (highVelBranches.length > 0) {
       validations.push({
         id: 'vel-branch-danger',
         severity: 'error',
         message: \`\${highVelBranches.length} branch(es) exceed the velocity limit.\`,
       });
    }
    const warnVelBranches = branches.filter(b => b.status === 'warning');
    if (warnVelBranches.length > 0) {
       validations.push({
         id: 'vel-branch-warning',
         severity: 'warning',
         message: \`\${warnVelBranches.length} branch(es) are nearing the velocity limit.\`,
       });
    }
  }

  // Preset heights standard in duct manufacturing`;

content = content.replace(mainLogicEndRegex, validationLogic);

const bottomButtonsRegex = /{[\s\S]*?\/\* Bottom utilities \*\//;
const renderValidationBanner = `
              {/* Validation Engine Banner */}
              <ValidationBanner validations={validations} />

              {/* Bottom utilities */`;

content = content.replace(/\s*{\/\*\s*Bottom utilities\s*\*\//, renderValidationBanner);

fs.writeFileSync('src/components/DuctSizingCalc.tsx', content);
console.log('Updated DuctSizingCalc');
