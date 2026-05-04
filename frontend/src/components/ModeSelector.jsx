import React from 'react';
import { useTypingStore } from '../store/useTypingStore';

const ModeSelector = () => {
  const language = useTypingStore(s => s.language);
  const mode = useTypingStore(s => s.mode);
  const duration = useTypingStore(s => s.duration);
  const customText = useTypingStore(s => s.customText);
  const setLanguage = useTypingStore(s => s.setLanguage);
  const setMode = useTypingStore(s => s.setMode);
  const setDuration = useTypingStore(s => s.setDuration);
  const setCustomText = useTypingStore(s => s.setCustomText);

  const languages = ['english', 'preeti', 'unicode'];
  const durations = [15, 30, 60, 120];

  return (
    <div className="flex flex-col items-center gap-8 mb-16">
      <div className="flex flex-wrap gap-4 md:gap-8 justify-center bg-surface-container-low px-4 md:px-8 py-4 border border-outline/20">
        <div className="flex gap-2 sm:gap-4 border-r border-outline/30 pr-4 md:pr-8">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                if (mode === 'custom') setMode('time');
              }}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${language === lang && mode !== 'custom' ? 'text-primary' : 'text-on-background/50 hover:text-on-background/80'}`}
            >
              {lang === 'unicode' ? 'Romanized Unicode' : lang}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 sm:gap-4 border-r border-outline/30 pr-4 md:pr-8">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => {
                setDuration(d);
                if (mode === 'custom') setMode('time');
              }}
              className={`text-xs font-medium uppercase tracking-widest transition-colors ${duration === d && mode !== 'custom' ? 'text-primary' : 'text-on-background/50 hover:text-on-background/80'}`}
            >
              {d}s
            </button>
          ))}
        </div>

        <div className="flex gap-4">

          <button
            onClick={() => setMode('custom')}
            className={`text-xs font-medium uppercase tracking-widest transition-colors ${mode === 'custom' ? 'text-primary' : 'text-on-background/50 hover:text-on-background/80'}`}
          >
            Custom Text
          </button>
        </div>
      </div>

      {mode === 'custom' && (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your custom Nepali or English text here for practice..."
            className="w-full h-32 bg-surface-container/30 border border-outline/20 p-6 text-sm text-on-background outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-on-background/20"
          />
        </div>
      )}
      

    </div>
  );
};

export default ModeSelector;
