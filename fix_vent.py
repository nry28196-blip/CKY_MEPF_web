with open('src/components/VentilationCalc.tsx', 'r') as f:
    content = f.read()

# Let's fix the ending. We have:
#       </div>
#     </div>
#       )}
#     </div>
#   );
# }
# But if it's JSX, it must be correct.
