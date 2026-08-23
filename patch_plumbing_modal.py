import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# Add import
search_import = "import FormulaVisualizer from './FormulaVisualizer';"
replace_import = "import FormulaVisualizer from './FormulaVisualizer';\nimport IPCReferenceModal from './IPCReferenceModal';"
content = content.replace(search_import, replace_import)

# Add state
search_state = "const [subTab, setSubTab] = useState<SubTab>('fixtures');"
replace_state = "const [subTab, setSubTab] = useState<SubTab>('fixtures');\n  const [isRefModalOpen, setIsRefModalOpen] = useState(false);"
content = content.replace(search_state, replace_state)

# Add button to header and the modal component
search_header = """        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
          <button
            onClick={() => setStandard('ipc')}"""

replace_header = """        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
          <button
            onClick={() => setIsRefModalOpen(true)}
            className="px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer text-slate-400 hover:text-white flex items-center gap-1.5 mr-2 bg-slate-900 border border-slate-800 hover:bg-slate-800"
            title="View Fixture Unit Reference Tables"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reference</span>
          </button>
          <button
            onClick={() => setStandard('ipc')}"""

content = content.replace(search_header, replace_header)

search_return = "return ("
replace_return = "return (\n    <>\n      <IPCReferenceModal isOpen={isRefModalOpen} onClose={() => setIsRefModalOpen(false)} />"
content = content.replace(search_return, replace_return)

# Close the fragment
# I should just replace the last </div> in the component with </div></>
# or just do a regex replace on the final </div>

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
