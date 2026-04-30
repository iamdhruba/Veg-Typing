// Memoized grapheme splitting for better performance
const graphemeCache = new Map();

export const splitGraphemes = (text, language) => {
  const cacheKey = `${language}:${text}`;
  
  if (graphemeCache.has(cacheKey)) {
    return graphemeCache.get(cacheKey);
  }

  let result;
  
  if (language === 'preeti') {
    const combos = /sf\[|sf\]|s\[|s\]|sf|sl|sL|s'|s"|sF|s\+|sM|s\{|s\\|c\+|cM|cf\]|cf\}|P\]|O\{|b\[|cf|pm|em|km|0f|if|If|Qm|qm|./g;
    result = text.match(combos) || [];
  } else if (Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('ne', { granularity: 'grapheme' });
    result = Array.from(segmenter.segment(text)).map(s => s.segment);
  } else {
    result = text.match(/[\u0900-\u097F][\u093E-\u094D\u0901-\u0903\u0951-\u0957\u0962-\u0963]*|./gu) || text.split('');
  }

  // Limit cache size to prevent memory issues
  if (graphemeCache.size > 1000) {
    const firstKey = graphemeCache.keys().next().value;
    graphemeCache.delete(firstKey);
  }

  graphemeCache.set(cacheKey, result);
  return result;
};

export const clearGraphemeCache = () => {
  graphemeCache.clear();
};
