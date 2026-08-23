import re

with open('src/components/PlumbingCalc.tsx', 'r') as f:
    content = f.read()

# Add slope state back
search_state = "  const [designVelocity, setDesignVelocity] = useState<number>(1.2); // m/s"
replace_state = """  const [designVelocity, setDesignVelocity] = useState<number>(1.2); // m/s
  const [slope, setSlope] = useState<number>(2); // %, standard slopes are 1%, 2%, 4%"""
content = content.replace(search_state, replace_state)

search_applied_state = "  const [appliedDesignVelocity, setAppliedDesignVelocity] = useState<number>(1.2);"
replace_applied_state = """  const [appliedDesignVelocity, setAppliedDesignVelocity] = useState<number>(1.2);
  const [appliedSlope, setAppliedSlope] = useState<number>(2);"""
content = content.replace(search_applied_state, replace_applied_state)

# Add to useEffect autoCalculate
search_effect1 = "      setAppliedDesignVelocity(designVelocity);"
replace_effect1 = """      setAppliedDesignVelocity(designVelocity);
      setAppliedSlope(slope);"""
content = content.replace(search_effect1, replace_effect1)

search_effect2 = "    autoCalculate, standard, fixtures, designVelocity, occupants,"
replace_effect2 = "    autoCalculate, standard, fixtures, designVelocity, slope, occupants,"
content = content.replace(search_effect2, replace_effect2)

# Add to restore params
search_restore = "        if (p.designVelocity) { setDesignVelocity(p.designVelocity); setAppliedDesignVelocity(p.designVelocity); }"
replace_restore = """        if (p.designVelocity) { setDesignVelocity(p.designVelocity); setAppliedDesignVelocity(p.designVelocity); }
        if (p.slope) { setSlope(p.slope); setAppliedSlope(p.slope); }"""
content = content.replace(search_restore, replace_restore)

# Add to hasPendingChanges
search_pending = "    designVelocity !== appliedDesignVelocity ||"
replace_pending = """    designVelocity !== appliedDesignVelocity ||
    slope !== appliedSlope ||"""
content = content.replace(search_pending, replace_pending)

# Add to handleApplyCalculations
search_apply = "    setAppliedDesignVelocity(designVelocity);"
replace_apply = """    setAppliedDesignVelocity(designVelocity);
    setAppliedSlope(slope);"""
content = content.replace(search_apply, replace_apply)

# Add to parameters
search_param = "          designVelocity,"
replace_param = """          designVelocity,
          slope,"""
content = content.replace(search_param, replace_param)

# Add to summary
search_summary = "                    `- Design Velocity: ${designVelocity} m/s\\n` +"
replace_summary = """                    `- Design Velocity: ${designVelocity} m/s\\n` +
                    `- Sewage Slope: ${slope}%\\n` +"""
content = content.replace(search_summary, replace_summary)

with open('src/components/PlumbingCalc.tsx', 'w') as f:
    f.write(content)
