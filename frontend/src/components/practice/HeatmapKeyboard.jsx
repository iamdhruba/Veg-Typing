import React from 'react';
import { KEYBOARD_ROWS, UNICODE_FULL_REF, PREETI_FULL_REF } from '../../data/keyMappings';

const HeatmapKeyboard = ({ charData, mode }) => {
  const keyToChar = {};
  const shiftedKeyToChar = {};

  if (mode === 'english') {
    KEYBOARD_ROWS.flat().forEach(key => {
      if (key.length === 1) {
        keyToChar[key] = key.toLowerCase();
        const symbolMap = { 
          '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', 
          '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
          '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?' 
        };
        shiftedKeyToChar[key] = symbolMap[key] || key.toUpperCase();
      }
    });
  } else {
    const currentRef = mode === 'romanized' || mode === 'unicode' ? UNICODE_FULL_REF : PREETI_FULL_REF;
    Object.values(currentRef).flat().forEach(item => {
      if (item.e.startsWith('Shift+') && item.e.split('+').length === 2) {
        const baseKey = item.e.replace('Shift+', '').toUpperCase();
        const keyMap = { '<': ',', '>': '.', '?': '/', ':': ';', '{': '[', '}': ']', '|': '\\', '+': '=', '_': '-', '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0' };
        const actualKey = keyMap[baseKey] || baseKey;
        shiftedKeyToChar[actualKey] = item.n;
      } else if (item.e.length === 1) {
        keyToChar[item.e.toUpperCase()] = item.n;
      }
    });
    if (mode === 'preeti') {
      keyToChar['I'] = 'ष';
      shiftedKeyToChar['I'] = 'क्ष';
      keyToChar['O'] = 'य';
      shiftedKeyToChar['O'] = 'इ';
      shiftedKeyToChar['F'] = 'ँ';
    }
  }

  const getHeatmapColor = (char) => {
    if (!char || !charData || !charData[char]) return 'bg-surface-container-high border-outline/10 text-on-background/20';
    const data = charData[char];
    const acc = (data.correct / (data.correct + data.incorrect)) * 100;
    
    if (acc === 100) return 'bg-primary/20 border-primary/40 text-primary';
    if (acc > 90) return 'bg-primary/10 border-primary/20 text-primary/80';
    if (acc > 75) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500/80';
    return 'bg-error/10 border-error/30 text-error/80';
  };

  const getStats = (char) => {
    if (!char || !charData || !charData[char]) return null;
    const data = charData[char];
    const acc = Math.round((data.correct / (data.correct + data.incorrect)) * 100);
    return { acc, correct: data.correct, incorrect: data.incorrect };
  };

  return (
    <div className="bg-surface-container/5 p-8 border border-outline/5 rounded-xl">
      <div className="flex flex-col gap-1.5">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1.5 justify-center">
            {row.map((key, kIdx) => {
              const char = keyToChar[key];
              const sChar = shiftedKeyToChar[key];
              const colorClass = getHeatmapColor(char) || getHeatmapColor(sChar);
              const stats = getStats(char) || getStats(sChar);

              return (
                <div 
                  key={kIdx} 
                  className={`
                    relative h-12 flex flex-col items-center justify-center rounded-[4px] border transition-all group cursor-default
                    ${colorClass}
                    ${key === 'BS' ? 'w-20' : key === 'TAB' ? 'w-16' : key === 'CAPS' ? 'w-20' : key === 'ENT' ? 'w-20' : (key === 'L_SHIFT' || key === 'R_SHIFT' || key === 'SHIFT') ? 'w-24' : key === 'SPACE' ? 'w-[400px]' : 'w-12'}
                  `}
                >
                  <span className="text-[14px] font-bold">{char || ''}</span>
                  {sChar && <span className="absolute top-1 right-1 text-[8px] opacity-40">{sChar}</span>}
                  
                  {stats && (
                    <>
                      <span className="absolute bottom-[2px] left-1 text-[6px] font-black opacity-60">
                        {stats.acc}%
                      </span>
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface-container border border-outline/10 px-3 py-1.5 rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 flex gap-3 whitespace-nowrap backdrop-blur-xl">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-primary">{stats.acc}%</span>
                          <span className="text-[6px] uppercase tracking-widest text-on-background/50">Accuracy</span>
                        </div>
                        <div className="w-px bg-outline/10 h-full" />
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-error">{stats.incorrect}</span>
                          <span className="text-[6px] uppercase tracking-widest text-on-background/50">Misses</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatmapKeyboard;
