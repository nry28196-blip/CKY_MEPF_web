const fs = require('fs');

const code = `import { EXHAUST_2019, EXHAUST_2022, EXHAUST_2025, ExhaustSpaceType, AshraeEdition } from '../data/ashrae621/ExhaustData';
import { UnitConversionService } from '../services/UnitConversionService';

export type { ExhaustSpaceType, AshraeEdition };

export interface ExhaustInput {
  spaceId: string;
  edition: AshraeEdition;
  quantity: number; // area or fixtures
  projectOverride?: number;
  mfgOverride?: number;
  isMetric: boolean;
  localCodeAdopted?: boolean;
}

export interface ExhaustResult {
  ashraeReq: number;
  imcReq: number;
  projectReq: number;
  mfgReq: number;
  governingRequired: number; // Need this specifically for the UI
  governingSource: string;
  classification: string;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE';
  warning?: string;
}

export class Ashrae621ExhaustService {
  static getSpaces(edition: AshraeEdition): ExhaustSpaceType[] {
    if (edition === '2019') return EXHAUST_2019;
    if (edition === '2025') return EXHAUST_2025;
    return EXHAUST_2022;
  }

  static getSpaceById(id: string, edition: AshraeEdition): ExhaustSpaceType | undefined {
    return this.getSpaces(edition).find(s => s.id === id);
  }

  static calculateSpaceExhaust(input: ExhaustInput): ExhaustResult {
    const spaceType = this.getSpaceById(input.spaceId, input.edition);
    if (!spaceType) {
      return {
        ashraeReq: 0, imcReq: 0, projectReq: 0, mfgReq: 0, governingRequired: 0,
        governingSource: 'None', classification: 'Not Evaluated', status: 'INCOMPLETE'
      };
    }

    // 1. Convert to Canonical Metric
    let canonicalQuantity = input.quantity;
    if (!input.isMetric && spaceType.ashraeUnit === 'area') {
      canonicalQuantity = UnitConversionService.sqftToSqM(input.quantity);
    }
    
    let canonicalProjectReq = input.projectOverride !== undefined 
      ? (input.isMetric ? input.projectOverride : UnitConversionService.cfmToLs(input.projectOverride))
      : 0;
      
    let canonicalMfgReq = input.mfgOverride !== undefined
      ? (input.isMetric ? input.mfgOverride : UnitConversionService.cfmToLs(input.mfgOverride))
      : 0;

    // 2. Perform Canonical Metric Calculation
    const ashraeReqMetric = spaceType.ashraeRateMet * canonicalQuantity;
    const imcReqMetric = spaceType.imcRateMet * canonicalQuantity;
    
    let governingRequiredMetric = 0;
    let governingSource = '';
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' = 'PASS';
    let warning = undefined;

    if (input.localCodeAdopted === false || input.localCodeAdopted === undefined) {
      status = 'WARNING';
      warning = 'Local/AHJ governing requirement not established. Showing max for safety only.';
      governingRequiredMetric = Math.max(ashraeReqMetric, imcReqMetric, canonicalProjectReq, canonicalMfgReq);
      governingSource = 'Max observed (Warning: AHJ unverified)';
    } else {
      const codeMin = Math.max(ashraeReqMetric, imcReqMetric);
      governingRequiredMetric = Math.max(codeMin, canonicalProjectReq, canonicalMfgReq);
      if (governingRequiredMetric === canonicalMfgReq && canonicalMfgReq > 0) governingSource = 'Manufacturer Requirement';
      else if (governingRequiredMetric === canonicalProjectReq && canonicalProjectReq > 0) governingSource = 'Project Override';
      else if (governingRequiredMetric === imcReqMetric && imcReqMetric > ashraeReqMetric) governingSource = 'IMC Minimum';
      else governingSource = 'ASHRAE Minimum';
    }

    // 3. Convert results back to Imperial if needed
    const resultConversion = (valMetric: number) => input.isMetric ? valMetric : UnitConversionService.lsToCfm(valMetric);

    return {
      ashraeReq: resultConversion(ashraeReqMetric),
      imcReq: resultConversion(imcReqMetric),
      projectReq: resultConversion(canonicalProjectReq),
      mfgReq: resultConversion(canonicalMfgReq),
      governingRequired: resultConversion(governingRequiredMetric),
      governingSource,
      classification: spaceType.ashraeClass,
      status,
      warning
    };
  }
}
`;
fs.writeFileSync('src/calculations/ventilation/Ashrae621ExhaustService.ts', code);
