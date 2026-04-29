/**
 * Progressive Text Generator — Scaffolded Learning Engine
 */

export const generateProgressive = (chars) => {
  let sequence = [];

  // Step 1: Single character isolation
  // We use a regular space so the user types them separatedly and they don't squish visually
  chars.forEach(char => {
    sequence.push(Array(5).fill(char).join(' '));
  });

  // Step 2: Adjacent forward pairs
  for (let i = 0; i < chars.length - 1; i++) {
    const char1 = chars[i];
    const char2 = chars[i + 1];
    // Add space between symbols/Alt-codes, but keep conjuncts joined
    const needsSpace = !/[\u0900-\u097F]/.test(char1) || !/[\u0900-\u097F]/.test(char2);
    const pair = needsSpace ? `${char1} ${char2}` : char1 + char2;
    sequence.push(Array(3).fill(pair).join(' '));
  }

  // Step 3: Adjacent reverse pairs
  for (let i = 0; i < chars.length - 1; i++) {
    const char1 = chars[i + 1];
    const char2 = chars[i];
    const needsSpace = !/[\u0900-\u097F]/.test(char1) || !/[\u0900-\u097F]/.test(char2);
    const pair = needsSpace ? `${char1} ${char2}` : char1 + char2;
    sequence.push(Array(3).fill(pair).join(' '));
  }

  // Step 4: Random 3-character combos (form a single word)
  for (let i = 0; i < 6; i++) {
    let word = '';
    for (let j = 0; j < 3; j++) {
      word += chars[Math.floor(Math.random() * chars.length)];
    }
    sequence.push(word);
  }

  // Step 5: Random 4-character combos (form a single word)
  for (let i = 0; i < 6; i++) {
    let word = '';
    for (let j = 0; j < 4; j++) {
      word += chars[Math.floor(Math.random() * chars.length)];
    }
    sequence.push(word);
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

