import React, { useState, useEffect } from 'react';
import { KEYBOARD_ROWS, UNICODE_FULL_REF, PREETI_FULL_REF } from '../../data/keyMappings';
import { romanToUnicode } from '../../utils/romanizedMap';

// Reverse map: Given a target character (e.g. 'क'), what physical key do we need to press?
const buildReverseMap = (mode) => {
  const map = {};
  
  if (mode === 'english') {
    KEYBOARD_ROWS.flat().forEach(key => {
      if (key.length === 1) {
        map[key.toLowerCase()] = { key, shift: false };
        const symbolMap = { 
          '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', 
          '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=',
          '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/' 
        };
        const shiftedChar = symbolMap[key] || key.toUpperCase();
        map[shiftedChar] = { key, shift: true };
      }
    });
    map[' '] = { key: 'SPACE', shift: false };
  } else {
    const currentRef = mode === 'romanized' || mode === 'unicode' ? UNICODE_FULL_REF : PREETI_FULL_REF;
    
    Object.values(currentRef).flat().forEach(item => {
      if (!item.e || !item.n) return;
      
      // We want to map the target character 'n' to its first physical key in 'e'
      // Example: 'ख' -> 'Shift+K' -> { key: 'K', shift: true }
      // Example: 'क्ष' -> 'k+/+z' -> { key: 'K', shift: false } (just highlight the first key in sequence)
      
      const parts = item.e.split('+');
      
      // If it's a shifted single key (e.g. Shift+K)
      if (parts.length === 2 && parts[0].toLowerCase() === 'shift') {
        const baseKey = parts[1].toUpperCase();
        const keyMap = { '<': ',', '>': '.', '?': '/', ':': ';', '{': '[', '}': ']', '|': '\\', '+': '=', '_': '-', '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0' };
        const actualKey = keyMap[baseKey] || baseKey;
        map[item.n] = { key: actualKey, shift: true };
      } 
      // Single character without shift (e.g. k)
      else if (parts.length === 1) {
        const baseKey = item.e.toUpperCase();
        const keyMap = { '<': ',', '>': '.', '?': '/', ':': ';', '{': '[', '}': ']', '|': '\\', '+': '=', '_': '-', '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0' };
        const actualKey = keyMap[baseKey] || baseKey;
        map[item.n] = { key: actualKey, shift: false };
      }
      // Multi-key sequences (e.g. k+/+z). 
      else if (parts.length > 1) {
        const firstPart = parts[0];
        if (firstPart.toLowerCase() === 'alt') {
           map[item.n] = { key: 'ALT', shift: false };
        } else {
           const baseKey = firstPart.toUpperCase();
           const keyMap = { '<': ',', '>': '.', '?': '/', ':': ';', '{': '[', '}': ']', '|': '\\', '+': '=', '_': '-', '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0' };
           const actualKey = keyMap[baseKey] || baseKey;
           map[item.n] = { key: actualKey, shift: false };
        }
      }
    });

    map[' '] = { key: 'SPACE', shift: false };

    // --- ENHANCEMENT FOR PREETI ---
    // In Preeti mode, the target text is often already ASCII (e.g. 's' for 'क').
    // We need to map these ASCII chars to physical keys directly.
    if (mode === 'preeti') {
      const asciiKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:'\",.<>/?`~\\";
      const shiftMap = { 
        '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', 
        '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=',
        '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/' 
      };

      for (const char of asciiKeys) {
        if (char === ' ') continue;
        const isUpper = char >= 'A' && char <= 'Z';
        const shiftedFrom = shiftMap[char];
        
        if (isUpper) {
          map[char] = { key: char, shift: true };
        } else if (shiftedFrom) {
          map[char] = { key: shiftedFrom.toUpperCase(), shift: true };
        } else {
          map[char] = { key: char.toUpperCase(), shift: false };
        }
      }
    }
  }
  
  return map;
};

const FINGER_MAP = {
  // Left Hand
  'L_PINKY': ['`', '1', 'Q', 'A', 'Z', 'L_SHIFT', 'TAB', 'CAPS'],
  'L_RING': ['2', 'W', 'S', 'X'],
  'L_MIDDLE': ['3', 'E', 'D', 'C'],
  'L_INDEX': ['4', '5', 'R', 'T', 'F', 'G', 'V', 'B'],
  // Right Hand
  'R_INDEX': ['6', '7', 'Y', 'U', 'H', 'J', 'N', 'M'],
  'R_MIDDLE': ['8', 'I', 'K', ','],
  'R_RING': ['9', 'O', 'L', '.'],
  'R_PINKY': ['0', '-', '=', 'P', '[', ']', '\\', ';', "'", '/', 'ENT', 'R_SHIFT', 'BS'],
  // Thumbs
  'THUMB': ['SPACE', 'ALT']
};

