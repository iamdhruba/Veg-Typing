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

  useEffect(() => {
    if (!startTime || !pbWpm || isFinished) { setGhostIdx(0); return; }
    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const ghostProgress = pbWpm * 5 * elapsedMinutes;
      const totalChars = words.join(' ').length;
      setGhostIdx(Math.min(words.length, (ghostProgress / totalChars) * words.length));
    }, 500);
    return () => clearInterval(interval);
  }, [startTime, pbWpm, words, isFinished]);

  const soundEnabled = useTypingStore(s => s.soundEnabled);
  const fontSize = useTypingStore(s => s.fontSize) ?? 'text-3xl';
  const showKeyboard = useTypingStore(s => s.showKeyboard) ?? false;
  const inputRef = useRef(null);
  const measureContainerRef = useRef(null);

  useEffect(() => {
    if (soundEnabled && currentInput.length > 0)
      playTypewriterClick(currentInput[currentInput.length - 1] === ' ');
  }, [currentInput, soundEnabled]);

  useEffect(() => {
    if (soundEnabled && currentWordIdx > 0) playTypewriterClick(true);
  }, [currentWordIdx, soundEnabled]);

  const handleCharInsert = useCallback((char) => {
    if (status === 'finished') return;
    handleInput({ target: { value: currentInput + char } });
  }, [currentInput, handleInput, status]);

  usePreetiInput(handleCharInsert);

  const memoizedWords = useMemo(() => words.map(w => splitGraphemes(w, language)), [words, language]);

  // Lines: array of arrays of word indices, computed once from real browser layout
  const [lines, setLines] = React.useState([]);
  const [currentLine, setCurrentLine] = React.useState(0);

  // Measure lines using a hidden flex-wrap container
  useEffect(() => {
    setLines([]);
    setCurrentLine(0);
    // Wait for measureContainerRef to render with the words
    const id = requestAnimationFrame(() => {
      if (!measureContainerRef.current) return;
      const spans = measureContainerRef.current.children;
      if (!spans.length) return;
      const computed = [];
      let row = [];
      let lastTop = spans[0].offsetTop;
      for (let i = 0; i < spans.length; i++) {
        const top = spans[i].offsetTop;
        if (top !== lastTop) {
          computed.push(row);
          row = [];
          lastTop = top;
        }
        row.push(i);
      }
      if (row.length) computed.push(row);
      setLines(computed);
    });
    return () => cancelAnimationFrame(id);
  }, [words]);

  // Advance line when active word crosses into next line
  useEffect(() => {
    if (!lines.length) return;
    const lineIdx = lines.findIndex(l => l.includes(currentWordIdx));
    if (lineIdx > currentLine) {
      setCurrentLine(lineIdx);
      if (soundEnabled) playTypewriterDing();
    }
  }, [currentWordIdx, lines, soundEnabled]);

  useEffect(() => {
    if (status === 'finished') onFinish(getResult());
  }, [status, getResult, onFinish]);

  const lineHeight = 3; // rem per row
  const visibleRows = 3;

  const renderWord = (wIdx) => {
    const isCurrent = wIdx === currentWordIdx;
    const isPast = wIdx < currentWordIdx;
    const wordGraphemes = memoizedWords[wIdx];
    const typedGraphemes = typedHistory[wIdx] ? splitGraphemes(typedHistory[wIdx], language) : [];
    const currentGraphemes = splitGraphemes(currentInput, language);

    return (
      <span
        key={wIdx}
        className={`relative inline-flex items-center mr-4 transition-colors duration-200 ${isCurrent ? 'text-on-background' : 'text-on-background/30'}`}
      >
        {wordGraphemes.map((char, cIdx) => {
          let stateClass = 'text-on-background/30';
          if (isPast) {
            stateClass = typedGraphemes[cIdx] !== undefined
              ? (typedGraphemes[cIdx] === char ? 'text-correct' : 'text-error')
              : 'text-error';
          } else if (isCurrent) {
            stateClass = cIdx < currentGraphemes.length
              ? (charStates[cIdx] === 'correct' ? 'text-correct' : 'text-error')
              : 'text-on-background/40';
          }
          return (
            <span key={cIdx} className={`relative transition-colors ${stateClass}`}>
              {isCurrent && cIdx === currentGraphemes.length && <Caret />}
              {char}
            </span>
          );
        })}
        {(isPast || isCurrent) && (isPast ? typedGraphemes : currentGraphemes).length > wordGraphemes.length && (
          <span className="text-error opacity-70 inline-flex">
            {(isPast ? typedGraphemes : currentGraphemes).slice(wordGraphemes.length).map((char, i) => (
              <span key={i} className="relative">
                {isCurrent && (i + wordGraphemes.length) === currentGraphemes.length && <Caret />}
                {char}
              </span>
            ))}
          </span>
        )}
        {isCurrent && currentGraphemes.length === wordGraphemes.length && (
          <span className="relative w-0 h-full"><Caret /></span>
        )}
      </span>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto" onClick={() => inputRef.current?.focus()}>
      <div className="flex justify-between items-center mb-8 font-mono text-on-background/50">
        <div className="text-2xl font-bold text-primary">{timeLeft}s</div>
        <div className="flex-1 mx-12 h-[2px] bg-outline/10 relative overflow-hidden">
          {pbWpm > 0 && (
            <div className="absolute left-0 top-0 h-full bg-primary/20 transition-all duration-500 ease-linear"
              style={{ width: `${(ghostIdx / words.length) * 100}%` }} />
          )}
          <div className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentWordIdx / words.length) * 100}%` }} />
        </div>
        <div className="text-sm uppercase tracking-widest">{currentWordIdx}/{words.length} · {language}</div>
      </div>

      <div className={`relative ${fontSize} ${language === 'preeti' ? 'tracking-normal' : 'tracking-wide'} select-none overflow-hidden typing-container-${language}`}
        style={{ height: `${visibleRows * lineHeight}rem` }}>

        {/* Hidden measurement container — flex-wrap, invisible, used only to detect line breaks */}
        <div
          ref={measureContainerRef}
          className="flex flex-wrap absolute invisible pointer-events-none w-full"
          style={{ lineHeight: `${lineHeight}rem` }}
          aria-hidden="true"
        >
          {words.map((word, i) => (
            <span key={i} className="mr-4 whitespace-nowrap">{word}</span>
          ))}
        </div>

        {/* Visible lines — each line is a fixed nowrap row, slides up via translateY */}
        <div
          style={{
            transform: `translateY(-${currentLine * lineHeight}rem)`,
            transition: 'transform 0.2s ease'
          }}
        >
          {lines.map((lineWordIdxs, lIdx) => (
            <div
              key={lIdx}
              className="flex items-center whitespace-nowrap"
              style={{ height: `${lineHeight}rem` }}
            >
              {lineWordIdxs.map(wIdx => renderWord(wIdx))}
            </div>
          ))}
        </div>

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
