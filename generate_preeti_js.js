const fs = require('fs');

const lines = fs.readFileSync('Preeti.md', 'utf8').split('\n');
const mappings = {};

lines.forEach(line => {
  const parts = line.split('\t');
  for (let i = 0; i < parts.length - 1; i += 2) {
    let char = parts[i] ? parts[i].trim() : '';
    let key = parts[i + 1] ? parts[i + 1].trim() : '';
    
    if (char && key && char !== 'Character' && char !== 'and in the ende words sentences paragraphs like that also') {
      // Fix the e+m OCR mistake
      if (key === 'e+m' && char === 'छ') {
        char = 'झ';
      }
      mappings[char] = key;
    }
  }
});

const preetiFullRef = {
  "Consonants": [],
  "Vowels": [],
  "Conjuncts & Half Letters": [],
  "Numbers & Punctuation": [],
  "Alt Codes": []
};

// Organize based on standard categories
for (const [char, key] of Object.entries(mappings)) {
  let e = key;
  // Format 'shift+1' to 'Shift+1'
  if (e.toLowerCase().startsWith('shift+')) {
    e = 'Shift+' + e.substring(6).toUpperCase();
  }
  // Format 'alt+' to 'Alt+'
  if (e.toLowerCase().startsWith('alt+')) {
    e = 'Alt+' + e.substring(4);
  }
  
  let n = '';
  if (e.startsWith('Alt+')) {
    n = e;
  } else if (e.startsWith('Shift+')) {
    const base = e.substring(6);
    const shiftMap = { '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')' };
    n = shiftMap[base] || base.toUpperCase();
  } else {
    // k+m -> km
    n = e.replace(/\+/g, '');
  }
  
  // Custom overrides for specific keys based on curriculum
  if (e.toLowerCase() === 'equalsto') { n = '='; e = '='; }
  if (e.toLowerCase() === 'plus') { n = '+'; e = 'Shift+='; }
  
  // Create object entry
  const entryStr = `{ n: '${n}', e: '${e}' } /* ${char} */`;
  
  if (e.startsWith('Alt+')) {
    preetiFullRef["Alt Codes"].push(entryStr);
  } else if (/[0-9]/.test(e) && e.startsWith('Shift+')) {
    preetiFullRef["Numbers & Punctuation"].push(entryStr);
  } else if (e.includes('+') && !e.startsWith('Shift+')) {
    preetiFullRef["Conjuncts & Half Letters"].push(entryStr);
  } else {
    preetiFullRef["Consonants"].push(entryStr);
  }
}

let out = `export const PREETI_FULL_REF = {\n`;
for (const [category, items] of Object.entries(preetiFullRef)) {
  out += `  "${category}": [\n`;
  for (let i = 0; i < items.length; i += 4) {
    out += `    ${items.slice(i, i + 4).join(', ')}${i + 4 < items.length ? ',' : ''}\n`;
  }
  out += `  ],\n`;
}
out += `};\n`;

fs.writeFileSync('preeti_out.js', out);
console.log('Successfully generated preeti_out.js');
