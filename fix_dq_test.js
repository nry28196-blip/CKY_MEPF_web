import fs from 'fs';

const filePath = 'src/tests/ventilation/data-quality.test.ts';
let content = fs.readFileSync(filePath, 'utf8');

const scanReplacement = `
  describe('DATA-SOURCE SAFETY SCAN (ALL EDITIONS)', () => {
    it('Validates metadata integrity via DataSourceScannerService', () => {
      // Use the newly created service to run the full verification scan
      const report = DataSourceScannerService.scanAllDatasets();
      
      if (!report.isValid) {
        console.error('Data Source Scan Violations:', report.violations.slice(0, 5)); // Log first 5 for brevity in failure
      }
      
      expect(report.isValid).toBe(true);
      expect(report.violations.length).toBe(0);
      expect(report.scannedCount).toBeGreaterThan(0);
    });
  });
`;

// Replace the existing describe block
const regex = /describe\('DATA-SOURCE SAFETY SCAN \(ALL EDITIONS\)', \(\) => \{[\s\S]*?\}\);\s*\}\);/g;

// Also I need to add the import for it at the top
if (!content.includes('DataSourceScannerService')) {
  content = "import { DataSourceScannerService } from '../../calculations/ventilation/DataSourceScannerService';\n" + content;
}

content = content.replace(regex, scanReplacement.trim() + "\n});");
fs.writeFileSync(filePath, content);
