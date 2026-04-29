const fs = require('fs');
const content = fs.readFileSync('d:\\Nepali Typewriter\\frontend\\src\\data\\curriculum.js', 'utf8');
const nonAscii = content.match(/[^\x00-\x7F]/g);
const unique = [...new Set(nonAscii)];
console.log(unique.join(''));
