import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePracticeStore } from '../../store/usePracticeStore';
import { KEY_TO_FINGER, UNICODE_FULL_REF, PREETI_FULL_REF } from '../../data/keyMappings';
import PracticeKeyboard from './PracticeKeyboard';
import FingerGuide from './FingerGuide';
import { useTypingStore } from '../../store/useTypingStore';
import { playTypewriterClick } from '../../utils/sound';
import { unicodeToPreeti } from '../../utils/preetiTranslator';

// ── Shared Helpers ──────────────────────────────────────────────

// Windows-1252 special chars (Unicode codepoint → Win-1252 byte)
// These are stored as Unicode in JS strings but require Alt+00XX in Preeti.
const WIN1252_MAP = {
  0x20AC: 128, 0x201A: 130, 0x0192: 131, 0x201E: 132, 0x2026: 133,
  0x2020: 134, 0x2021: 135, 0x02C6: 136, 0x2030: 137, 0x0160: 138,
  0x2039: 139, 0x0152: 140, 0x017D: 142,
  0x2018: 133, 0x2019: 218, // Left/Right Single Quotes (Preeti: 133, 218)
  0x201C: 230, 0x201D: 198, // Left/Right Double Quotes (Preeti: 230, 198)
  0x2022: 149, 0x2013: 150, 0x2014: 151,
  0x02DC: 152, 0x2122: 153, 0x0161: 154, 0x203A: 155, 0x0153: 156,
  0x017E: 158, 0x0178: 159
};

