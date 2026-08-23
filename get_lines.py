with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines[466:506]):
    print(line, end='')
