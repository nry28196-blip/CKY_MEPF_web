const fs = require('fs');
const html = fs.readFileSync('src/components/FireCalc.tsx', 'utf8');

const eqStart = html.indexOf('{subTab === \'equipment\' && (');
const eqEnd = html.indexOf('{subTab === \'sizing\' && (');
const str = html.substring(eqStart, eqEnd);

let divCount = 0;
let i = 0;
while (i < str.length) {
  if (str.substring(i, i+4) === '<div') { divCount++; i+=4; }
  else if (str.substring(i, i+6) === '</div>') { divCount--; i+=6; }
  else { i++; }
}
console.log('Div balance in equipment tab: ', divCount);
