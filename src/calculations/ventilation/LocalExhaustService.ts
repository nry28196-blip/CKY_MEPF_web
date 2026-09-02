import { ExhaustCategory, EXHAUST_CATEGORIES, ExhaustType } from '../data/exhaust/LocalExhaustData';

export interface LocalExhaustInput {
  categoryId: string;
  quantity: number; // area or unit count
  customRate?: number; // explicitly specified if custom
  isMetric: boolean;
}

export interface LocalExhaustResult {
  categoryId: string;
  categoryName: string;
  type: ExhaustType;
  requiredExhaust: number;
  operatingMode: string;
  reference: string;
  unitLabel: string;
}

export interface MakeupAirBalanceResult {
  totalExhaust: number;
  makeupAirProvided: number;
  netPressurization: number;
  status: 'Positive' | 'Neutral' | 'Negative';
  warningMessage?: string;
}

export class LocalExhaustService {
  /**
   * Retrieves exhaust categories
   */
  static getCategories(): ExhaustCategory[] {
    return EXHAUST_CATEGORIES;
  }

  /**
   * Filters categories by type (Kitchen, Toilet, Process, Hazardous, General)
   */
  static getCategoriesByType(type: ExhaustType): ExhaustCategory[] {
    return EXHAUST_CATEGORIES.filter(c => c.type === type);
  }

  /**
   * Calculates the required exhaust for a given category and input quantity
   */
  static calculateExhaust(input: LocalExhaustInput): LocalExhaustResult {
    const category = EXHAUST_CATEGORIES.find(c => c.id === input.categoryId) || EXHAUST_CATEGORIES.find(c => c.id === 'custom')!;
    
    let requiredExhaust = 0;
    
    if (category.unitType === 'custom') {
      requiredExhaust = input.customRate || 0;
    } else if (category.unitType === 'none') {
      requiredExhaust = 0;
    } else {
      const rate = input.isMetric ? category.rateMetric : category.rateImp;
      requiredExhaust = rate * input.quantity;
    }

    return {
      categoryId: category.id,
      categoryName: category.name,
      type: category.type,
      requiredExhaust,
      operatingMode: category.operatingMode,
      reference: category.reference,
      unitLabel: input.isMetric ? category.unitLabelMetric : category.unitLabelImp
    };
  }

  /**
   * Evaluates makeup air balance to ensure conservation of mass and safe building pressurization.
   * Compares total local exhaust against provided makeup air (outdoor air supply).
   */
  static checkMakeupAirBalance(totalExhaust: number, makeupAirProvided: number): MakeupAirBalanceResult {
    const netPressurization = makeupAirProvided - totalExhaust;
    
    let status: 'Positive' | 'Neutral' | 'Negative' = 'Neutral';
    let warningMessage = undefined;
    
    // Using a 5% tolerance for neutral
    const tolerance = Math.max(0.05 * totalExhaust, 5); // 5% or 5 units minimum tolerance

    if (netPressurization > tolerance) {
      status = 'Positive';
    } else if (netPressurization < -tolerance) {
      status = 'Negative';
      warningMessage = 'Negative building pressurization detected. Makeup air is insufficient to balance the exhaust. This may cause infiltration of unconditioned air and drafts.';
    }

    return {
      totalExhaust,
      makeupAirProvided,
      netPressurization,
      status,
      warningMessage
    };
  }
}
