import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePracticeStore } from '../store/usePracticeStore';
import { useTypingStore } from '../store/useTypingStore';
import { useAuthStore } from '../store/useAuthStore';
import { CURRICULUM } from '../data/curriculum';

import GuidedLesson from '../components/practice/GuidedLesson';
import { generateProgressive, generateFromBank } from '../utils/textGenerator';
import SEO from '../components/SEO';
import { unicodeToPreeti } from '../utils/preetiTranslator';
import api from '../services/api';

const playErrorSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch { /* ignore */ }
};

const Practice = () => {
  const soundEnabled = useTypingStore(s => s.soundEnabled);
  const progress = usePracticeStore(s => s.progress);
  const xp = usePracticeStore(s => s.xp);
  const streak = usePracticeStore(s => s.streak);
  const updateProgress = usePracticeStore(s => s.updateProgress);

  const [mode, setMode] = useState('preeti');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [restartKey, setRestartKey] = useState(0);

  const levels = CURRICULUM[mode] || CURRICULUM.english;

  const currentLevelRaw = levels[currentLevelIdx];

  const currentLevel = React.useMemo(() => {
    let sequence = currentLevelRaw.sequence || '';
    if (currentLevelRaw.generator === 'progressive') {
      sequence = generateProgressive(currentLevelRaw.targetChars);
    } else if (currentLevelRaw.generator === 'bank') {
      sequence = generateFromBank(currentLevelRaw.wordBank, 10);
    }
    return { ...currentLevelRaw, sequence };
  }, [currentLevelRaw]);

  const handleLessonComplete = async (stats) => {
    updateProgress(mode, currentLevel.id, stats);

    // Save to results collection
    const user = useAuthStore.getState().user;
    if (user) {
      try {
        await api.post('/results', {
          language: mode,
          mode: 'practice',
          duration: 0, // Not timed in practice
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          charData: stats.charData
        });
      } catch (e) {
        console.error('Failed to save practice result:', e);
      }
    }

    if (stats.stars > 0) {
      setTimeout(() => {
        if (currentLevelIdx < levels.length - 1) {
          setCurrentLevelIdx(prev => prev + 1);
        }
      }, 1000);
    } else {
      setRestartKey(prev => prev + 1);
    }
  };



  const renderSmartTitle = useMemo(() => (title) => {
    if (mode === 'english') return title;

    // Helper: render a chunk of characters in appropriate style
    const renderStyledPart = (text, key) => {
      const isNepali = /[\u0900-\u097F]/.test(text);
      const isPreetiSpecial = /[\u00A1-\u00FF\u2013-\u2030]/.test(text);

      if (mode === 'preeti' && (isNepali || isPreetiSpecial)) {
        const translated = unicodeToPreeti(text);
        if (translated.includes('\x98') || translated.includes('\u093D')) {
          const characters = translated.split('');
          return (
            <span key={key} className="keyboard-preeti inline-block leading-none text-[1.1em] antialiased">
              {characters.map((char, charIdx) => (
                <span key={charIdx} className={char === '\x98' || char === '\u093D' ? 'font-sans font-bold text-[0.9em]' : 'keyboard-preeti'}>
                  {char === '\x98' ? '\u093D' : char}
                </span>
              ))}
            </span>
          );
        }
        return (
          <span key={key} className="keyboard-preeti inline-block leading-none text-[1.1em] antialiased">
            {translated}
          </span>
        );
      }

      if (mode === 'unicode' && isNepali) {
        return (
          <span key={key} className="inline-block leading-none text-[0.9em] font-normal antialiased">
            {text}
          </span>
        );
      }

      return <span key={key}>{text}</span>;
    };

    return (
      <div className="inline-flex items-center flex-wrap gap-x-1">
        {title.split(/(\(.*?\))/g).map((part, i) => {
          if (part.startsWith('(') && part.endsWith(')')) {
            return (
              <span key={i} className="text-[0.8em] font-medium text-on-background/40 tracking-tight ml-1 font-mono">
                {part}
              </span>
            );
          }

          // Split into words or chunks to handle mixed text
          // eslint-disable-next-line no-misleading-character-class
          return part.split(/([^ \u0900-\u097F\u00A1-\u00FF\u2013-\u2030]+)/g).map((subPart, j) => {
            return renderStyledPart(subPart, i + '-' + j);
          });
        })}
      </div>
    );
  }, [mode]);

  if (!currentLevel) return null;

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden font-sans text-on-background selection:bg-primary/20">
      <SEO
        title="Nepali Typing Practice — Learn Preeti & Unicode | VEG"
        description="Learn Nepali typing step-by-step with guided lessons for Preeti, Unicode, and English layouts. Progressive difficulty, finger guides, XP system, and real-time accuracy feedback."
        path="/practice"
        keywords="Nepali typing lessons, Preeti keyboard practice, learn Unicode typing, typing finger guide, टाइपिङ अभ्यास"
      />

      <aside className="w-80 border-r border-outline/5 bg-white/5 p-8 flex flex-col gap-12">
        <header>
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold tracking-tighter uppercase text-primary">Lab v6</h1>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-bold uppercase rounded tracking-widest">Enhanced</span>
          </div>
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[9px] font-bold text-on-background/40 uppercase tracking-widest mb-1">XP Points</p>
              <p className="text-xl font-bold text-on-background">{xp}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-on-background/40 uppercase tracking-widest mb-1">Daily Streak</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">{'\uD83D\uDD25'}</span>
                <span className="text-xl font-bold text-on-background">{streak}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 space-y-12 custom-scrollbar">


          <section>
            <h5 className="text-[10px] font-medium text-on-background/30 uppercase tracking-[0.25em] mb-6">Practice Modes</h5>
            <div className="flex flex-col gap-1">
              {['english', 'preeti', 'unicode'].map(m => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setCurrentLevelIdx(0);
                  }}
                  className={`px-4 py-3 text-[11px] font-medium uppercase text-left tracking-[0.15em] transition-all rounded-sm ${mode === m ? 'bg-primary text-white' : 'text-on-background/40 hover:bg-on-background/5'}`}
                >
                  {m}
                </button>

              ))}
            </div>
          </section>

          <section>
            <h5 className="text-[10px] font-medium text-on-background/30 uppercase tracking-[0.25em] mb-6">
              {mode === 'preeti' ? 'Preeti' : mode === 'unicode' ? 'Unicode' : mode === 'english' ? 'English' : 'Curriculum'}
            </h5>
            <div className="flex flex-col">
              {levels.map((lvl, idx) => {
                const levelProgress = progress[mode]?.[lvl.id];
                const isLocked = false; // All levels unlocked by developer request
                const isActive = currentLevelIdx === idx;

                return (
                  <button
                    key={lvl.id}
                    disabled={isLocked}
                    onClick={() => { if (!isLocked) { setCurrentLevelIdx(idx); } }}

                    className={`group relative px-6 py-5 text-left transition-all ${isActive ? 'bg-primary/5' : isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:bg-on-background/[0.02]'}`}
                  >
                    {isActive && <motion.div layoutId="active-bar" className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-medium uppercase tracking-[0.15em] ${isActive ? 'text-primary' : 'text-on-background/40'}`}>Level {idx + 1}</span>
                        {isLocked && <span className="material-symbols-outlined text-[10px]">lock</span>}
                      </div>
                      {levelProgress?.completed && (
                        <div className="flex gap-0.5">
                          {[...Array(3)].map((_, i) => (
                            <span key={i} className={`text-[10px] ${i < levelProgress.stars ? 'text-primary' : 'text-on-background/10'}`}>{'\u2605'}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className={`text-[12px] font-medium truncate tracking-tight ${isActive ? 'text-on-background' : 'text-on-background/60'}`}>{renderSmartTitle(lvl.title)}</p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </aside>

      <main className="flex-1 relative flex flex-col items-center justify-center p-12 overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/[0.02] blur-[150px] pointer-events-none" />

        <header className="absolute top-16 left-16 right-16 flex justify-between items-end z-20">
          <div className="space-y-4">
            <p className="text-[11px] font-medium text-primary uppercase tracking-[0.6em]">Guided Learning Path</p>
            <h2 className="text-2xl font-medium text-on-background tracking-tighter leading-tight drop-shadow-sm">
              {renderSmartTitle(currentLevel.title)}
            </h2>
          </div>

          <div className="flex flex-col items-end gap-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setRestartKey(prev => prev + 1)}
                className="group flex items-center gap-2 px-3 py-1.5 border border-outline/10 hover:border-primary/50 transition-colors"
                title="Restart Lesson"
              >
                <span className="material-symbols-outlined text-sm text-on-background/40 group-hover:text-primary transition-colors">refresh</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-on-background/40 group-hover:text-primary transition-colors">Restart</span>
              </button>
              <div className="text-right">
                <p className="text-[10px] font-medium text-on-background/20 uppercase tracking-[0.3em] mb-1">Overall Progress</p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-medium text-primary leading-none">
                    {Math.round(((currentLevelIdx + 1) / levels.length) * 100)}%
                  </span>
                  <div className="w-32 h-1.5 bg-on-background/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentLevelIdx + 1) / levels.length) * 100}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div key={currentLevel.id + restartKey} className="w-full flex flex-col items-center mt-12">
          <GuidedLesson
            level={currentLevel}
            mode={mode}
            onComplete={handleLessonComplete}
            playErrorSound={soundEnabled ? playErrorSound : () => { }}
          />
        </div>
      </main>
    </div>
  );
};

export default Practice;
