import fs from 'fs';

const file = 'src/calculations/ventilation/Ashrae621ZoneService.ts';
let content = fs.readFileSync(file, 'utf8');

const oldDefinition = `export interface AuditTrailItem {
  symbol: string;
  name: string;
  formula: string;
  inputs: Record<string, number | string>;
  result: number | string | null;
  unit: string;
  reference: string;
  revision?: string;
  status?: 'PASS' | 'FAIL' | 'VERIFIED' | 'NOT_VERIFIED' | 'ESTIMATED' | 'DERIVED' | string;
}`;

const newDefinition = `export enum AuditStatus {
  INPUT_VERIFIED = 'INPUT_VERIFIED',
  INPUT_NOT_VERIFIED = 'INPUT_NOT_VERIFIED',
  DERIVED = 'DERIVED',
  PASS = 'PASS',
  FAIL = 'FAIL',
  BLOCKED = 'BLOCKED',
  ESTIMATED = 'ESTIMATED'
}

export interface AuditTrailItem {
  symbol: string;
  name: string;
  formula: string;
  inputs: Record<string, number | string>;
  result: number | string | null;
  unit: string;
  reference: string;
  revision?: string;
  status?: AuditStatus;
}`;

content = content.replace(oldDefinition, newDefinition);
fs.writeFileSync(file, content);
