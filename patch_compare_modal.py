with open('src/components/CompareModal.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "import { HistoryItem } from '../types';" in line:
        lines.insert(i + 1, "import ComparisonChart from './ComparisonChart';\n")
        break

for i, line in enumerate(lines):
    if "{/* Comparative Headers Grid */}" in line:
        # I want to insert the chart before or after the headers grid
        # Let's insert it after the headers grid but before the Parameter Table
        pass

for i, line in enumerate(lines):
    if "{/* Parameter Table */}" in line:
        lines.insert(i, "              {/* Variance Chart */}\n              <ComparisonChart calcA={calcA} calcB={calcB} />\n              \n")
        break

with open('src/components/CompareModal.tsx', 'w') as f:
    f.writelines(lines)
print("Done")
