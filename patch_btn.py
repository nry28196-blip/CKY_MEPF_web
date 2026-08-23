import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

search = """          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={() => setIsRefModalOpen(true)}
              className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
              title="View Fixture Unit Reference Tables"
            >"""

replace = """          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={() => setIsRefModalOpen(true)}
              className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
              title="View Fixture Unit Reference Tables"
            >"""
            
if search in content:
    content = content.replace(search, replace)
    with open('src/components/PlumbingCalc.tsx', 'w') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Search string not found")
