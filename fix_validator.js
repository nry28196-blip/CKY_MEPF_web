import fs from 'fs';
const file = 'src/calculations/ventilation/DataProvenanceValidationService.ts';
let content = fs.readFileSync(file, 'utf8');

// Update validateProvenance to also accept expectedValue
content = content.replace(
  /static validateProvenance\(\s*provenance: DataProvenance \| undefined,\s*expectedStandard: string,\s*expectedEdition: string\s*\): boolean {/g,
  `static validateProvenance(
    provenance: DataProvenance | undefined,
    expectedStandard: string,
    expectedEdition: string,
    expectedValue?: number | string | boolean
  ): boolean {`
);

content = content.replace(
  /if \(!this\.isDateValid\(provenance\.verificationDate\)\) return false;/g,
  `if (!this.isDateValid(provenance.verificationDate)) return false;
    
    // 2. ACTUAL VALUE-TO-PROVENANCE VALIDATION
    if (expectedValue !== undefined) {
      if (provenance.value !== expectedValue) return false;
    }`
);

// We need to update validateSpaceTypeData to pass the expected values
content = content.replace(
  /if \(!this\.validateProvenance\(spaceType\.provenance\.rp, expectedStandard, expectedEdition\)\) reasons\.push\('Unverified Rp'\);/g,
  `if (!this.validateProvenance(spaceType.provenance.rp, expectedStandard, expectedEdition, spaceType.rpMetric)) reasons.push('Unverified Rp');`
);

content = content.replace(
  /if \(!this\.validateProvenance\(spaceType\.provenance\.ra, expectedStandard, expectedEdition\)\) reasons\.push\('Unverified Ra'\);/g,
  `if (!this.validateProvenance(spaceType.provenance.ra, expectedStandard, expectedEdition, spaceType.raMetric)) reasons.push('Unverified Ra');`
);

content = content.replace(
  /if \(useDefaultOccupancy && !this\.validateProvenance\(spaceType\.provenance\.defaultOccupancy, expectedStandard, expectedEdition\)\) \{/g,
  `// 3. DEFAULT OCCUPANCY MUST BE VALIDATED WHEN PRESENT
      const shouldValidateOccupancy = useDefaultOccupancy || spaceType.defaultOccupancyMetric !== undefined;
      if (shouldValidateOccupancy && !this.validateProvenance(spaceType.provenance.defaultOccupancy, expectedStandard, expectedEdition, spaceType.defaultOccupancyMetric)) {`
);

content = content.replace(
  /if \(spaceType\.provenance\.reference && !this\.validateProvenance\(spaceType\.provenance\.reference, expectedStandard, expectedEdition\)\) \{/g,
  `if (spaceType.provenance.reference && !this.validateProvenance(spaceType.provenance.reference, expectedStandard, expectedEdition, spaceType.reference)) {`
);

// We need to update checkParentConsistency
content = content.replace(
  /!this\.checkParentConsistency\(spaceType, spaceType\.provenance\.defaultOccupancy\)/g,
  `(shouldValidateOccupancy && !this.checkParentConsistency(spaceType, spaceType.provenance.defaultOccupancy))`
);

// Now update validateEzData
content = content.replace(
  /if \(!this\.validateProvenance\(ezConfig\.provenance\.ez, expectedStandard, expectedEdition\)\) reasons\.push\('Unverified Ez'\);/g,
  `if (!this.validateProvenance(ezConfig.provenance.ez, expectedStandard, expectedEdition, ezConfig.ez)) reasons.push('Unverified Ez');`
);

content = content.replace(
  /if \(!this\.validateProvenance\(ezConfig\.provenance\.applicability, expectedStandard, expectedEdition\)\) reasons\.push\('Unverified Ez Applicability'\);/g,
  `if (!this.validateProvenance(ezConfig.provenance.applicability, expectedStandard, expectedEdition, ezConfig.applicableCondition)) reasons.push('Unverified Ez Applicability');`
);

content = content.replace(
  /if \(ezConfig\.provenance\.reference && !this\.validateProvenance\(ezConfig\.provenance\.reference, expectedStandard, expectedEdition\)\) \{/g,
  `if (ezConfig.provenance.reference && !this.validateProvenance(ezConfig.provenance.reference, expectedStandard, expectedEdition, ezConfig.reference)) {`
);

// Now update validateExhaustData
content = content.replace(
  /if \(!this\.validateProvenance\(exhaustType\.provenance\.rate, expectedStandard, expectedEdition\)\) reasons\.push\('Unverified Exhaust Rate'\);/g,
  `if (!this.validateProvenance(exhaustType.provenance.rate, expectedStandard, expectedEdition, exhaustType.rate)) reasons.push('Unverified Exhaust Rate');`
);

content = content.replace(
  /if \(exhaustType\.provenance\.unitType && !this\.validateProvenance\(exhaustType\.provenance\.unitType, expectedStandard, expectedEdition\)\) reasons\.push\('Unverified Unit Type'\);/g,
  `if (exhaustType.provenance.unitType && !this.validateProvenance(exhaustType.provenance.unitType, expectedStandard, expectedEdition, exhaustType.unitType)) reasons.push('Unverified Unit Type');`
);

content = content.replace(
  /if \(exhaustType\.provenance\.exhaustClass && !this\.validateProvenance\(exhaustType\.provenance\.exhaustClass, expectedStandard, expectedEdition\)\) reasons\.push\('Unverified Exhaust Class'\);/g,
  `if (exhaustType.provenance.exhaustClass && !this.validateProvenance(exhaustType.provenance.exhaustClass, expectedStandard, expectedEdition, exhaustType.exhaustClass)) reasons.push('Unverified Exhaust Class');`
);

content = content.replace(
  /if \(exhaustType\.provenance\.operatingCondition && !this\.validateProvenance\(exhaustType\.provenance\.operatingCondition, expectedStandard, expectedEdition\)\) reasons\.push\('Unverified Operating Condition'\);/g,
  `if (exhaustType.provenance.operatingCondition && !this.validateProvenance(exhaustType.provenance.operatingCondition, expectedStandard, expectedEdition, exhaustType.operatingCondition)) reasons.push('Unverified Operating Condition');`
);

fs.writeFileSync(file, content);
