import { useState, useEffect, useRef, useCallback } from "react";
import { romanToUnicode } from "../utils/romanizedMap";
import { splitGraphemes } from "../utils/graphemeUtils";

export function useTypingEngine({ words, mode, duration, language, socket, roomId }) {
  const [typedHistory, setTypedHistory] = useState([]);   
  const [currentInput, setCurrentInput] = useState("");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [charStates, setCharStates] = useState([]);       
  const [status, setStatus] = useState("idle");           
  const [timeLeft, setTimeLeft] = useState(duration);
  const [wpmHistory, setWpmHistory] = useState([]);       
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);
  const correctCharsRef = useRef(0);
  const charDataRef = useRef({}); // { 'a': { correct: 0, incorrect: 0 } }

  const startTest = useCallback(() => {
    if (status !== "idle") return;
    setStatus("running");
    setStartTime(Date.now());
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setStatus("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [status]);

  useEffect(() => {
    if (status === "running" && startTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 60000;
        if (elapsed > 0) {
          const liveWpm = Math.round(correctCharsRef.current / 5 / elapsed);
          setWpmHistory(h => [...h, liveWpm]);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  const handleInput = useCallback((e) => {
    const raw = e.target.value;
    if (status === "idle") startTest();
    if (status === "finished") return;

    let value = raw;
    if (language === "romanized" || language === "unicode") {
      value = romanToUnicode(raw);
    }

    const currentGraphemes = splitGraphemes(value, language);
    const target = words[currentWordIdx] || "";
    const targetGraphemes = splitGraphemes(target, language);

    if (raw.endsWith(" ")) {
      const typed = value.trim();
      const typedGraphemes = splitGraphemes(typed, language);
      
      for (let i = 0; i < Math.max(typedGraphemes.length, targetGraphemes.length); i++) {
        const tChar = targetGraphemes[i];
        const pChar = typedGraphemes[i];

        if (tChar) {
          if (!charDataRef.current[tChar]) charDataRef.current[tChar] = { correct: 0, incorrect: 0 };
          if (pChar === tChar) {
            charDataRef.current[tChar].correct++;
            correctCharsRef.current += tChar.length;
          } else {
            charDataRef.current[tChar].incorrect++;
          }
        }
      }
      
      setTypedHistory(h => [...h, typed]);
      setCurrentInput("");
      const nextIdx = currentWordIdx + 1;
      setCurrentWordIdx(nextIdx);

      // Multiplayer update
      if (socket && roomId) {
        const elapsed = (Date.now() - startTime) / 60000;
        const liveWpm = Math.round(correctCharsRef.current / 5 / elapsed) || 0;
        const progress = Math.min(100, Math.round((nextIdx / words.length) * 100));
        socket.emit('update_progress', { roomId, progress, wpm: liveWpm });
      }

      if (nextIdx >= words.length) {
        clearInterval(timerRef.current);
        setStatus("finished");
      }
      return;
    }

    setCurrentInput(value);

    const states = targetGraphemes.map((ch, i) => {
      if (i >= currentGraphemes.length) return "pending";
      return currentGraphemes[i] === ch ? "correct" : "incorrect";
    });
    setCharStates(states);
  }, [status, language, words, currentWordIdx, startTest]);

  const getResult = useCallback(() => {
    const elapsed = (Date.now() - (startTime || Date.now())) / 60000;
    const wpm = Math.round(correctCharsRef.current / 5 / (elapsed || 1/60));
    
    const totalCharsTyped = typedHistory.join(' ').length + currentInput.length;
    const rawWpm = Math.round(totalCharsTyped / 5 / (elapsed || 1/60));
    
    const correctTyped = correctCharsRef.current;
    const accuracy = totalCharsTyped > 0 ? Math.min(100, Math.round((correctTyped / totalCharsTyped) * 100)) : 0;
    
    let consistency = 0;
    if (wpmHistory.length > 2) {
      const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
      const variance = wpmHistory.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpmHistory.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev / (mean || 1)) * 100)));
    }

    const characters = {
      correct: correctTyped,
      incorrect: Math.max(0, totalCharsTyped - correctTyped),
      extra: 0,
      missed: 0 
    };
    
    return {
      wpm,
      rawWpm,
      accuracy,
      consistency,
      characters,
      language,
      mode,
      duration,
      timestamp: new Date().toISOString(),
      wpmHistory,
      charData: charDataRef.current,
    };
  }, [startTime, typedHistory, language, mode, duration, wpmHistory, currentInput]);

  const restart = useCallback(() => {
    clearInterval(timerRef.current);
    setTypedHistory([]);
    setCurrentInput("");
    setCurrentWordIdx(0);
    setCharStates([]);
    setStatus("idle");
    setTimeLeft(duration);
    setWpmHistory([]);
    setStartTime(null);
    correctCharsRef.current = 0;
    charDataRef.current = {};
  }, [duration]);

  return {
    currentInput, handleInput, currentWordIdx,
    charStates, status, timeLeft,
    typedHistory, getResult, restart, setCurrentInput,
    startTime, isFinished: status === 'finished'
  };
}
