with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# Floor Area
content = content.replace(
'''<TooltipLabel label={`Floor Area (${areaUnit})`} tooltip="Total occupiable floor area of the zone." />''',
'''<TooltipLabel label={`Floor Area (${areaUnit})`} tooltip="Total occupiable floor area of the zone." status={area > 0 && !isExtremeArea ? 'success' : isExtremeArea ? 'warning' : 'error'} />'''
)

# Occupants
content = content.replace(
'''<TooltipLabel label="Occupants" tooltip="Number of people in the zone." />''',
'''<TooltipLabel label="Occupants" tooltip="Number of people in the zone." status={occupants > 0 ? (isExtremeDensity ? 'warning' : 'success') : 'error'} />'''
)

# Ez
content = content.replace(
'''<TooltipLabel label="Air Distribution Effectiveness (Ez)" tooltip="1.0 for ceiling supply/return. 0.8 for ceiling supply/floor return. 1.2 for floor supply." />''',
'''<TooltipLabel label="Air Distribution Effectiveness (Ez)" tooltip="1.0 for ceiling supply/return. 0.8 for ceiling supply/floor return. 1.2 for floor supply." status="success" />'''
)

# Air Temp
content = content.replace(
'''<TooltipLabel label={`Air Temperature (${tempUnit})`} tooltip="Adjust calculations to reflect actual air density based on temperature, converting Standard volume to Actual volume." />''',
'''<TooltipLabel label={`Air Temperature (${tempUnit})`} tooltip="Adjust calculations to reflect actual air density based on temperature, converting Standard volume to Actual volume." status={useTempAdj ? (isExtremeTemp ? 'warning' : 'success') : null} />'''
)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)
