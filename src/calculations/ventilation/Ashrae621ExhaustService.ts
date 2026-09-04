import { EXHAUST_2019, EXHAUST_2022, EXHAUST_2025, ExhaustSpaceType, AshraeEdition } from '../data/ashrae621/ExhaustData';

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

    const ashraeRate = input.isMetric ? spaceType.ashraeRateMet : spaceType.ashraeRateImp;
    const imcRate = input.isMetric ? spaceType.imcRateMet : spaceType.imcRateImp;

    const ashraeReq = ashraeRate * input.quantity;
    const imcReq = imcRate * input.quantity;
    const projectReq = input.projectOverride || 0;
    const mfgReq = input.mfgOverride || 0;

    let governingRequired = 0;
    let governingSource = '';
    let status: 'PASS' | 'WARNING' | 'FAIL' | 'INCOMPLETE' = 'PASS';
    let warning = undefined;

    // As requested: Do not automatically MAX everything without context. 
    // Identify governing requirement based on design basis.
    if (input.localCodeAdopted === false || input.localCodeAdopted === undefined) {
      status = 'WARNING';
      warning = 'Local/AHJ governing requirement not established. Showing max for safety only.';
      governingRequired = Math.max(ashraeReq, imcReq, projectReq, mfgReq);
      governingSource = 'Max observed (Warning: AHJ unverified)';
    } else {
      const codeMin = Math.max(ashraeReq, imcReq);
      governingRequired = Math.max(codeMin, projectReq, mfgReq);
      if (governingRequired === mfgReq && mfgReq > 0) governingSource = 'Manufacturer Requirement';
      else if (governingRequired === projectReq && projectReq > 0) governingSource = 'Project Override';
      else if (governingRequired === imcReq && imcReq > ashraeReq) governingSource = 'IMC Minimum';
      else governingSource = 'ASHRAE Minimum';
    }

    return {
      ashraeReq,
      imcReq,
      projectReq,
      mfgReq,
      governingRequired,
      governingSource,
      classification: spaceType.ashraeClass,
      status,
      warning
    };
  }
}
