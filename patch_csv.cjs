const fs = require('fs');
const file = 'src/lib/exportCsv.ts';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/params\.tons\.toFixed/g, '(params.tons || 0).toFixed');
code = code.replace(/params\.totalConnectedTons\.toFixed/g, '(params.totalConnectedTons || 0).toFixed');
code = code.replace(/params\.coincidentTons\.toFixed/g, '(params.coincidentTons || 0).toFixed');
code = code.replace(/params\.oduSizeTons\.toFixed/g, '(params.oduSizeTons || 0).toFixed');
code = code.replace(/params\.combinationRatio\.toFixed/g, '(params.combinationRatio || 0).toFixed');
code = code.replace(/params\.refrigerantCharge\.toFixed/g, '(params.refrigerantCharge || 0).toFixed');
code = code.replace(/r\.tons\.toFixed/g, '(r.tons || 0).toFixed');
code = code.replace(/b\.de\.toFixed/g, '(b.de || 0).toFixed');

fs.writeFileSync(file, code);
