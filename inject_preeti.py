import re

with open('frontend/src/data/keyMappings.js', 'r', encoding='utf-8') as f:
    code = f.read()

with open('new_preeti_ref.js', 'r', encoding='utf-8') as f:
    new_preeti = f.read()

# The PREETI_FULL_REF starts at `export const PREETI_FULL_REF = {` and ends at `export const KEYBOARD_ROWS = [`
code = re.sub(r'export const PREETI_FULL_REF = \{[\s\S]*?\n\};\n', new_preeti + '\n', code)

with open('frontend/src/data/keyMappings.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Injected!")
