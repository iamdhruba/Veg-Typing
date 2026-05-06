/**
 * Progressive Text Generator — Scaffolded Learning Engine
 */

// Halant (virama) character — if a Nepali char ends with this, it is a half-letter.
// Concatenating half-letters forms conjunct grapheme clusters that the splitter
// treats as a single character, so we always space them out.
const HALANT = '\u094D';

const isHalfLetter = (char) => char.endsWith(HALANT);

const joinNepali = (a, b) => {
  // Always separate if either char is non-Nepali, or if either ends in halant
  const bothNepali = /[\u0900-\u097F]/.test(a) && /[\u0900-\u097F]/.test(b);
  if (!bothNepali || isHalfLetter(a) || isHalfLetter(b)) return `${a} ${b}`;
  return a + b;
};

export const generateProgressive = (chars) => {
  let sequence = [];

  // Step 1: Single character isolation
  // We use a regular space so the user types them separatedly and they don't squish visually
  chars.forEach(char => {
    sequence.push(Array(5).fill(char).join(' '));
  });

  // Step 2: Adjacent forward pairs
  for (let i = 0; i < chars.length - 1; i++) {
    const pair = joinNepali(chars[i], chars[i + 1]);
    sequence.push(Array(3).fill(pair).join(' '));
  }

  // Step 3: Adjacent reverse pairs
  for (let i = 0; i < chars.length - 1; i++) {
    const pair = joinNepali(chars[i + 1], chars[i]);
    sequence.push(Array(3).fill(pair).join(' '));
  }

  // Step 4: Random 3-character combos
  // If any char in the set is a half-letter, space them to prevent conjunct merging
  const hasHalfLetters = chars.some(isHalfLetter);
  for (let i = 0; i < 6; i++) {
    const parts = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]);
    sequence.push(hasHalfLetters ? parts.join(' ') : parts.join(''));
  }

  // Step 5: Random 4-character combos
  for (let i = 0; i < 6; i++) {
    const parts = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]);
    sequence.push(hasHalfLetters ? parts.join(' ') : parts.join(''));
  }

  return sequence.join(' ');
};

/**
 * Word Bank Generator — truly random every time, never repeats until exhausted
 */
export const generateFromBank = (wordBank, count = 30) => {
  if (!wordBank || wordBank.length === 0) return '';
  const pool = [...wordBank];
  const result = [];
  while (result.length < count) {
    // Reshuffle pool each pass so order is always different
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    result.push(...pool);
  }
  return result.slice(0, count).join(' ');
};

/**
 * Smart Drill Generator — focuses on specific weak characters
 */
export const generateSmartDrill = (weakKeys, mode = 'english') => {
  if (!weakKeys || weakKeys.length === 0) {
    // Fallback if no weak keys are found
    const fallbacks = {
      english: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
      preeti: ['\u0915', '\u0924', '\u092E', '\u0928', '\u0930'],
      unicode: ['\u0915', '\u0924', '\u092E', '\u0928', '\u0930']
    };
    weakKeys = fallbacks[mode] || fallbacks.english;
  }

  // Take top 5 weak keys to avoid overwhelming
  const targets = weakKeys.slice(0, 5);
  let sequence = [];

  // 1. Triplets for isolation
  targets.forEach(char => {
    sequence.push(`${char}${char}${char}`);
    sequence.push(`${char}${char}${char}`);
  });

  // 2. Pairs with other weak keys
  if (targets.length > 1) {
    for (let i = 0; i < targets.length; i++) {
      const next = targets[(i + 1) % targets.length];
      sequence.push(`${targets[i]}${next}${targets[i]}`);
      sequence.push(`${next}${targets[i]}${next}`);
    }
  }

  // 3. Mixed random clusters
  for (let i = 0; i < 10; i++) {
    let word = '';
    const len = 3 + Math.floor(Math.random() * 3);
    for (let j = 0; j < len; j++) {
      word += targets[Math.floor(Math.random() * targets.length)];
    }
    sequence.push(word);
  }

  // Shuffle slightly but keep triplets mostly at start
  const triplets = sequence.slice(0, targets.length * 2);
  const others = sequence.slice(targets.length * 2).sort(() => Math.random() - 0.5);

  return [...triplets, ...others].join(' ');
};

