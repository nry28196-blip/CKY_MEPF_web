import { ExhaustCategory, EXHAUST_CATEGORIES } from '../data/exhaust/LocalExhaustData';

export interface LocalExhaustInput {
  categoryId: string;
  quantity: number; // area or unit count
  customRate?: number; // explicitly specified if custom
  isMetric: boolean;
}

export interface LocalExhaustResult {
  categoryId: string;
  categoryName: string;
  requiredExhaust: number;
  operatingMode: string;
  reference: string;
  unitLabel: string;
}

export class LocalExhaustService {
  /**
   * Retrieves exhaust categories
   */
  static getCategories(): ExhaustCategory[] {
    return EXHAUST_CATEGORIES;
  }

  /**
   * Calculates the required exhaust for a given category and input quantity
   */
  static calculateExhaust(input: LocalExhaustInput): LocalExhaustResult {
    const category = EXHAUST_CATEGORIES.find(c => c.id === input.categoryId) || EXHAUST_CATEGORIES.find(c => c.id === 'other_custom')!;
    
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
      requiredExhaust,
      operatingMode: category.operatingMode,
      reference: category.reference,
      unitLabel: input.isMetric ? category.unitLabelMetric : category.unitLabelImp
    };
  }
}
