import fs from 'fs';

const filePath = 'src/data/ventilation/ashrae621/types.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/export interface Ashrae621ExhaustType {/g, "export interface Ashrae621ExhaustType {\n  standard: string;");

fs.writeFileSync(filePath, content);
