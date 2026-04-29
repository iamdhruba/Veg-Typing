import React from 'react';
import { KEYBOARD_ROWS, UNICODE_FULL_REF, PREETI_FULL_REF } from '../../data/keyMappings';

// Maps a shifted symbol to its physical (unshifted) key on a US keyboard
const SYMBOL_TO_PHYSICAL = {
  '<': ',', '>': '.', '?': '/', ':': ';', '"': "'", '{': '[', '}': ']', '|': '\\',
  '_': '-', '+': '=', '~': '`', '!': '1', '@': '2', '#': '3', '$': '4',
  '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0'
};

const PracticeKeyboard = ({ activeKeys = [], errorKeys = [], targetKeys, mode }) => {
  const keyToNepali = {};
  const shiftedKeyToNepali = {};

  if (mode === 'english') {
    KEYBOARD_ROWS.flat().forEach(key => {
      if (key.length === 1) {
        keyToNepali[key] = key.toLowerCase();
        const symbolMap = { 
          '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', 
          '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_', '=': '+',
          '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', ',': '<', '.': '>', '/': '?' 
        };
        shiftedKeyToNepali[key] = symbolMap[key] || key.toUpperCase();
      }
    });
  } else {
    const currentRef = mode === 'romanized' || mode === 'unicode' ? UNICODE_FULL_REF : PREETI_FULL_REF;
    
    Object.values(currentRef).flat().forEach(item => {
      if (!item.e || !item.n) return;
      const parts = item.e.split('+');

      if (parts.length === 2 && parts[0].toLowerCase() === 'shift') {
        const rawBase = parts[1];
        const physicalKey = SYMBOL_TO_PHYSICAL[rawBase] || rawBase.toUpperCase();
        shiftedKeyToNepali[physicalKey] = mode === 'preeti' ? (parts[1].length === 1 ? parts[1].toUpperCase() : item.n) : item.n;
      } else if (parts.length === 1) {
        const physicalKey = SYMBOL_TO_PHYSICAL[item.e] || item.e.toUpperCase();
        keyToNepali[physicalKey] = mode === 'preeti' ? item.e : item.n;
      }
    });
  }

  const isTargetShift = targetKeys?.includes('L_SHIFT') || targetKeys?.includes('R_SHIFT');
  const targetBaseKey = targetKeys?.find(k => k !== 'L_SHIFT' && k !== 'R_SHIFT' && k !== 'ALT');

  return (
    <div className={`bg-surface-container/20 backdrop-blur-2xl p-10 border border-outline/10 shadow-2xl rounded-2xl scale-110 origin-top`}>
      <div className="flex flex-col gap-2">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2 justify-center">
            {row.map((key, kIdx) => {
              const isActive = activeKeys.includes(key);
              const isTarget = targetKeys?.includes(key);
              const nepaliChar = keyToNepali[key];
              const shiftedNepaliChar = shiftedKeyToNepali[key];
              const showShifted = isTargetShift && key === targetBaseKey;

              return (
                <div 
                  key={kIdx} 
                  className={`
                    relative h-16 flex flex-col items-center justify-center rounded-[8px] border transition-all duration-100
                    ${errorKeys.includes(key) || (errorKeys.includes('SHIFT') && (key === 'L_SHIFT' || key === 'R_SHIFT')) || (errorKeys.includes('ALT') && key === 'ALT') || (isActive && !isTarget)
                      ? 'bg-error border-error text-white z-20 scale-105 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      : isActive || isTarget
                        ? 'bg-correct border-correct text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] z-10' + (isActive ? ' scale-95 translate-y-0.5' : '')
                        : 'bg-surface-container-high border-outline/10 text-on-background/50'
                    }
                    ${key === 'BS' ? 'w-28' : key === 'TAB' ? 'w-24' : key === 'CAPS' ? 'w-28' : key === 'ENT' ? 'w-28' : (key === 'L_SHIFT' || key === 'R_SHIFT' || key === 'SHIFT') ? 'w-36' : key === 'ALT' ? 'w-24' : key === 'SPACE' ? 'w-[400px]' : 'w-16'}
                  `}
                >
                  {key !== 'SPACE' && (
                    <>
                      {shiftedNepaliChar && (
                        <span className={`absolute transition-all duration-300 font-bold
                          ${showShifted 
                            ? (mode === 'unicode' || mode === 'english' ? 'inset-0 flex items-center justify-center text-[22px] opacity-100' : 'inset-0 flex items-center justify-center text-[28px] opacity-100') 
                            : 'top-1.5 right-2 text-[11px] opacity-30'} 
                          ${isActive || errorKeys.includes(key) || isTarget ? 'text-white' : 'text-on-background'}
                          ${mode === 'preeti' ? 'keyboard-preeti' : ''}`}>
                          {shiftedNepaliChar}
                        </span>
                      )}
                      {nepaliChar && (
                        <span className={`transition-all duration-300 font-medium leading-none
                          ${showShifted && shiftedNepaliChar
                            ? 'absolute top-1.5 right-2 text-[11px] opacity-30' 
                            : (mode === 'unicode' || mode === 'english' ? 'text-[18px] opacity-100' : 'text-[24px] opacity-100')} 
                          ${isActive || errorKeys.includes(key) || isTarget ? 'text-white' : 'text-on-background'}
                          ${mode === 'preeti' ? 'keyboard-preeti' : ''}`}>
                          {nepaliChar}
                        </span>
                      )}
                      {!nepaliChar && !shiftedNepaliChar && (
                        <span className={`text-[12px] font-medium uppercase tracking-widest font-sans
                          ${isActive || errorKeys.includes(key) || isTarget ? 'text-white/80' : 'text-on-background/40'}`}>
                          {key.replace('_', ' ')}
                        </span>
                      )}
                      {(nepaliChar || shiftedNepaliChar) && (
                        <span className="absolute bottom-1.5 left-2 text-[10px] font-bold uppercase tracking-tighter opacity-30 font-sans">
                          {key.replace('_', ' ')}
                        </span>
                      )}
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

export default PracticeKeyboard;