const splitGraphemes = (text, mode) => {
  if (mode === 'preeti') {
    // Preeti syllable pattern:
    // 1. Explicit Alt-code string (e.g. Alt+0123)
    // 2. Nepali Unicode syllable (Base + Halant/Matras)
    // 3. Preeti ASCII syllable: Optional 'l' (i-matra) + Base Character + Optional Modifiers
    // 4. Any other single character (punctuation, space, etc.)
    const preetiSyllable = /Alt\+\d{4}|[\u0900-\u097F](?:[\u094D][\u0900-\u097F])*[\u094D]?[\u093E-\u094D\u0901-\u0903]*|l?[a-zA-Z0-9\/\?;>`][mf\[\]\}|MF\\{+'"L]*|./g;
    return text.match(preetiSyllable) || [];
  }

  const clusterRegex = /[\u0900-\u097F](?:[\u200C\u200D]?[\u094D][\u200C\u200D]?[\u0900-\u097F])*[\u094D]?[\u200C\u200D]?[\u093E-\u094C\u0901-\u0903\u0951-\u0957\u0962-\u0963]*|./gu;
  const segments = text.split('\u200B');
  const result = [];
  for (const segment of segments) {
    const clusters = segment.match(clusterRegex) || [];
    result.push(...clusters);
  }
  return result.filter(g => g && g !== '\u200B' && g !== '\u200C');
};

const CODE_TO_KEY = {
  'KeyA': 'a', 'KeyB': 'b', 'KeyC': 'c', 'KeyD': 'd', 'KeyE': 'e', 'KeyF': 'f',
  'KeyG': 'g', 'KeyH': 'h', 'KeyI': 'i', 'KeyJ': 'j', 'KeyK': 'k', 'KeyL': 'l',
  'KeyM': 'm', 'KeyN': 'n', 'KeyO': 'o', 'KeyP': 'p', 'KeyQ': 'q', 'KeyR': 'r',
  'KeyS': 's', 'KeyT': 't', 'KeyU': 'u', 'KeyV': 'v', 'KeyW': 'w', 'KeyX': 'x',
  'KeyY': 'y', 'KeyZ': 'z',
  'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
  'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',
  'Minus': '-', 'Equal': '=', 'BracketLeft': '[', 'BracketRight': ']',
  'Backslash': '\\', 'Semicolon': ';', 'Quote': "'", 'Comma': ',',
  'Period': '.', 'Slash': '/', 'Backquote': '`', 'Space': ' '
};

const SYMBOL_TO_PHYSICAL = {
  '<': ',', '>': '.', '?': '/', ':': ';', '"': "'", '{': '[', '}': ']', '|': '\\',
  '_': '-', '+': '=', '~': '`', '!': '1', '@': '2', '#': '3', '$': '4',
  '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0'
};

const parseSequence = (mappingStr) => {
  if (mappingStr.includes('Alt+')) return [mappingStr];

  const parts = mappingStr.split('+');
  const steps = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    if (part.toLowerCase() === 'shift' && i + 1 < parts.length) {
      steps.push(`shift+${parts[i + 1].trim().toLowerCase()}`);
      i++;
    } else if (part.length > 1 && !part.toLowerCase().startsWith('shift')) {
      // Split multi-char strings like 'cf' into individual steps
      steps.push(...part.split('').map(s => s.toLowerCase()));
    } else {
      steps.push(part.toLowerCase());
    }
  }
  return steps;
};

const stepToKeyboardKeys = (step) => {
  if (!step || typeof step !== 'string') return [];
  if (step === '/') return ['/'];
  if (step.startsWith('shift+')) {
    const rawBase = step.replace('shift+', '');
    const physicalKey = SYMBOL_TO_PHYSICAL[rawBase] || rawBase.toUpperCase();
    return ['L_SHIFT', 'R_SHIFT', physicalKey];
  }

  // Auto-detect shifted symbols that don't have explicit 'shift+' prefix
  if (SYMBOL_TO_PHYSICAL[step]) {
    return ['L_SHIFT', 'R_SHIFT', SYMBOL_TO_PHYSICAL[step]];
  }

  return [step.toUpperCase()];
};

const GuidedLesson = ({ level, mode, onComplete, playErrorSound }) => {
  const soundEnabled = useTypingStore(s => s.soundEnabled);
  const [typed, setTyped] = useState([]);
  const activeKeysRef = useRef([]);
  const [activeKeys, setActiveKeys] = useState([]);
  const [errorKeys, setErrorKeys] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [altBufferState, setAltBufferState] = useState("");
  const altBuffer = useRef("");
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const charDataRef = useRef({}); // { 'a': { correct: 0, incorrect: 0 } }
  const inputRef = useRef(null);

  const levelGraphemes = React.useMemo(() => splitGraphemes(level.sequence, mode), [level, mode]);
  const targetChar = levelGraphemes[typed.length];
  const currentRef = mode === 'romanized' || mode === 'unicode' ? UNICODE_FULL_REF : PREETI_FULL_REF;
  // Detect if this is an Alt-code lesson (p30–p40) so findEntry prefers Alt+XXXX entries
  const isAltLevel = mode === 'preeti' && /^p(3[0-9]|40)$/.test(level.id);

  const [sequenceBuffer, setSequenceBuffer] = useState([]);
  const sequenceBufferRef = useRef([]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    setTyped([]);
    setErrors(0);
    setStartTime(null);
    setSequenceBuffer([]);
    sequenceBufferRef.current = [];
    charDataRef.current = {};
  }, [level]);

  const handleFocus = () => { if (inputRef.current) inputRef.current.focus(); };

  const handleKeyDown = (e) => {
    const keyMap = { 'AltLeft': 'ALT', 'AltRight': 'ALT', 'ShiftLeft': 'L_SHIFT', 'ShiftRight': 'R_SHIFT' };
    const keyName = keyMap[e.code] || keyMap[e.key] || e.key.toUpperCase();

    const isNewPress = !activeKeysRef.current.includes(keyName);
    if (isNewPress) {
      activeKeysRef.current = [...activeKeysRef.current, keyName];
      setActiveKeys(activeKeysRef.current);

      // Process modifiers only on new press to avoid repeat-spikes
      if (['Shift', 'Alt', 'Control', 'Meta', 'CapsLock'].includes(e.key)) {
        processInput(e.key, e.code, e.shiftKey, e.altKey);
      }
    }

    if (e.key === 'Alt') {
      altBuffer.current = "";
      setAltBufferState("");
      e.preventDefault();
      return;
    }

    if (e.altKey && /^\d$/.test(e.key)) {
      if (isNewPress) {
        processInput(e.key, e.code, e.shiftKey, e.altKey);
      }
      altBuffer.current += e.key;
      setAltBufferState(altBuffer.current);
      e.preventDefault();
      return;
    }

    processInput(e.key, e.code, e.shiftKey, e.altKey);
    e.preventDefault();
  };

  const handleKeyUp = (e) => {
    const keyMap = { 'AltLeft': 'ALT', 'AltRight': 'ALT', 'ShiftLeft': 'L_SHIFT', 'ShiftRight': 'R_SHIFT' };
    const keyName = keyMap[e.code] || keyMap[e.key] || e.key.toUpperCase();
    activeKeysRef.current = activeKeysRef.current.filter(k => k !== keyName);
    setActiveKeys(activeKeysRef.current);

    if (e.key === 'Alt') {
      if (altBuffer.current.length > 0) {
        processInput(`Alt+${altBuffer.current}`, null, false, true);
      }
      altBuffer.current = "";
      setAltBufferState("");
    }
  };

  const findEntry = (char, preferAlt = false) => {
    if (!char) return null;
    if (char === ' ') return { n: ' ', e: ' ' };
    const allEntries = Object.values(currentRef).flat();

    // 1a. Preeti: Windows-1252 special chars (U+0080–U+009F range stored as Unicode)
    // e.g. ‰ = U+2030 → Win-1252 byte 137 → Alt+0137 (झ्)
    //      ˆ = U+02C6 → Win-1252 byte 136 → Alt+0136 (फ्)
    if (mode === 'preeti' && char.length === 1) {
      const win1252Byte = WIN1252_MAP[char.charCodeAt(0)];
      if (win1252Byte !== undefined) {
        const altCode = `Alt+0${win1252Byte}`;
        const existingAlt = allEntries.find(item => item.e === altCode);
        if (existingAlt) return existingAlt;
        return { n: char, e: altCode }; // Synthetic fallback
      }
    }

    // 1b. Preeti-specific fallback: If lesson text uses ASCII (e.g. 's' for 'क', or '{' for Shift+[)
    if (mode === 'preeti' && char.length === 1 && char.charCodeAt(0) < 256) {
      const isUpper = char >= 'A' && char <= 'Z';
      const shiftMap = {
        '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
        '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=',
        '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/'
      };
      const shiftedFrom = shiftMap[char];

      // If we are NOT explicitly practicing Alt codes, standard keyboard mappings take precedence
      // over any synthetic or Alt-code fallbacks that happen to share the same physical symbol.
      if (!preferAlt) {
        if (isUpper) {
          return { n: char, e: `Shift+${char.toLowerCase()}` };
        } else if (shiftedFrom) {
          return { n: char, e: `Shift+${shiftedFrom}` };
        }
      }

      // Prioritize explicit mapping for this ASCII char if it exists (e.g. p39 Alt codes)
      const explicitMatch = allEntries.find(item =>
        item.n === char && (preferAlt ? item.e.startsWith('Alt+') : !item.e.startsWith('Alt+'))
      );
      if (explicitMatch) return explicitMatch;

      // Look up standard physical keystroke mappings BEFORE falling back to literal target matching
      const asciiMatch = allEntries.find(item => item.e === char);
      if (asciiMatch) return asciiMatch;

      const fallbackMatch = allEntries.find(item => item.n === char);
      if (fallbackMatch) return fallbackMatch;

      if (preferAlt) {
        if (isUpper) {
          return { n: char, e: `Shift+${char.toLowerCase()}` };
        } else if (shiftedFrom) {
          return { n: char, e: `Shift+${shiftedFrom}` };
        }
      }

      // 1c. Final Fallback for ASCII: Synthetic Alt code (Only for non-letters)
      const isLetter = (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');

      if (!isLetter) {
        const altCode = `Alt+0${char.charCodeAt(0)}`;
        const existingAlt = allEntries.find(item => item.e === altCode);
        if (existingAlt) return existingAlt;

        const altMatch = allEntries.find(item => item.n === char && item.e.startsWith('Alt+'));
        if (altMatch) return altMatch;

        return { n: char, e: altCode }; // Synthetic Alt code
      }
    }

    // 2. Try exact Nepali match (prefer non-Alt)
    const exact = allEntries.find(item => item.n.normalize('NFC') === char.normalize('NFC') && !item.e.startsWith('Alt+'));
    if (exact) return exact;

    // 3. Try exact Nepali match (fallback to Alt if no other)
    const exactAlt = allEntries.find(item => item.n.normalize('NFC') === char.normalize('NFC'));
    if (exactAlt) return exactAlt;

    if (preferAlt) {
      // For Alt-code levels, prefer entries whose 'e' field starts with 'Alt+'
      const altEntry = allEntries.find(item =>
        item.n.normalize('NFC') === char.normalize('NFC') && item.e.startsWith('Alt+')
      );
      if (altEntry) return altEntry;
    }

    const chars = char.split('');
    if (chars.length <= 1) return null;
    const sequences = [];
    for (const c of chars) {
      const entry = findEntry(c, preferAlt); // Recursive call for parts
      if (entry) sequences.push(entry.e);
      else return null;
    }
    return { n: char, e: sequences.join('+') };
  };

  const processInput = (key, code, shiftPressed, altPressed) => {
    if (!startTime) setStartTime(Date.now());
    if (['Shift', 'Alt', 'Control', 'Meta', 'CapsLock'].includes(key)) {
      const entry = findEntry(targetChar, isAltLevel);
      if (entry) {
        const required = entry.e.toLowerCase();
        const needsShift = required.includes('shift');
        const needsAlt = required.includes('alt');
        if ((key === 'Shift' && !needsShift) || (key === 'Alt' && !needsAlt)) {
          setErrors(prev => prev + 1);
          playErrorSound();
          setErrorKeys([...activeKeysRef.current]);
          setHasError(true);
          setTimeout(() => { setErrorKeys([]); setHasError(false); }, 300);
        }
      }
      return;
    }
    if (soundEnabled) playTypewriterClick(key === ' ');

    let isCorrect = false;
    let isValidPrefix = false;
    const entry = findEntry(targetChar, isAltLevel);

    // Strict Space-Bar Lock: If target is not a space, reject space key immediately
    const isTargetSpace = targetChar === ' ' || targetChar.charCodeAt(0) === 160 || targetChar.charCodeAt(0) === 32;
    if (key === ' ' && !isTargetSpace) {
      isCorrect = false; // Force error
    } else if (isTargetSpace && key === ' ') {
      isCorrect = true;
    } else if (entry) {
      const expected = entry.e;
      if (expected.includes('Alt+')) {
        if (key.startsWith('Alt+')) {
          isCorrect = key === expected;
        } else if (/^\d$/.test(key) && altPressed) {
          const targetCode = expected.split('+')[1];
          const fullBuf = altBuffer.current;
          isValidPrefix = targetCode.startsWith(fullBuf);
          if (fullBuf === targetCode) {
            isCorrect = true;
          } else if (isValidPrefix) {
            return; // Wait for more digits
          }
        }
      } else {
        const requiredSequence = parseSequence(expected);
        const physicalKey = CODE_TO_KEY[code] || key.toLowerCase();
        const currentStep = shiftPressed ? `shift+${physicalKey}` : physicalKey;
        const currentBuffer = sequenceBufferRef.current;
        const newBuffer = [...currentBuffer, currentStep];

        const stepsMatch = (t, req) => {
          if (t === req) return true;

          const getPhysical = (step) => {
            const isShift = step.startsWith('shift+');
            const base = isShift ? step.replace('shift+', '') : step;
            return { physical: SYMBOL_TO_PHYSICAL[base] || base, isShift };
          };

          const tInfo = getPhysical(t);
          const reqInfo = getPhysical(req);

          if (tInfo.physical === reqInfo.physical && tInfo.isShift === reqInfo.isShift) return true;

          // Legacy fallbacks
          if ((req === '/' || req === '?') && (t === '/' || t === 'shift+/')) return true;
          return false;
        };

        if (newBuffer.length === requiredSequence.length) {
          isCorrect = newBuffer.every((t, i) => stepsMatch(t, requiredSequence[i]));
        } else if (newBuffer.length < requiredSequence.length) {
          isValidPrefix = newBuffer.every((t, i) => stepsMatch(t, requiredSequence[i]));
        }

        if (isValidPrefix) {
          sequenceBufferRef.current = newBuffer;
          setSequenceBuffer(newBuffer);
          return;
        }
      }
    } else if (mode === 'english') {
      isCorrect = key === targetChar;
    }

    if (isCorrect) {
      sequenceBufferRef.current = [];
      setSequenceBuffer([]);
      const newTyped = [...typed, targetChar];
      setTyped(newTyped);
      altBuffer.current = "";
      setAltBufferState("");

      // Track correct key
      if (!charDataRef.current[targetChar]) charDataRef.current[targetChar] = { correct: 0, incorrect: 0 };
      charDataRef.current[targetChar].correct++;

      if (newTyped.length === levelGraphemes.length) {
        const durationMin = (Date.now() - startTime) / 60000;
        onComplete({
          wpm: Math.round((newTyped.length / 5) / durationMin),
          accuracy: Math.round(((newTyped.length - errors) / newTyped.length) * 100),
          stars: Math.round(((newTyped.length - errors) / newTyped.length) * 100) >= 95 ? 3 : 1,
          charData: charDataRef.current
        });
      }

    } else {
      sequenceBufferRef.current = [];
      setSequenceBuffer([]);
      altBuffer.current = "";
      setAltBufferState("");
      setErrors(prev => prev + 1);

      // Track incorrect key
      if (targetChar) {
        if (!charDataRef.current[targetChar]) charDataRef.current[targetChar] = { correct: 0, incorrect: 0 };
        charDataRef.current[targetChar].incorrect++;
      }

      playErrorSound();

      const keyMap = { 'Backspace': 'BS', 'Enter': 'ENT', 'Shift': 'SHIFT', ' ': 'SPACE', 'Alt': 'ALT' };
      setErrorKeys([...activeKeysRef.current]);
      setHasError(true);
      setTimeout(() => { setErrorKeys([]); setHasError(false); }, 300);
    }
  };

  const getTargetKeys = () => {
    if (!targetChar) return [];
    // Handle all space-like characters (Normal space, Non-breaking space, etc.)
    if (targetChar === ' ' || targetChar.charCodeAt(0) === 160 || targetChar.charCodeAt(0) === 32) {
      return ['SPACE'];
    }

    if (mode === 'english') {
      const char = targetChar.toUpperCase();
      const needsShift = targetChar !== targetChar.toLowerCase() && !/[0-9]/.test(targetChar);
      return needsShift ? ['L_SHIFT', 'R_SHIFT', char] : [char];
    }

    const entry = findEntry(targetChar, isAltLevel);
    if (!entry) return [];

    const expected = entry.e;

    // Progressive Alt-Code Guidance
    if (expected.includes('Alt+')) {
      const codePart = expected.split('+')[1]; // e.g., "0170"
      const currentBuffer = altBufferState;

      const nextKeys = ['ALT'];
      if (currentBuffer.length < codePart.length) {
        nextKeys.push(codePart[currentBuffer.length]);
      }
      return nextKeys;
    }

    const requiredSequence = parseSequence(expected);
    const nextIdx = sequenceBuffer.length;

    if (nextIdx < requiredSequence.length) {
      return stepToKeyboardKeys(requiredSequence[nextIdx]);
    }
    return [];
  };

  const targetKeys = getTargetKeys();

  const renderSmartHint = (hint) => {
    return <span className="font-mono text-[0.9em] font-medium">{hint}</span>;
  };

  const renderDisplayChar = (char) => {
    if (mode === 'unicode' || mode === 'romanized') {
      if (char.endsWith('\u094D')) {
        return char + '\u200D';
      }
    }
    if (mode !== 'preeti') return char;
    // We must translate Nepali Unicode characters AND specific logical punctuation marks that have distinct physical mappings in Preeti
    const needsTranslation = /[\u0900-\u097F]/.test(char) || "{}^‘’“”".includes(char);
    const translated = needsTranslation ? unicodeToPreeti(char) : char;
    if (translated.includes('\x98') || translated.includes('\u093D')) {
      const characters = translated.split('');
      return (
        <span className="keyboard-preeti">
          {characters.map((c, idx) => (
            <span key={idx} className={c === '\x98' || c === '\u093D' ? 'font-sans font-bold text-[0.9em]' : 'keyboard-preeti'}>
              {c === '\x98' ? '\u093D' : c}
            </span>
          ))}
        </span>
      );
    }
    return <span className="keyboard-preeti">{translated}</span>;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl" onClick={handleFocus}>
      <div className={`w-full mb-8 relative py-6 ${mode === 'preeti' ? 'keyboard-preeti' : ''}`}>
        <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl" />
        <div className="relative z-10 flex flex-col items-center">
          <div className={`flex flex-wrap justify-center items-center gap-6 mb-4 ${(mode === 'unicode' || mode === 'english') ? 'text-xl' : 'text-3xl'} font-medium tracking-tight min-h-[64px]`}>
            {(() => {
              const rawWords = level.sequence.split(' ');
              const words = rawWords.map((w, idx) => {
                const isLast = idx === rawWords.length - 1;
                const graphemes = splitGraphemes(w, mode);
                if (!isLast) graphemes.push(' ');
                return graphemes;
              });
              let currentGraphemeCounter = 0;
              let activeWordIdx = 0;
              let tempCounter = 0;
              for (let i = 0; i < words.length; i++) {
                const wLen = words[i].length;
                if (typed.length >= tempCounter && typed.length < tempCounter + wLen) { activeWordIdx = i; break; }
                tempCounter += wLen;
              }
              return words.map((wordGraphemes, wIdx) => {
                const wordStartIndex = currentGraphemeCounter;
                currentGraphemeCounter += wordGraphemes.length;
                if (wIdx < activeWordIdx || wIdx > activeWordIdx + 1) return null;
                const isActiveWord = wIdx === activeWordIdx;
                return (
                  <div key={wIdx} className={`flex gap-0 items-end transition-all duration-300 ${isActiveWord ? 'scale-100 opacity-100' : 'scale-95 opacity-30 blur-[0.5px]'}`}>
                    {wordGraphemes.map((char, cIdx) => {
                      const globalIndex = wordStartIndex + cIdx;
                      let status = 'pending';
                      if (globalIndex < typed.length) status = 'correct';
                      else if (globalIndex === typed.length) status = 'active';

                      const charEntry = status === 'active' ? findEntry(char, isAltLevel) : null;
                      const charExpected = charEntry?.e || '';

                      return (
                        <span
                          key={globalIndex}
                          className={`relative flex items-center justify-center transition-all duration-200 border-b-2 pb-1 
                            ${status === 'correct' ? 'text-correct border-correct' : (status === 'active' && hasError) ? 'text-error border-error scale-110 animate-shake bg-error/5' : status === 'active' ? 'text-primary border-primary scale-110 font-bold after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[3px] after:bg-primary after:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'text-on-background/20 border-transparent'} 
                            ${char === ' ' ? 'w-8 px-2' : 'px-1'}`}
                          style={{ minWidth: char === ' ' ? '1rem' : '1.2em' }}
                        >
                          {char === ' ' && status === 'active' ? '␣' : renderDisplayChar(char)}
                          {status === 'active' && (altBufferState || charExpected.includes('Alt+') || sequenceBuffer.length > 0 || (charExpected.length > 1 && !charExpected.includes('Alt+'))) && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-0.5 bg-primary/10 rounded text-[10px] font-mono text-primary whitespace-nowrap border border-primary/20 z-30 shadow-lg backdrop-blur-sm">
                              {renderSmartHint(altBufferState ? `Alt + ${altBufferState}` : (charExpected.includes('Alt+') ? charExpected : (sequenceBuffer.length > 0 ? sequenceBuffer.join(' ') : charExpected)))}
                            </div>
                          )}
                        </span>
                      );
                    })}
                  </div>
                );
              });
            })()}
          </div>
          <div className="flex gap-8 text-on-background/50 font-mono text-[10px] uppercase tracking-widest">
            <span>Accuracy: {typed.length > 0 ? Math.round(((typed.length - errors) / typed.length) * 100) : 100}%</span>
            <span>Progress: {typed.length} / {levelGraphemes.length}</span>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-6">
        <PracticeKeyboard activeKeys={activeKeys} targetKeys={targetKeys} mode={mode} />
        <FingerGuide activeFingers={targetKeys.map(k => KEY_TO_FINGER[k]).filter(Boolean)} />
      </div>
      <input ref={inputRef} type="text" value="" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} className="fixed opacity-0 pointer-events-none" />
    </div>
  );
};

export default GuidedLesson;
