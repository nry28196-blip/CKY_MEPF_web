export type ExhaustType = 'Kitchen' | 'Toilet' | 'Process' | 'Hazardous' | 'General' | 'None';

export interface ExhaustCategory {
  id: string;
  name: string;
  type: ExhaustType;
  rateImp: number;
  rateMetric: number;
  unitType: 'per_unit' | 'per_area' | 'custom' | 'none';
  unitLabelImp: string;
  unitLabelMetric: string;
  operatingMode: string;
  reference: string;
}

export const EXHAUST_CATEGORIES: ExhaustCategory[] = [
  {
    id: 'none',
    name: 'None (No Local Exhaust Required)',
    type: 'None',
    rateImp: 0,
    rateMetric: 0,
    unitType: 'none',
    unitLabelImp: '-',
    unitLabelMetric: '-',
    operatingMode: '-',
    reference: '-'
  },
  {
    id: 'toilet_public',
    name: 'Restroom / Public Toilet',
    type: 'Toilet',
    rateImp: 50,
    rateMetric: 25,
    unitType: 'per_unit',
    unitLabelImp: 'CFM/wc',
    unitLabelMetric: 'L/s/wc',
    operatingMode: 'Continuous during occupancy',
    reference: 'ASHRAE 62.1 Table 6.5.1'
  },
  {
    id: 'toilet_private',
    name: 'Restroom / Private Toilet',
    type: 'Toilet',
    rateImp: 25,
    rateMetric: 12.5,
    unitType: 'per_unit',
    unitLabelImp: 'CFM/wc',
    unitLabelMetric: 'L/s/wc',
    operatingMode: 'Intermittent or Continuous',
    reference: 'ASHRAE 62.1 Table 6.5.1'
  },
  {
    id: 'janitor',
    name: 'Janitor Closet',
    type: 'General',
    rateImp: 1.0,
    rateMetric: 5.0,
    unitType: 'per_area',
    unitLabelImp: 'CFM/ft²',
    unitLabelMetric: 'L/s/m²',
    operatingMode: 'Continuous',
    reference: 'ASHRAE 62.1 Table 6.5.1'
  },
  {
    id: 'copy',
    name: 'Copy / Print Room',
    type: 'Process',
    rateImp: 0.5,
    rateMetric: 2.5,
    unitType: 'per_area',
    unitLabelImp: 'CFM/ft²',
    unitLabelMetric: 'L/s/m²',
    operatingMode: 'Continuous',
    reference: 'ASHRAE 62.1 Table 6.5.1'
  },
  {
    id: 'locker',
    name: 'Locker / Shower Room',
    type: 'General',
    rateImp: 0.5,
    rateMetric: 2.5,
    unitType: 'per_area',
    unitLabelImp: 'CFM/ft²',
    unitLabelMetric: 'L/s/m²',
    operatingMode: 'Continuous',
    reference: 'ASHRAE 62.1 Table 6.5.1'
  },
  {
    id: 'trash',
    name: 'Garbage / Waste Room',
    type: 'Hazardous',
    rateImp: 1.0,
    rateMetric: 5.0,
    unitType: 'per_area',
    unitLabelImp: 'CFM/ft²',
    unitLabelMetric: 'L/s/m²',
    operatingMode: 'Continuous',
    reference: 'ASHRAE 62.1 Table 6.5.1'
  },
  {
    id: 'kitchen_commercial',
    name: 'Kitchen (Commercial)',
    type: 'Kitchen',
    rateImp: 0.7,
    rateMetric: 3.5,
    unitType: 'per_area',
    unitLabelImp: 'CFM/ft²',
    unitLabelMetric: 'L/s/m²',
    operatingMode: 'Continuous',
    reference: 'ASHRAE 62.1 Table 6.5.1'
  },
  {
    id: 'custom',
    name: 'Custom / Other',
    type: 'General',
    rateImp: 0,
    rateMetric: 0,
    unitType: 'custom',
    unitLabelImp: 'CFM',
    unitLabelMetric: 'L/s',
    operatingMode: 'As required',
    reference: 'Engineering Input'
  }
];
