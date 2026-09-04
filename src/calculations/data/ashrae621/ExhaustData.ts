export type AshraeEdition = '2019' | '2022' | '2025';

export interface ExhaustSpaceType {
  id: string;
  name: string;
  ashraeCategory: string; // From Table 6.5
  ashraeRateImp: number; // cfm/ft2 or cfm/unit
  ashraeRateMet: number; // L/s-m2 or L/s-unit
  ashraeUnit: 'area' | 'fixture' | 'equipment' | 'room' | 'custom';
  ashraeClass: 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4';
  imcRateImp: number; // cfm/ft2 or cfm/unit
  imcRateMet: number; // L/s-m2 or L/s-unit
  notes?: string;
}

export const EXHAUST_2019: ExhaustSpaceType[] = [
  { id: 'art_classroom', name: 'Art classroom', ashraeCategory: 'Art classroom', ashraeRateImp: 0.7, ashraeRateMet: 3.5, ashraeUnit: 'area', ashraeClass: 'Class 2', imcRateImp: 0.7, imcRateMet: 3.5 },
  { id: 'bath_public', name: 'Bathrooms (public)', ashraeCategory: 'Bathrooms (public)', ashraeRateImp: 50, ashraeRateMet: 25, ashraeUnit: 'fixture', ashraeClass: 'Class 2', imcRateImp: 50, imcRateMet: 25 },
  { id: 'janitor_closet', name: 'Janitor closet, trash room', ashraeCategory: 'Janitor closet, trash room', ashraeRateImp: 1.0, ashraeRateMet: 5.0, ashraeUnit: 'area', ashraeClass: 'Class 3', imcRateImp: 1.0, imcRateMet: 5.0 }
];

export const EXHAUST_2022: ExhaustSpaceType[] = [
  { id: 'art_classroom', name: 'Art classroom', ashraeCategory: 'Art classroom', ashraeRateImp: 0.7, ashraeRateMet: 3.5, ashraeUnit: 'area', ashraeClass: 'Class 2', imcRateImp: 0.7, imcRateMet: 3.5 },
  { id: 'bath_public', name: 'Bathrooms (public)', ashraeCategory: 'Bathrooms (public)', ashraeRateImp: 50, ashraeRateMet: 25, ashraeUnit: 'fixture', ashraeClass: 'Class 2', imcRateImp: 50, imcRateMet: 25 },
  { id: 'janitor_closet', name: 'Janitor closet, trash room', ashraeCategory: 'Janitor closet, trash room', ashraeRateImp: 1.0, ashraeRateMet: 5.0, ashraeUnit: 'area', ashraeClass: 'Class 3', imcRateImp: 1.0, imcRateMet: 5.0 },
  { id: 'locker_room', name: 'Locker/dressing rooms', ashraeCategory: 'Locker/dressing rooms', ashraeRateImp: 0.25, ashraeRateMet: 1.25, ashraeUnit: 'area', ashraeClass: 'Class 2', imcRateImp: 0.25, imcRateMet: 1.25 }
];

export const EXHAUST_2025: ExhaustSpaceType[] = [
  { id: 'art_classroom', name: 'Art classroom', ashraeCategory: 'Art classroom', ashraeRateImp: 0.7, ashraeRateMet: 3.5, ashraeUnit: 'area', ashraeClass: 'Class 2', imcRateImp: 0.7, imcRateMet: 3.5 },
  { id: 'bath_public', name: 'Bathrooms (public)', ashraeCategory: 'Bathrooms (public)', ashraeRateImp: 50, ashraeRateMet: 25, ashraeUnit: 'fixture', ashraeClass: 'Class 2', imcRateImp: 50, imcRateMet: 25 },
  { id: 'janitor_closet', name: 'Janitor closet, trash room', ashraeCategory: 'Janitor closet, trash room', ashraeRateImp: 1.0, ashraeRateMet: 5.0, ashraeUnit: 'area', ashraeClass: 'Class 3', imcRateImp: 1.0, imcRateMet: 5.0 },
  { id: 'locker_room', name: 'Locker/dressing rooms', ashraeCategory: 'Locker/dressing rooms', ashraeRateImp: 0.25, ashraeRateMet: 1.25, ashraeUnit: 'area', ashraeClass: 'Class 2', imcRateImp: 0.25, imcRateMet: 1.25 },
  { id: 'edu_corridor', name: 'Educational corridors', ashraeCategory: 'Educational corridors', ashraeRateImp: 0.5, ashraeRateMet: 2.5, ashraeUnit: 'area', ashraeClass: 'Class 1', imcRateImp: 0.5, imcRateMet: 2.5 }
];
