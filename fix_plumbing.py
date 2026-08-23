import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# Fix the incorrect modal injection inside the IIFE
search1 = """                return (
    <>
      <IPCReferenceModal isOpen={isRefModalOpen} onClose={() => setIsRefModalOpen(false)} />"""
replace1 = """                return ("""

content = content.replace(search1, replace1)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
