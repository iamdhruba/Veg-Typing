const fs = require('fs');
const lines = fs.readFileSync('Preeti.md', 'utf8').split('\n');

const allKeys = new Set();
lines.forEach(line => {
  const parts = line.split('\t');
  for (let i = 0; i < parts.length - 1; i += 2) {
    let key = parts[i + 1] ? parts[i + 1].trim() : '';
    if (key) allKeys.add(key.toLowerCase());
  }
});

const preetiJs = fs.readFileSync('frontend/src/data/keyMappings.js', 'utf8');
const missing = [];
for (let key of allKeys) {
  // convert k+m to km, etc
  let n = key;
  if (n.startsWith('shift+')) {
    const base = n.substring(6);
    const shiftMap = { '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&', '8': '*', '9': '(', '0': ')' };
    n = shiftMap[base] || base.toUpperCase();
  } else if (!n.startsWith('alt+')) {
    n = n.replace(/\+/g, '');
  }
  
  if (n === 'equalsto') n = '=';
  if (n === 'plus') n = '+';
  
  if (n !== 'z' && n !== 'c' && !preetiJs.includes(`n: '${n}'`)) {
    missing.push({ original: key, n });
  }
}

console.log('Missing keys:', missing);
