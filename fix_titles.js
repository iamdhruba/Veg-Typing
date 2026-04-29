const fs = require('fs');
let code = fs.readFileSync('frontend/src/data/curriculum-godmode.js', 'utf8');

// Preeti section
let preetiStart = code.indexOf('preeti: [');
let unicodeStart = code.indexOf('unicode: [');

if (preetiStart !== -1 && unicodeStart !== -1) {
    let preetiSection = code.substring(preetiStart, unicodeStart);
    preetiSection = preetiSection.replace(/title:\s*"([^"]+)"/g, (match, p1) => {
        if (!p1.startsWith('Preeti:')) {
            return `title: "Preeti: ${p1}"`;
        }
        return match;
    });
    
    code = code.substring(0, preetiStart) + preetiSection + code.substring(unicodeStart);
}

// Unicode section
unicodeStart = code.indexOf('unicode: [');
if (unicodeStart !== -1) {
    let unicodeSection = code.substring(unicodeStart);
    unicodeSection = unicodeSection.replace(/title:\s*"([^"]+)"/g, (match, p1) => {
        if (!p1.startsWith('Unicode:')) {
            return `title: "Unicode: ${p1}"`;
        }
        return match;
    });
    
    code = code.substring(0, unicodeStart) + unicodeSection;
}

fs.writeFileSync('frontend/src/data/curriculum-godmode.js', code);
console.log('Done!');
