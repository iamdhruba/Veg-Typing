import { WORD_LISTS } from './wordLists';

export const getWeakCharacters = (history, mode) => {
  if (!history || history.length === 0) return [];
  
  const charStats = {};
  
  // Filter history by mode if provided
  const relevantHistory = mode 
    ? history.filter(r => r.language === mode)
    : history;

  relevantHistory.forEach(result => {
    if (result.charData) {
      Object.entries(result.charData).forEach(([char, data]) => {
        if (!charStats[char]) charStats[char] = { correct: 0, total: 0 };
        charStats[char].correct += data.correct;
        charStats[char].total += (data.correct + data.incorrect);
      });
    }
  });
  
  return Object.entries(charStats)
    .map(([char, stats]) => ({
      char,
      accuracy: (stats.correct / stats.total) * 100,
      total: stats.total
    }))
    .filter(s => s.total >= 3 && s.accuracy < 92) // Slightly more lenient threshold
    .sort((a, b) => a.accuracy - b.accuracy)
    .map(s => s.char);
};

export const getPersonalizedWords = (lang, history, count = 100) => {
  const baseList = WORD_LISTS[lang] || WORD_LISTS.english;
  const weakKeys = getWeakCharacters(history, lang);
  
  if (weakKeys.length === 0) return baseList.slice(0, count);
  
  // Filter for words containing at least one weak key
  const targetedWords = baseList.filter(word => 
    weakKeys.some(key => word.includes(key))
  );
  
  // If we don't have enough targeted words, mix with regular ones
  const finalPool = targetedWords.length > 10 ? targetedWords : baseList;
  
  return finalPool
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

