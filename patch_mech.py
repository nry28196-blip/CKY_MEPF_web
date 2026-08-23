import re

with open('src/components/MechanicalCalc.tsx', 'r') as f:
    content = f.read()

import_str = "import VrfTopologyCanvas from './VrfTopologyCanvas';"
new_import = "import VrfTopologyCanvas from './VrfTopologyCanvas';\nimport VrfLoadDistributionChart from './VrfLoadDistributionChart';"
if "VrfLoadDistributionChart" not in content:
    content = content.replace(import_str, new_import)

search_start = """              <div className="w-full">
                {/* Zones / Indoor Units Sizing Table */}
                <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800/80">"""

replacement_start = """              <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Zones / Indoor Units Sizing Table */}
                    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4 border border-slate-800/80">"""


search_end = """                        <Plus className="h-3 w-3" />
                        <span>Add Zone to System</span>
                      </button>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
          )}
          {/* Interactive Trend Chart Section */}"""

replacement_end = """                        <Plus className="h-3 w-3" />
                        <span>Add Zone to System</span>
                      </button>
                    </div>
                  </div>
                </div>
                  </div>
                  <div className="lg:col-span-1">
                    <VrfLoadDistributionChart rooms={vrfRooms} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Interactive Trend Chart Section */}"""

if search_start in content and search_end in content:
    content = content.replace(search_start, replacement_start)
    content = content.replace(search_end, replacement_end)
    with open('src/components/MechanicalCalc.tsx', 'w') as f:
        f.write(content)
        print("Patched successfully")
else:
    print("Search string not found")

