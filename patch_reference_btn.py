import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# 1. Remove Reference button from top header
search_header = """        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
          <button
            onClick={() => setIsRefModalOpen(true)}
            className="px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer text-slate-400 hover:text-white flex items-center gap-1.5 mr-2 bg-slate-900 border border-slate-800 hover:bg-slate-800"
            title="View Fixture Unit Reference Tables"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reference</span>
          </button>
          <button"""

replace_header = """        <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
          <button"""
          
content = content.replace(search_header, replace_header)

# 2. Add it to the action buttons group
search_footer = """          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Bookmark className="h-4 w-4" />
              <span>{t('saveIteration')}</span>
            </button>"""

replace_footer = """          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={() => setIsRefModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
              title="View Fixture Unit Reference Tables"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Reference</span>
            </button>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Bookmark className="h-4 w-4" />
              <span>{t('saveIteration')}</span>
            </button>"""
            
content = content.replace(search_footer, replace_footer)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
