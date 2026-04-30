import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { usePreetiInput } from '../hooks/usePreetiInput';
import { useTypingStore } from '../store/useTypingStore';
import { playTypewriterClick, playTypewriterDing } from '../utils/sound';
import { splitGraphemes } from '../utils/graphemeUtils';
import Caret from './Caret';
import VirtualKeyboard from './practice/VirtualKeyboard';

const TypingBox = ({ words, mode, duration, language, onFinish, pbWpm = 0, socket, roomId }) => {
  const {
    currentInput,
    handleInput,
    currentWordIdx,
    charStates,
    status,
    timeLeft,
    getResult,
    restart,
    setCurrentInput, 
    typedHistory,
    startTime,
    isFinished
  } = useTypingEngine({ words, mode, duration, language, socket, roomId });

  const [ghostIdx, setGhostIdx] = React.useState(0);
  
  // Ghost logic - reduced update frequency
  useEffect(() => {
    if (!startTime || !pbWpm || isFinished) {
      setGhostIdx(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const ghostProgress = pbWpm * 5 * elapsedMinutes;
      const totalChars = words.join(' ').length;
      const wordProgress = (ghostProgress / totalChars) * words.length;
      
      setGhostIdx(Math.min(words.length, wordProgress));
    }, 500); // Reduced from 100ms to 500ms

    return () => clearInterval(interval);
  }, [startTime, pbWpm, words, isFinished]);

  const soundEnabled = useTypingStore(s => s.soundEnabled);
  const caretStyle = useTypingStore(s => s.caretStyle) ?? 'line';
  const fontSize = useTypingStore(s => s.fontSize) ?? 'text-3xl';
  const showKeyboard = useTypingStore(s => s.showKeyboard) ?? false;
  const inputRef = useRef(null);
  const wordsContainerRef = useRef(null);
  const activeWordRef = useRef(null);

  useEffect(() => {
    if (soundEnabled && currentInput.length > 0) {
      const isSpace = currentInput[currentInput.length - 1] === ' ';
      playTypewriterClick(isSpace);
    }
  }, [currentInput, soundEnabled]);

  useEffect(() => {
    if (soundEnabled && currentWordIdx > 0) {
      playTypewriterClick(true);
    }
  }, [currentWordIdx, soundEnabled]);

  const handleCharInsert = useCallback((char) => {
    if (status === 'finished') return;
    // Simulate input change
    const newValue = currentInput + char;
    const event = { target: { value: newValue } };
    handleInput(event);
  }, [currentInput, handleInput, status]);

  usePreetiInput(handleCharInsert);

  useEffect(() => {
    if (activeWordRef.current && wordsContainerRef.current) {
      const activeRect = activeWordRef.current.getBoundingClientRect();
      const containerRect = wordsContainerRef.current.getBoundingClientRect();
      const relativeTop = activeRect.top - containerRect.top;
      if (relativeTop > 100) {
        wordsContainerRef.current.scrollTop += 50;
        if (soundEnabled) {
          playTypewriterDing();
        }
      }
    }
  }, [currentWordIdx, soundEnabled]);

  useEffect(() => {
    if (status === 'finished') {
      onFinish(getResult());
    }
  }, [status, getResult, onFinish]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const memoizedWords = useMemo(() => {
    return words.map(word => splitGraphemes(word, language));
  }, [words, language]);

  // Only render visible words (windowing)
  const visibleRange = useMemo(() => {
    const start = Math.max(0, currentWordIdx - 20);
    const end = Math.min(words.length, currentWordIdx + 80);
    return { start, end };
  }, [currentWordIdx, words.length]);

  return (
    <div className="w-full max-w-5xl mx-auto" onClick={focusInput}>
      <div className="flex justify-between items-center mb-8 font-mono text-on-background/50">
        <div className="text-2xl font-bold text-primary">
          {timeLeft}s
        </div>
        <div className="flex-1 mx-12 h-[2px] bg-outline/10 relative overflow-hidden">
          {/* Ghost Progress */}
          {pbWpm > 0 && (
            <div 
              className="absolute left-0 top-0 h-full bg-primary/20 transition-all duration-500 ease-linear" 
              style={{ width: `${(ghostIdx / words.length) * 100}%` }}
            />
          )}
          {/* User Progress */}
          <div 
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-300" 
            style={{ width: `${(currentWordIdx / words.length) * 100}%` }}
          />
        </div>
        <div className="text-sm uppercase tracking-widest">
          {currentWordIdx}/{words.length} · {language}
        </div>
      </div>

      <div className={`relative ${fontSize} leading-relaxed ${language === 'preeti' ? 'tracking-normal' : 'tracking-wide'} select-none h-[320px] overflow-hidden typing-container-${language}`}>
        {/* Words area */}
        <div 
          ref={wordsContainerRef}
          className="flex flex-wrap gap-x-4 scroll-smooth transition-all duration-300"
          style={{ maxHeight: '100%', overflowY: 'scroll', scrollbarWidth: 'none' }}
        >
          {words.slice(visibleRange.start, visibleRange.end).map((word, relIdx) => {
            const wIdx = visibleRange.start + relIdx;
            const isCurrent = wIdx === currentWordIdx;
            const isPast = wIdx < currentWordIdx;
            
            const wordGraphemes = memoizedWords[wIdx];
            const typedGraphemes = typedHistory[wIdx] ? splitGraphemes(typedHistory[wIdx], language) : [];
            const currentGraphemes = splitGraphemes(currentInput, language);

            return (
              <span 
                key={wIdx} 
                ref={isCurrent ? activeWordRef : null}
                className={`relative flex items-center transition-colors duration-200 ${isCurrent ? 'text-on-background' : 'text-on-background/30'}`}
              >
                {wordGraphemes.map((char, cIdx) => {
                  let stateClass = 'text-on-background/30';
                  
                  if (isPast) {
                    if (typedGraphemes[cIdx] !== undefined) {
                      stateClass = typedGraphemes[cIdx] === char ? 'text-correct' : 'text-error';
                    } else {
                      stateClass = 'text-error';
                    }
                  } else if (isCurrent) {
                    if (cIdx < currentGraphemes.length) {
                      stateClass = charStates[cIdx] === 'correct' ? 'text-correct' : 'text-error';
                    } else {
                      stateClass = 'text-on-background/40';
                    }
                  }

                  return (
                    <span key={cIdx} className={`relative transition-colors ${stateClass}`}>
                      {isCurrent && cIdx === currentGraphemes.length && <Caret />}
                      {char}
                    </span>
                  );
                })}
                
                {/* Extra characters */}
                {(isPast || isCurrent) && (isPast ? typedGraphemes : currentGraphemes).length > wordGraphemes.length && (
                  <span className="text-error opacity-70 flex">
                    {(isPast ? typedGraphemes : currentGraphemes).slice(wordGraphemes.length).map((char, i) => (
                      <span key={i} className="relative">
                        {isCurrent && (i + wordGraphemes.length) === currentGraphemes.length && <Caret />}
                        {char}
                      </span>
                    ))}
                  </span>
                )}
                
                {/* Caret at the very end of the word */}
                {isCurrent && currentGraphemes.length === wordGraphemes.length && (
                  <span className="relative w-0 h-full">
                    <Caret />
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          className="absolute inset-0 w-full h-full opacity-0 cursor-default"
          value={currentInput}
          onChange={handleInput}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>

      <div className={`mt-8 text-center text-on-background/50 font-mono text-sm transition-opacity duration-300 ${status === 'idle' ? 'animate-pulse opacity-100' : 'opacity-0 pointer-events-none'}`}>
        Type to start...
      </div>

      {showKeyboard && (
        <div className="mt-8 transform scale-90 origin-top opacity-50 hover:opacity-100 transition-opacity">
          <VirtualKeyboard 
            mode={language} 
            nextChar={language === 'preeti' 
              ? (words[currentWordIdx]?.[currentInput.length] || ' ')
              : (words[currentWordIdx] ? (splitGraphemes(words[currentWordIdx], language)[splitGraphemes(currentInput, language).length] || ' ') : null)
            } 
          />
        </div>
      )}
    </div>
  );
};

export default TypingBox;
