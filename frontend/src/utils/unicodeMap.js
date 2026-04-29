export const UNICODE_MAP = [
  // Consonants
  { from: "k", to: "क" },
  { from: "K", to: "ख" },
  { from: "g", to: "ग" },
  { from: "G", to: "घ" },
  { from: "C", to: "छ" },
  { from: "c", to: "च" },
  { from: "J", to: "झ" },
  { from: "j", to: "ज" },
  { from: "q", to: "ट" },
  { from: "Q", to: "ठ" },
  { from: "x", to: "ड" },
  { from: "X", to: "ढ" },
  { from: "t", to: "त" },
  { from: "T", to: "थ" },
  { from: "d", to: "द" },
  { from: "D", to: "ध" },
  { from: "n", to: "न" },
  { from: "N", to: "ण" },
  { from: "p", to: "प" },
  { from: "P", to: "फ" },
  { from: "b", to: "ब" },
  { from: "B", to: "भ" },
  { from: "m", to: "म" },
  { from: "y", to: "य" },
  { from: "r", to: "र" },
  { from: "l", to: "ल" },
  { from: "v", to: "व" },
  { from: "s", to: "स" },
  { from: "S", to: "श" },
  { from: "z", to: "ष" },
  { from: "h", to: "ह" },
  { from: "Y", to: "ञ" },
  
  // Specific shifts from the image
  { from: "Shift+K", to: "ख" },
  { from: "Shift+G", to: "घ" },
  { from: "Shift+<", to: "ङ" },
  { from: "Shift+C", to: "छ" },
  { from: "Shift+J", to: "झ" },
  { from: "Shift+Y", to: "ञ" },
  { from: "Shift+Q", to: "ठ" },
  { from: "Shift+X", to: "ढ" },
  { from: "Shift+N", to: "ण" },
  { from: "Shift+T", to: "थ" },
  { from: "Shift+D", to: "ध" },
  { from: "Shift+P", to: "फ" },
  { from: "Shift+B", to: "भ" },
  { from: "Shift+S", to: "श" },
  
  // Vowels
  { from: "Shift+H", to: "अ" },
  { from: "Shift+A", to: "आ" },
  { from: "[", to: "इ" },
  { from: "Shift+[", to: "ई" },
  { from: "f", to: "उ" },
  { from: "Shift+F", to: "ऊ" },
  { from: "Shift+Z", to: "ऋ" },
  { from: "]", to: "ए" },
  { from: "Shift+]", to: "ऐ" },
  { from: "Shift+O", to: "ओ" },
  { from: "Shift+W", to: "औ" },

  // Matras
  { from: "a", to: "ा" },
  { from: "i", to: "ि" },
  { from: "Shift+I", to: "ी" },
  { from: "u", to: "ु" },
  { from: "Shift+U", to: "ू" },
  { from: "Shift+R", to: "ृ" },
  { from: "e", to: "े" },
  { from: "Shift+E", to: "ै" },
  { from: "o", to: "ो" },
  { from: "w", to: "ौ" },
  
  // Modifiers
  { from: "Shift+M", to: "ं" },
  { from: "Shift+;", to: "ः" },
  { from: "Shift+V", to: "ँ" },
  { from: "/", to: "्" },
  { from: "\\", to: "्" },
  { from: "Shift+.", to: "़" },
  
  // Numbers
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
  { from: "Shift+/", to: "?" },
  { from: "Shift+1", to: "!" },
  { from: "Shift+9", to: "(" },
  { from: "Shift+0", to: ")" },
  { from: "Shift+'", to: "\"" },
  { from: "Alt+2384", to: "ॐ" },
  { from: "Alt+43", to: "+" },
  { from: "Alt+61", to: "=" },
];

export function convertToUnicode(input) {
  let result = "";
  let i = 0;
  // Sort by length of 'from' to match longest sequences first
  const sorted = [...UNICODE_MAP].sort((a,b) => b.from.length - a.from.length);
  
  while (i < input.length) {
    let matched = false;
    for (const { from, to } of sorted) {
      // Handle Shift+ prefixes if they are passed as literal strings or single chars
      let target = from;
      if (from.startsWith("Shift+")) {
          // If the input has the uppercase version of the key, it counts as Shift+Key
          // But our input engine might be passing the actual typed characters.
          // In useTypingEngine, we get raw = e.target.value.
          // If I press Shift+K, raw will contain 'K'.
      }
      
      // We need a way to match 'K' to 'Shift+K' if that's how it's mapped.
      // Actually, let's simplify the map to use the characters themselves.
    }
    // ...
  }
}
