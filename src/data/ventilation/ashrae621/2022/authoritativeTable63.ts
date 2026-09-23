/**
 * INDEPENDENT AUTHORITATIVE FIXTURE
 * Standard: ANSI/ASHRAE Standard 62.1-2022 Section 6.5.1 and Table 6-3
 * Reference Basis: ANSI/ASHRAE Standard 62.1-2022 + Addendum x
 * Source: ANSI/ASHRAE Standard 62.1-2022 Published Standard, Section 6.5.1 & Table 6-3 "Airstreams or Sources"
 * 
 * CRITICAL ARCHITECTURAL RULE:
 * This file is an independent reference fixture. It MUST NOT import from table63Data.ts, data.ts,
 * or be dynamically generated from production data.
 * 
 * IMPORTANT:
 * Table 6-3 is NOT a second numeric exhaust-rate table.
 * It provides required Air Class classification for listed airstreams/sources.
 */

export interface AuthoritativeTable63Record {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly airClass: 1 | 2 | 3 | 4;
  readonly standard: 'ASHRAE 62.1';
  readonly edition: '2022';
  readonly referenceSection: '6.5.1';
  readonly referenceTable: 'Table 6-3';
  readonly reference: 'Section 6.5.1, Table 6-3';
  readonly referenceBasis: 'ASHRAE 62.1-2022 + Addendum x';
  readonly sourceType: string;
  readonly verificationStatus: 'VERIFIED';
  readonly verificationDate: string;
  readonly applicableAddenda: readonly string[];
  readonly notes?: string;
  readonly specialStandardReference?: string;
}

