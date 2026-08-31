export interface ExhaustCategory {
  id: string;
  name: string;
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
    rateImp: 0,
    rateMetric: 0,
    unitType: 'custom',
    unitLabelImp: 'CFM',
    unitLabelMetric: 'L/s',
    operatingMode: 'As required',
    reference: 'Engineering Input'
  }
];
