import fs from 'fs';
import glob from 'glob';

const files = glob.sync('src/calculations/ventilation/*.ts');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('auditTrail.push')) {
    console.log('--- ' + file + ' ---');
    const lines = content.split('\n');
    let inPush = false;
    for (const line of lines) {
      if (line.includes('auditTrail.push')) {
        inPush = true;
      }
      if (inPush) {
        console.log(line);
        if (line.includes('});')) inPush = false;
      }
    }
  }
}
