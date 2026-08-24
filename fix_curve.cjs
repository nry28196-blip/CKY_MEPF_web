const fs = require('fs');
const file = 'src/components/PlumbingCalc.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldFunc = `  const getHuntersFlowGPM = (wsfu: number, type: 'valve' | 'tank') => {
    if (wsfu <= 0) return 0;
    // IPC 2018 Table E103.3(3) Hunter's Curve Interpolation
    if (type === 'valve') {
      if (wsfu <= 10) return 27; // Minimum starting point for flushometer
      if (wsfu <= 20) return 27 + ((wsfu - 10) * (35 - 27) / 10);
      if (wsfu <= 30) return 35 + ((wsfu - 20) * (42 - 35) / 10);
      if (wsfu <= 40) return 42 + ((wsfu - 30) * (46 - 42) / 10);
      if (wsfu <= 50) return 46 + ((wsfu - 40) * (51.5 - 46) / 10);
      if (wsfu <= 100) return 51.5 + ((wsfu - 50) * (68 - 51.5) / 50);
      if (wsfu <= 200) return 68 + ((wsfu - 100) * (91 - 68) / 100);
      if (wsfu <= 500) return 91 + ((wsfu - 200) * (143 - 91) / 300);
      return 143 + ((wsfu - 500) * 0.15); // Approximation above 500
    } else {
      // Flush tank
      if (wsfu <= 1) return 3;
      if (wsfu <= 2) return 5;
      if (wsfu <= 5) return 5 + ((wsfu - 2) * (9.4 - 5) / 3);
      if (wsfu <= 10) return 9.4 + ((wsfu - 5) * (16 - 9.4) / 5);
      if (wsfu <= 20) return 16 + ((wsfu - 10) * (25 - 16) / 10);
      if (wsfu <= 30) return 25 + ((wsfu - 20) * (33.3 - 25) / 10);
      if (wsfu <= 40) return 33.3 + ((wsfu - 30) * (40 - 33.3) / 10);
      if (wsfu <= 50) return 40 + ((wsfu - 40) * (46 - 40) / 10);
      if (wsfu <= 100) return 46 + ((wsfu - 50) * (68 - 46) / 50);
      if (wsfu <= 200) return 68 + ((wsfu - 100) * (91 - 68) / 100);
      if (wsfu <= 500) return 91 + ((wsfu - 200) * (143 - 91) / 300);
      return 143 + ((wsfu - 500) * 0.15); // Approximation above 500
    }
  };`;

const newFunc = `  const getHuntersFlowGPM = (wsfu: number, type: 'valve' | 'tank') => {
    if (wsfu <= 0) return 0;
    // IPC 2018 Table E103.3(3) Hunter's Curve Interpolation (Corrected Values)
    if (type === 'valve') {
      if (wsfu <= 5) return 15.0; // Minimum starting point for flushometer
      if (wsfu <= 10) return 15.0 + ((wsfu - 5) * (27.0 - 15.0) / 5);
      if (wsfu <= 20) return 27.0 + ((wsfu - 10) * (35.0 - 27.0) / 10);
      if (wsfu <= 30) return 35.0 + ((wsfu - 20) * (42.0 - 35.0) / 10);
      if (wsfu <= 40) return 42.0 + ((wsfu - 30) * (46.0 - 42.0) / 10);
      if (wsfu <= 50) return 46.0 + ((wsfu - 40) * (51.5 - 46.0) / 10);
      if (wsfu <= 60) return 51.5 + ((wsfu - 50) * (54.5 - 51.5) / 10);
      if (wsfu <= 70) return 54.5 + ((wsfu - 60) * (58.0 - 54.5) / 10);
      if (wsfu <= 80) return 58.0 + ((wsfu - 70) * (61.5 - 58.0) / 10);
      if (wsfu <= 90) return 61.5 + ((wsfu - 80) * (64.5 - 61.5) / 10);
      if (wsfu <= 100) return 64.5 + ((wsfu - 90) * (68.0 - 64.5) / 10);
      if (wsfu <= 120) return 68.0 + ((wsfu - 100) * (73.0 - 68.0) / 20);
      if (wsfu <= 140) return 73.0 + ((wsfu - 120) * (78.0 - 73.0) / 20);
      if (wsfu <= 160) return 78.0 + ((wsfu - 140) * (83.0 - 78.0) / 20);
      if (wsfu <= 180) return 83.0 + ((wsfu - 160) * (87.0 - 83.0) / 20);
      if (wsfu <= 200) return 87.0 + ((wsfu - 180) * (91.0 - 87.0) / 20);
      if (wsfu <= 225) return 91.0 + ((wsfu - 200) * (97.0 - 91.0) / 25);
      if (wsfu <= 250) return 97.0 + ((wsfu - 225) * (101.0 - 97.0) / 25);
      if (wsfu <= 500) return 101.0 + ((wsfu - 250) * (143.0 - 101.0) / 250);
      return 143.0 + ((wsfu - 500) * 0.15); // Approximation above 500
    } else {
      // Flush tank
      if (wsfu <= 1) return 3.0;
      if (wsfu <= 2) return 5.0;
      if (wsfu <= 3) return 5.0 + ((wsfu - 2) * (6.5 - 5.0) / 1);
      if (wsfu <= 4) return 6.5 + ((wsfu - 3) * (8.0 - 6.5) / 1);
      if (wsfu <= 5) return 8.0 + ((wsfu - 4) * (9.4 - 8.0) / 1);
      if (wsfu <= 10) return 9.4 + ((wsfu - 5) * (16.0 - 9.4) / 5);
      if (wsfu <= 20) return 16.0 + ((wsfu - 10) * (22.5 - 16.0) / 10); 
      if (wsfu <= 30) return 22.5 + ((wsfu - 20) * (28.0 - 22.5) / 10); 
      if (wsfu <= 40) return 28.0 + ((wsfu - 30) * (32.0 - 28.0) / 10);
      if (wsfu <= 50) return 32.0 + ((wsfu - 40) * (36.0 - 32.0) / 10);
      if (wsfu <= 60) return 36.0 + ((wsfu - 50) * (39.5 - 36.0) / 10);
      if (wsfu <= 70) return 39.5 + ((wsfu - 60) * (42.5 - 39.5) / 10);
      if (wsfu <= 80) return 42.5 + ((wsfu - 70) * (45.0 - 42.5) / 10);
      if (wsfu <= 90) return 45.0 + ((wsfu - 80) * (47.5 - 45.0) / 10);
      if (wsfu <= 100) return 47.5 + ((wsfu - 90) * (50.0 - 47.5) / 10);
      if (wsfu <= 120) return 50.0 + ((wsfu - 100) * (54.0 - 50.0) / 20);
      if (wsfu <= 140) return 54.0 + ((wsfu - 120) * (58.0 - 54.0) / 20);
      if (wsfu <= 160) return 58.0 + ((wsfu - 140) * (61.5 - 58.0) / 20);
      if (wsfu <= 180) return 61.5 + ((wsfu - 160) * (64.5 - 61.5) / 20);
      if (wsfu <= 200) return 64.5 + ((wsfu - 180) * (68.0 - 64.5) / 20);
      if (wsfu <= 225) return 68.0 + ((wsfu - 200) * (71.5 - 68.0) / 25);
      if (wsfu <= 250) return 71.5 + ((wsfu - 225) * (75.0 - 71.5) / 25);
      if (wsfu <= 500) return 75.0 + ((wsfu - 250) * (120.0 - 75.0) / 250);
      return 120.0 + ((wsfu - 500) * 0.15); // Approximation above 500
    }
  };`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync(file, code);
