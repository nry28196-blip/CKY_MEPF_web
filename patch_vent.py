with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">',
    '<div className="space-y-6">'
)

content = content.replace(
    '        {/* INPUTS PANEL */}\n        <div className="lg:col-span-1 space-y-4">',
    '        {/* INPUTS PANEL */}\n        <div className="w-full">'
)

content = content.replace(
    """            <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
              <Wind className="w-4 h-4 mr-2 text-emerald-400" />
              Zone Parameters
            </h3>
            
            <div className="space-y-5">""",
    """            <h3 className="text-sm font-semibold text-white mb-5 flex items-center">
              <Wind className="w-4 h-4 mr-2 text-emerald-400" />
              Zone Parameters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">"""
)

content = content.replace(
    '        {/* RESULTS PANEL */}\n        <div className="lg:col-span-2 space-y-4">',
    '        {/* RESULTS PANEL */}\n        <div className="w-full">'
)

with open('src/components/VentilationCalc.tsx', 'w') as f:
    f.write(content)

print("Ventilation patched")
