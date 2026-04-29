import { useState, useEffect } from 'react';

const ACHIEVEMENTS = [
  { id: 'first_step', name: 'First Step', desc: 'Complete your first typing test.', icon: '🎯' },
  { id: 'speed_demon_50', name: 'Speed Demon I', desc: 'Reach 50 WPM.', icon: '⚡' },
  { id: 'speed_demon_100', name: 'Speed Demon II', desc: 'Reach 100 WPM.', icon: '🔥' },
  {  id: 'perfectionist', name: 'Perfectionist', desc: 'Achieve 100% accuracy.', icon: '💎' },
  { id: 'preeti_master', name: 'Preeti Master', desc: 'Reach 40 WPM in Preeti.', icon: '⌨️' },
];

export const useAchievements = (history) => {
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    if (!history || history.length === 0) return;

    const newUnlocked = [];
    
    // Check first step
    if (history.length > 0) newUnlocked.push('first_step');

    // Check speeds
    const maxWpm = Math.max(...history.map(r => r.wpm));
    if (maxWpm >= 50) newUnlocked.push('speed_demon_50');
    if (maxWpm >= 100) newUnlocked.push('speed_demon_100');

    // Check perfection
    if (history.some(r => r.accuracy === 100)) newUnlocked.push('perfectionist');

    // Check language specifics
    const preetiMax = Math.max(...history.filter(r => r.language === 'preeti').map(r => r.wpm), 0);
    if (preetiMax >= 40) newUnlocked.push('preeti_master');


    setUnlocked(newUnlocked);
  }, [history]);

  return { 
    achievements: ACHIEVEMENTS.map(a => ({ ...a, isUnlocked: unlocked.includes(a.id) })),
    unlockedCount: unlocked.length 
  };
};
