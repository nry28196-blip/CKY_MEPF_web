import re

with open('src/components/DuctSizingCalc.tsx', 'r') as f:
    content = f.read()

# Airflow
content = content.replace("value={airflow === 0 ? '' : airflow}", "value={airflow === 0 ? '' : airflowUnitHook.getDisplayValue(airflow)}")
content = content.replace("value={airflow || 200}", "value={airflowUnitHook.getDisplayValue(airflow) || 200}")
content = content.replace("setAirflow(e.target.value === '' ? 0 : Number(e.target.value))", "setAirflow(e.target.value === '' ? 0 : airflowUnitHook.getInternalValue(Number(e.target.value)))")
content = content.replace("setAirflow(Number(e.target.value))", "setAirflow(airflowUnitHook.getInternalValue(Number(e.target.value)))")

# Friction
content = content.replace("value={frictionRate === 0 ? '' : frictionRate}", "value={frictionRate === 0 ? '' : fricUnitHook.getDisplayValue(frictionRate)}")
content = content.replace("value={frictionRate || 0.05}", "value={fricUnitHook.getDisplayValue(frictionRate) || 0.05}")
content = content.replace("setFrictionRate(e.target.value === '' ? 0 : Number(e.target.value))", "setFrictionRate(e.target.value === '' ? 0 : fricUnitHook.getInternalValue(Number(e.target.value)))")
content = content.replace("setFrictionRate(Number(e.target.value))", "setFrictionRate(fricUnitHook.getInternalValue(Number(e.target.value)))")

# Velocity
content = content.replace("value={velocityLimit === 0 ? '' : velocityLimit}", "value={velocityLimit === 0 ? '' : velUnitHook.getDisplayValue(velocityLimit)}")
content = content.replace("value={velocityLimit || 500}", "value={velUnitHook.getDisplayValue(velocityLimit) || 500}")
content = content.replace("setVelocityLimit(e.target.value === '' ? 0 : Number(e.target.value))", "setVelocityLimit(e.target.value === '' ? 0 : velUnitHook.getInternalValue(Number(e.target.value)))")
content = content.replace("setVelocityLimit(Number(e.target.value))", "setVelocityLimit(velUnitHook.getInternalValue(Number(e.target.value)))")

# Height
content = content.replace("value={ductHeight === 0 ? '' : ductHeight}", "value={ductHeight === 0 ? '' : lenUnitHook.getDisplayValue(ductHeight)}")
content = content.replace("value={ductHeight || 6}", "value={lenUnitHook.getDisplayValue(ductHeight) || 6}")
content = content.replace("setDuctHeight(e.target.value === '' ? 0 : Number(e.target.value))", "setDuctHeight(e.target.value === '' ? 0 : lenUnitHook.getInternalValue(Number(e.target.value)))")
content = content.replace("setDuctHeight(Number(e.target.value))", "setDuctHeight(lenUnitHook.getInternalValue(Number(e.target.value)))")

# Units labels
content = content.replace(">CFM<", ">{flowUnit}<")
content = content.replace(' 200 CFM<', ' {airflowUnitHook.getDisplayValue(200)} {flowUnit}<')
content = content.replace(' 7,500 CFM<', ' {airflowUnitHook.getDisplayValue(7500)} {flowUnit}<')
content = content.replace(' 15,000 CFM<', ' {airflowUnitHook.getDisplayValue(15000)} {flowUnit}<')
content = content.replace(' 100 to 50,000 CFM', ' 100 to 50,000 CFM (equivalent)')

content = content.replace(">in. wg/100 ft<", ">{fricUnit}<")
content = content.replace(">in.<", ">{lenUnit}<")
content = content.replace(' 0.05 in/100ft<', ' {fricUnitHook.getDisplayValue(0.05)} {fricUnit}<')
content = content.replace(' 0.5 in/100ft<', ' {fricUnitHook.getDisplayValue(0.5)} {fricUnit}<')
content = content.replace(' 1.0 in/100ft<', ' {fricUnitHook.getDisplayValue(1.0)} {fricUnit}<')

content = content.replace(">FPM<", ">{velUnit}<")
content = content.replace(' 500 FPM<', ' {velUnitHook.getDisplayValue(500)} {velUnit}<')
content = content.replace(' 2,000 FPM<', ' {velUnitHook.getDisplayValue(2000)} {velUnit}<')
content = content.replace(' 4,000 FPM<', ' {velUnitHook.getDisplayValue(4000)} {velUnit}<')

content = content.replace(' 6 in<', ' {lenUnitHook.getDisplayValue(6)} {lenUnit}<')
content = content.replace(' 24 in<', ' {lenUnitHook.getDisplayValue(24)} {lenUnit}<')
content = content.replace(' 48 in<', ' {lenUnitHook.getDisplayValue(48)} {lenUnit}<')


# Replace outputs in main panel
content = content.replace("{deMain.toFixed(1)}", "{lenUnitHook.getDisplayValue(deMain).toFixed(1)}")
content = content.replace("{widthMain}x{ductHeight}", "{lenUnitHook.getDisplayValue(widthMain).toFixed(0)}x{lenUnitHook.getDisplayValue(ductHeight).toFixed(0)}")
content = content.replace("{Math.round(velRectMain)}", "{velUnitHook.getDisplayValue(velRectMain).toFixed(0)}")

# Branch outputs
content = content.replace("{b.cfm.toFixed(0)}", "{airflowUnitHook.getDisplayValue(b.cfm).toFixed(0)}")
content = content.replace("{b.de.toFixed(1)}", "{lenUnitHook.getDisplayValue(b.de).toFixed(1)}")
content = content.replace("{b.width}x{b.height}", "{lenUnitHook.getDisplayValue(b.width).toFixed(0)}x{lenUnitHook.getDisplayValue(b.height).toFixed(0)}")
content = content.replace("{Math.round(b.velocityRect)}", "{velUnitHook.getDisplayValue(b.velocityRect).toFixed(0)}")

with open('src/components/DuctSizingCalc.tsx', 'w') as f:
    f.write(content)
