import json

lines = open('Preeti.md', 'r', encoding='utf-8').read().splitlines()
mappings = {}

for line in lines:
    parts = line.split('\t')
    for i in range(0, len(parts) - 1, 2):
        char = parts[i].strip()
        key = parts[i+1].strip()
        if char and key and char != 'Character' and char != 'and in the ende words sentences paragraphs like that also':
            mappings[char] = key

with open('preeti_mappings.json', 'w', encoding='utf-8') as f:
    json.dump(mappings, f, ensure_ascii=False, indent=2)