const getFingerColor = (key) => {
  if (FINGER_MAP.L_PINKY.includes(key)) return 'border-pink-500/30';
  if (FINGER_MAP.L_RING.includes(key)) return 'border-orange-500/30';
  if (FINGER_MAP.L_MIDDLE.includes(key)) return 'border-yellow-500/30';
  if (FINGER_MAP.L_INDEX.includes(key)) return 'border-blue-500/30';
  if (FINGER_MAP.R_INDEX.includes(key)) return 'border-blue-500/30';
  if (FINGER_MAP.R_MIDDLE.includes(key)) return 'border-yellow-500/30';
  if (FINGER_MAP.R_RING.includes(key)) return 'border-orange-500/30';
  if (FINGER_MAP.R_PINKY.includes(key)) return 'border-pink-500/30';
  if (FINGER_MAP.THUMB.includes(key)) return 'border-emerald-500/30';
  return 'border-outline/10';
};

const VirtualKeyboard = ({ mode, nextChar }) => {
  const [activeKey, setActiveKey] = useState(null);
  const [needsShift, setNeedsShift] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());

  // Listen to actual keyboard presses for visual feedback
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        let key = e.key.toUpperCase();
        if (e.code === 'Space') key = 'SPACE';
        if (e.code === 'Backspace') key = 'BS';
        if (e.code === 'Enter') key = 'ENT';
        if (e.code === 'ShiftLeft') key = 'L_SHIFT';
        if (e.code === 'ShiftRight') key = 'R_SHIFT';
        newSet.add(key);
        return newSet;
      });
    };

    const handleKeyUp = (e) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        let key = e.key.toUpperCase();
        if (e.code === 'Space') key = 'SPACE';
        if (e.code === 'Backspace') key = 'BS';
        if (e.code === 'Enter') key = 'ENT';
        if (e.code === 'ShiftLeft') key = 'L_SHIFT';
        if (e.code === 'ShiftRight') key = 'R_SHIFT';
        newSet.delete(key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const reverseMap = React.useMemo(() => buildReverseMap(mode), [mode]);

  // Update target key based on nextChar
  useEffect(() => {
    if (!nextChar) {
      setActiveKey(null);
      setNeedsShift(false);
      return;
    }

    const target = reverseMap[nextChar];

    if (target) {
      setActiveKey(target.key);
      setNeedsShift(target.shift);
    } else {
      setActiveKey(null);
      setNeedsShift(false);
    }
  }, [nextChar, reverseMap]);

  // Labels for rendering
  const keyToChar = {};
  const shiftedKeyToChar = {};

  if (mode === 'english' || mode === 'romanized') {
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
    const currentRef = mode === 'unicode' ? UNICODE_FULL_REF : PREETI_FULL_REF;
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
  }

  const getKeyStyle = (key) => {
    const isShiftKey = key === 'L_SHIFT' || key === 'R_SHIFT' || key === 'SHIFT';
    const isPressed = pressedKeys.has(key) || (isShiftKey && (pressedKeys.has('L_SHIFT') || pressedKeys.has('R_SHIFT')));
    
    if (isPressed) {
      return 'bg-on-background text-background border-on-background shadow-inner scale-95';
    }

    const isTarget = key === activeKey || (isShiftKey && needsShift);
    
    if (isTarget) {
      return 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] text-emerald-500 animate-pulse';
    }

    const fingerColor = getFingerColor(key);
    return `bg-surface-container-high ${fingerColor} text-on-background/40`;
  };

  return (
    <div className={`bg-surface-container/5 p-6 border border-outline/5 rounded-xl backdrop-blur-xl ${mode === 'preeti' ? 'keyboard-preeti' : ''}`}>
      <div className="flex flex-col gap-1.5">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1.5 justify-center">
            {row.map((key, kIdx) => {
              const char = keyToChar[key];
              const sChar = shiftedKeyToChar[key];
              const colorClass = getKeyStyle(key);

              return (
                <div 
                  key={kIdx} 
                  className={`
                    relative h-12 flex flex-col items-center justify-center rounded-[4px] border transition-all duration-100
                    ${colorClass}
                    ${key === 'BS' ? 'w-20' : key === 'TAB' ? 'w-16' : key === 'CAPS' ? 'w-20' : key === 'ENT' ? 'w-20' : (key === 'L_SHIFT' || key === 'R_SHIFT' || key === 'SHIFT') ? 'w-24' : key === 'ALT' ? 'w-16' : key === 'SPACE' ? 'w-[350px]' : 'w-12'}
                  `}
                >
                  <span className="text-[14px] font-bold">{char || (key.length > 1 ? key : '')}</span>
                  {sChar && <span className="absolute top-1 right-1 text-[8px] opacity-40">{sChar}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
