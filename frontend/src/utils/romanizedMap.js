export const ROMANIZED_MAP = [
  // Consonants
  { from: "k", to: "क" },
  { from: "K", to: "ख" },
  { from: "g", to: "ग" },
  { from: "G", to: "घ" },
  { from: "<", to: "ङ" }, // Shift+,
  { from: "c", to: "च" },
  { from: "C", to: "छ" },
  { from: "j", to: "ज" },
  { from: "J", to: "झ" },
  { from: "Y", to: "ञ" }, // Shift+y
  { from: "q", to: "ट" },
  { from: "Q", to: "ठ" },
  { from: "x", to: "ड" },
  { from: "X", to: "ढ" },
  { from: "N", to: "ण" }, // Shift+n
  { from: "t", to: "त" },
  { from: "T", to: "थ" },
  { from: "d", to: "द" },
  { from: "D", to: "ध" },
  { from: "n", to: "न" },
  { from: "p", to: "प" },
  { from: "P", to: "फ" },
  { from: "b", to: "ब" },
  { from: "B", to: "भ" },
  { from: "m", to: "म" },
  { from: "y", to: "य" },
  { from: "r", to: "र" },
  { from: "l", to: "ल" },
  { from: "v", to: "व" },
  { from: "S", to: "श" },
  { from: "z", to: "ष" },
  { from: "s", to: "स" },
  { from: "h", to: "ह" },

  // Vowels
  { from: "H", to: "अ" },
  { from: "A", to: "आ" },
  { from: "[", to: "इ" },
  { from: "{", to: "ई" }, 
  { from: "f", to: "उ" },
  { from: "F", to: "ऊ" }, 
  { from: "Z", to: "ऋ" }, 
  { from: "]", to: "ए" },
  { from: "}", to: "ऐ" }, 
  { from: "O", to: "ओ" }, 
  { from: "W", to: "औ" }, 

  // Matras
  { from: "a", to: "ा" },
  { from: "i", to: "ि" },
  { from: "I", to: "ी" },
  { from: "u", to: "ु" },
  { from: "U", to: "ू" },
  { from: "R", to: "ृ" },
  { from: "e", to: "े" },
  { from: "E", to: "ै" },
  { from: "o", to: "ो" },
  { from: "w", to: "ौ" },
  
  // Modifiers
  { from: "M", to: "ं" },
  { from: ":", to: "ः" },
  { from: "V", to: "ँ" },
  { from: "/", to: "्" },
  { from: "\\", to: "्" },
  { from: "&", to: "ङ" }, // Shift+7
  { from: ">", to: "." }, // Shift+.
  
  // Digits
  { from: "0", to: "०" },
  { from: "1", to: "१" },
  { from: "2", to: "२" },
  { from: "3", to: "३" },
  { from: "4", to: "४" },
  { from: "5", to: "५" },
  { from: "6", to: "६" },
  { from: "7", to: "७" },
  { from: "8", to: "८" },
  { from: "9", to: "९" },
  
  // Punctuation
  { from: ".", to: "।" },
  { from: ",", to: "," },
  { from: "?", to: "?" },
  { from: "!", to: "!" },
  { from: ";", to: ";" },
  { from: "'", to: "'" },
  { from: "\"", to: "\"" },
  { from: "(", to: "(" },
  { from: ")", to: ")" },
];

export function romanToUnicode(input) {
  let result = "";
  let i = 0;
  const sorted = [...ROMANIZED_MAP].sort((a,b) => b.from.length - a.from.length);
  while (i < input.length) {
    let matched = false;
    for (const { from, to } of sorted) {
      if (input.slice(i, i + from.length) === from) {
        result += to;
        i += from.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += input[i];
      i++;
    }
  }
  return result;
}
