import re
with open('src/components/MechanicalCalc.tsx', 'r') as f:
    content = f.read()

# Add VentilationCalc import
content = content.replace("import DuctSizingCalc from './DuctSizingCalc';", "import DuctSizingCalc from './DuctSizingCalc';\nimport VentilationCalc from './VentilationCalc';")

# Add SubTab
content = content.replace("type SubTab = 'cooling' | 'ductSizing' | 'formulas';", "type SubTab = 'cooling' | 'ductSizing' | 'formulas' | 'ventilation';")

# Add Tab Button
tab_button = """        <button
          onClick={() => setSubTab('ventilation')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            subTab === 'ventilation'
              ? 'border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950/10'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          {t('mechVentilationTitle') || 'Ventilation'}
        </button>"""

content = content.replace("{t('mechDuctSizingTitle')}\n        </button>", "{t('mechDuctSizingTitle')}\n        </button>\n" + tab_button)

# Render component
render_part = """      {/* Conditional Rendering */}
      {subTab === 'formulas' ? ("""

render_part_new = """      {/* Conditional Rendering */}
      {subTab === 'ventilation' ? (
        <VentilationCalc />
      ) : subTab === 'formulas' ? ("""

content = content.replace(render_part, render_part_new)

with open('src/components/MechanicalCalc.tsx', 'w') as f:
    f.write(content)