export const AUTHORITATIVE_TABLE_6_3: readonly AuthoritativeTable63Record[] = [
  {
    id: 'kitchen_grease_hoods',
    name: 'Kitchen grease hoods',
    description: 'Commercial kitchen grease hoods (Type I hoods) discharging grease vapors, smoke, and cooking effluent',
    airClass: 4,
    standard: 'ASHRAE 62.1',
    edition: '2022',
    referenceSection: '6.5.1',
    referenceTable: 'Table 6-3',
    reference: 'Section 6.5.1, Table 6-3',
    referenceBasis: 'ASHRAE 62.1-2022 + Addendum x',
    sourceType: 'ASHRAE_PUBLISHED',
    verificationStatus: 'VERIFIED',
    verificationDate: '2026-09-22',
    applicableAddenda: ['Addendum x'],
    notes: 'Exhaust airflow shall be designed in accordance with ANSI/ASHRAE Standard 154 (Section 6.5.1.2.3). Air Class 4 prohibits recirculation or transfer to other spaces.',
    specialStandardReference: 'ANSI/ASHRAE Standard 154'
  },
  {
    id: 'kitchen_hoods_non_grease',
    name: 'Kitchen hoods other than grease hoods',
    description: 'Commercial kitchen hoods other than grease hoods (Type II hoods) discharging steam, vapor, heat, or non-grease fumes',
    airClass: 3,
    standard: 'ASHRAE 62.1',
    edition: '2022',
    referenceSection: '6.5.1',
    referenceTable: 'Table 6-3',
    reference: 'Section 6.5.1, Table 6-3',
    referenceBasis: 'ASHRAE 62.1-2022 + Addendum x',
    sourceType: 'ASHRAE_PUBLISHED',
    verificationStatus: 'VERIFIED',
    verificationDate: '2026-09-22',
    applicableAddenda: ['Addendum x'],
    notes: 'Exhaust airflow shall be designed in accordance with ANSI/ASHRAE Standard 154 (Section 6.5.1.2.3). Air Class 3 permits recirculation only within the space of origin.',
    specialStandardReference: 'ANSI/ASHRAE Standard 154'
  },
  {
    id: 'diazo_printing_discharge',
    name: 'Diazo printing equipment discharge',
    description: 'Diazo printing and reproduction equipment exhaust discharge containing ammonia or solvent vapors',
    airClass: 4,
    standard: 'ASHRAE 62.1',
    edition: '2022',
    referenceSection: '6.5.1',
    referenceTable: 'Table 6-3',
    reference: 'Section 6.5.1, Table 6-3',
    referenceBasis: 'ASHRAE 62.1-2022 + Addendum x',
    sourceType: 'ASHRAE_PUBLISHED',
    verificationStatus: 'VERIFIED',
    verificationDate: '2026-09-22',
    applicableAddenda: ['Addendum x'],
    notes: 'Direct discharge required outdoors without recirculation or transfer.',
    specialStandardReference: 'Manufacturer / EHS containment specifications'
  },
  {
    id: 'hydraulic_elevator_machine_room',
    name: 'Hydraulic elevator machine room',
    description: 'Hydraulic elevator machine rooms housing hydraulic fluid reservoirs, pumps, and control valves',
    airClass: 2,
    standard: 'ASHRAE 62.1',
    edition: '2022',
    referenceSection: '6.5.1',
    referenceTable: 'Table 6-3',
    reference: 'Section 6.5.1, Table 6-3',
    referenceBasis: 'ASHRAE 62.1-2022 + Addendum x',
    sourceType: 'ASHRAE_PUBLISHED',
    verificationStatus: 'VERIFIED',
    verificationDate: '2026-09-22',
    applicableAddenda: ['Addendum x'],
    notes: 'Air Class 2 classification. Recirculation to other Class 2 spaces permitted, but prohibited to Class 1 spaces.',
    specialStandardReference: 'ASME A17.1 / Elevator engineering specifications'
  },
  {
    id: 'laboratory_hoods',
    name: 'Laboratory hoods',
    description: 'Laboratory chemical fume hoods, biological containment hoods, and localized bench containment exhaust',
    airClass: 4,
    standard: 'ASHRAE 62.1',
    edition: '2022',
    referenceSection: '6.5.1',
    referenceTable: 'Table 6-3',
    reference: 'Section 6.5.1, Table 6-3',
    referenceBasis: 'ASHRAE 62.1-2022 + Addendum x',
    sourceType: 'ASHRAE_PUBLISHED',
    verificationStatus: 'VERIFIED',
    verificationDate: '2026-09-22',
    applicableAddenda: ['Addendum x'],
    notes: 'Exhaust systems shall comply with ANSI/AIHA/ASSE Z9.5 and NFPA 45. Air Class 4 prohibits any recirculation or transfer.',
    specialStandardReference: 'ANSI/AIHA Z9.5 / NFPA 45'
  },
  {
    id: 'paint_spray_booths',
    name: 'Paint spray booths',
    description: 'Paint spray booths, spray rooms, and finishing enclosures discharging flammable or solvent aerosols',
    airClass: 4,
    standard: 'ASHRAE 62.1',
    edition: '2022',
    referenceSection: '6.5.1',
    referenceTable: 'Table 6-3',
    reference: 'Section 6.5.1, Table 6-3',
    referenceBasis: 'ASHRAE 62.1-2022 + Addendum x',
    sourceType: 'ASHRAE_PUBLISHED',
    verificationStatus: 'VERIFIED',
    verificationDate: '2026-09-22',
    applicableAddenda: ['Addendum x'],
    notes: 'Also listed in Table 6-2 (numeric rates governed by OSHA 1910.107 / NFPA 33). Table 6-3 classifies airstream as Air Class 4.',
    specialStandardReference: 'OSHA 1910.107 / NFPA 33'
  },
  {
    id: 'refrigerating_machinery',
    name: 'Refrigerating machinery rooms',
    description: 'Refrigerating machinery rooms housing mechanical refrigeration compressors, pressure vessels, and piping',
    airClass: 3,
    standard: 'ASHRAE 62.1',
    edition: '2022',
    referenceSection: '6.5.1',
    referenceTable: 'Table 6-3',
    reference: 'Section 6.5.1, Table 6-3',
    referenceBasis: 'ASHRAE 62.1-2022 + Addendum x',
    sourceType: 'ASHRAE_PUBLISHED',
    verificationStatus: 'VERIFIED',
    verificationDate: '2026-09-22',
    applicableAddenda: ['Addendum x'],
    notes: 'Also listed in Table 6-2 (emergency and continuous ventilation rates governed by ANSI/ASHRAE Standard 15). Table 6-3 classifies airstream as Air Class 3.',
    specialStandardReference: 'ANSI/ASHRAE Standard 15'
  }
] as const;

export const AUTHORITATIVE_TABLE_6_3_COUNT = 7;
export const AUTHORITATIVE_TABLE_6_3_REFERENCE_BASIS = 'ASHRAE 62.1-2022 + Addendum x';
