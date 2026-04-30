import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuthStore } from '../store/useAuthStore';
import { useTypingStore } from '../store/useTypingStore';
import SEO from '../components/SEO';
import Caret from '../components/Caret';

const COLORS = [
  'bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500',
  'bg-cyan-500', 'bg-pink-500', 'bg-lime-500',
];

const Race = () => {
  const socket = useSocket();
  const user = useAuthStore(s => s.user);
  const fontSize = useTypingStore(s => s.fontSize) ?? 'text-3xl';
  const globalLanguage = useTypingStore(s => s.language);
  const [raceLanguage, setRaceLanguage] = useState(globalLanguage);

  useEffect(() => {
    if (phase === 'idle') {
      setRaceLanguage(globalLanguage);
    }
  }, [globalLanguage]);

  const [phase, setPhase] = useState('idle');       // idle | lobby | starting | racing | finished
  const [players, setPlayers] = useState({});
  const [needed, setNeeded] = useState(5);
  const [countdown, setCountdown] = useState(null);
  const [raceText, setRaceText] = useState('');
  const [typedChars, setTypedChars] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [myWpm, setMyWpm] = useState(0);
  const [roomId, setRoomId] = useState(`global_${raceLanguage}`);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.emit('leave_race');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (phase === 'idle') setRoomId(`global_${raceLanguage}`);
  }, [raceLanguage, phase]);

  const inputRef = useRef(null);
  const wpmInterval = useRef(null);

  // --- Socket listeners ---
  useEffect(() => {
    if (!socket || !user) return;

    socket.on('lobby_update', ({ players: p, status, needed: n }) => {
      setPlayers(p);
      setNeeded(n);
      if (status === 'waiting') setPhase('lobby');
    });

    socket.on('race_starting', ({ text, countdown: c }) => {
      setRaceText(text);
      setCountdown(c);
      setPhase('starting');
    });

    socket.on('race_countdown', ({ countdown: c }) => {
      setCountdown(c);
    });

    socket.on('race_go', ({ text }) => {
      setRaceText(text);
      setPhase('racing');
      setCountdown(null);
      setTypedChars(0);
      setInputValue('');
      setStartTime(Date.now());
      setTimeout(() => inputRef.current?.focus(), 50);
    });

    socket.on('race_update', ({ players: p }) => {
      setPlayers(p);
    });

    socket.on('race_finished', ({ players: p }) => {
      setPlayers(p);
      setPhase('finished');
    });

    socket.on('race_busy', () => {
      alert('A race is currently in progress. Try again in a few seconds.');
      setPhase('idle');
    });

    return () => {
      socket.off('lobby_update');
      socket.off('race_starting');
      socket.off('race_countdown');
      socket.off('race_go');
      socket.off('race_update');
      socket.off('race_finished');
      socket.off('race_busy');
    };
  }, [socket, user]);

  // --- Live WPM ticker ---
  useEffect(() => {
    if (phase === 'racing' && startTime) {
      wpmInterval.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 60000;
        if (elapsed > 0) {
          const wpm = Math.round((typedChars / 5) / elapsed);
          setMyWpm(wpm);
        }
      }, 300);
      return () => clearInterval(wpmInterval.current);
    }
  }, [phase, startTime, typedChars]);

  // --- Typing handler ---
  const handleTyping = useCallback((e) => {
    if (phase !== 'racing') return;
    const val = e.target.value;
    const textChars = raceText.split('');

    // Check each character typed so far
    let correctCount = 0;
    for (let i = 0; i < val.length && i < textChars.length; i++) {
      if (val[i] === textChars[i]) correctCount++;
      else break; // stop at first error
    }

    setInputValue(val);
    setTypedChars(correctCount);

    const progress = Math.min(100, Math.round((correctCount / textChars.length) * 100));
    const elapsed = (Date.now() - startTime) / 60000;
    const wpm = elapsed > 0 ? Math.round((correctCount / 5) / elapsed) : 0;

    if (socket) {
      socket.emit('update_progress', { roomId, progress, wpm });
    }

    // Finished!
    if (correctCount >= textChars.length) {
      clearInterval(wpmInterval.current);
      setMyWpm(wpm);
    }
  }, [phase, raceText, startTime, socket, roomId]);

  const handleJoinRace = (isPriv = false) => {
    if (!socket) return;
    const isPrivate = typeof isPriv === 'boolean' ? isPriv : false;
    socket.emit('join_race', { roomId, username: user.username, isPrivate, language: raceLanguage });
    setPhase('lobby');
  };

  // --- Helpers ---
  const playerList = Object.entries(players);
  const getPosition = (pos) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return `#${pos}`;
  };

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16 min-h-[80vh]">
      <SEO
        title="Multiplayer Typing Arena — Live Nepali Typing Race | VEG"
        description="Race against other typists in real-time! Enter the multiplayer arena, compete in live typing tests, and see who has the fastest Nepali typing speed."
        path="/race"
        keywords="typing race, multiplayer typing test, real-time typing competition"
      />

      {/* Auth guard */}
      {!user ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="w-16 h-16 border-2 border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-primary/40">lock</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-on-background/20">Authentication Required</h2>
          <p className="text-xs font-bold text-on-background/40 uppercase tracking-widest">Log in to enter the arena.</p>
          <a href="/login" className="px-12 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-xl hover:shadow-primary/20 transition-all">
            Login
          </a>
        </div>
      ) : (
      <>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0 mb-8 sm:mb-12">
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-1">Multiplayer</p>
          <h1 className="text-5xl font-black uppercase tracking-tighter text-on-background">Typing Arena</h1>
        </div>
        <div className="flex gap-3 text-right">
          <div className="bg-surface-container px-6 py-3 border border-outline/10">
            <p className="text-[8px] font-bold text-on-background/30 uppercase tracking-widest">Room</p>
            <p className="text-sm font-black text-on-background">{roomId.toUpperCase()}</p>
          </div>
          <div className="bg-surface-container px-6 py-3 border border-outline/10">
            <p className="text-[8px] font-bold text-on-background/30 uppercase tracking-widest">Players</p>
            <p className="text-sm font-black text-primary">{playerList.length}/5</p>
          </div>
        </div>
      </div>

      {/* ===================== IDLE ===================== */}
      {phase === 'idle' && (
        <div className="flex flex-col items-center justify-center py-32 gap-10">
          <div className="w-24 h-24 bg-primary/5 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary/60">sprint</span>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-on-background/80 mb-2">Ready to Race?</h2>
            <p className="text-xs text-on-background/40 font-bold uppercase tracking-widest mb-8">Compete against 4 other typists in real-time</p>
            
            {/* Language Selection */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 bg-surface-container/10 p-2 border border-outline/5 max-w-lg mx-auto">
              {['english', 'preeti', 'unicode'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setRaceLanguage(lang)}
                  className={`px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${raceLanguage === lang ? 'bg-primary text-white scale-105 shadow-xl shadow-primary/20' : 'text-on-background/50 hover:text-on-background/80 bg-surface-container/50'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleJoinRace}
            className="px-16 py-5 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Enter Race
          </button>
        </div>
      )}

      {/* ===================== LOBBY ===================== */}
      {phase === 'lobby' && (
        <div className="flex flex-col items-center justify-center py-20 gap-12">
          <div className="text-center">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-3">Waiting for Challengers</p>
            <h2 className="text-4xl font-black text-on-background uppercase tracking-tight">
              {needed > 0 ? `${needed} More Player${needed > 1 ? 's' : ''} Needed` : 'Starting Soon...'}
            </h2>
          </div>

          {/* Player slots */}
          <div className="flex flex-wrap justify-center gap-4">
            {[...Array(5)].map((_, i) => {
              const entry = playerList[i];
              const filled = !!entry;
              return (
                <div
                  key={i}
                  className={`w-28 h-28 border-2 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${
                    filled
                      ? 'border-primary/60 bg-primary/5'
                      : 'border-outline/10 bg-surface-container/30'
                  }`}
                >
                  {filled ? (
                    <>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black ${COLORS[i]}`}>
                        {entry[1].username[0].toUpperCase()}
                      </div>
                      <span className="text-[9px] font-black text-on-background/60 uppercase tracking-wider truncate max-w-[90px]">
                        {entry[1].username}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-outline/5 border border-dashed border-outline/20" />
                      <span className="text-[9px] font-bold text-on-background/20 uppercase tracking-wider">Waiting...</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Loading animation */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ===================== COUNTDOWN ===================== */}
      {phase === 'starting' && (
        <div className="flex flex-col items-center justify-center py-20 gap-8 relative">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">All Players Connected</p>
          <div className="relative">
            <span className="text-[160px] font-black text-primary/10 leading-none">{countdown}</span>
            <span className="absolute inset-0 flex items-center justify-center text-[80px] font-black text-primary leading-none animate-pulse">
              {countdown}
            </span>
          </div>
          <p className="text-sm font-black text-on-background/60 uppercase tracking-widest">Get Ready...</p>

          {/* Preview text */}
          <div className="mt-8 bg-surface-container/30 border border-outline/10 p-8 max-w-3xl w-full">
            <p className="text-[9px] font-bold text-on-background/30 uppercase tracking-widest mb-3">Text Preview</p>
            <p className="text-lg text-on-background/30 font-mono leading-relaxed tracking-wide">{raceText}</p>
          </div>
        </div>
      )}

      {/* ===================== RACING ===================== */}
      {phase === 'racing' && (
        <div className="space-y-8">

          {/* Race Track */}
          <div className="bg-surface-container/20 border border-outline/10 p-6 space-y-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[9px] font-black text-on-background/30 uppercase tracking-widest">Race Track</p>
              <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                Your WPM: <span className="text-lg ml-1">{myWpm}</span>
              </p>
            </div>

            {playerList.map(([id, p], idx) => {
              const isMe = socket && id === socket.id;
              return (
                <div key={id} className={`flex items-center gap-2 sm:gap-4 py-2 px-2 sm:px-3 rounded transition-all ${isMe ? 'bg-primary/5' : ''}`}>
                  {/* Username */}
                  <div className="w-20 sm:w-28 flex items-center gap-1 sm:gap-2 shrink-0 overflow-hidden">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black ${COLORS[idx % COLORS.length]}`}>
                      {p.username[0].toUpperCase()}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider truncate ${isMe ? 'text-primary' : 'text-on-background/60'}`}>
                      {p.username}
                    </span>
                  </div>

                  {/* Track lane */}
                  <div className="flex-1 h-8 bg-surface-container/40 border border-outline/5 relative overflow-hidden rounded-sm">
                    {/* Finish line */}
                    <div className="absolute right-0 top-0 bottom-0 w-px border-r-2 border-dashed border-on-background/10" />

                    {/* Car */}
                    <div
                      className="absolute top-0 bottom-0 flex items-center transition-all duration-300 ease-out"
                      style={{ left: `${Math.min(p.progress, 98)}%` }}
                    >
                      <div className={`text-lg ${isMe ? '' : 'grayscale-[50%]'}`}>🏎️</div>
                    </div>

                    {/* Progress fill */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${isMe ? 'bg-primary/10' : 'bg-on-background/3'}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>

                  {/* WPM */}
                  <div className="w-12 sm:w-16 text-right shrink-0">
                    <span className={`text-xs sm:text-sm font-black ${isMe ? 'text-primary' : 'text-on-background/50'}`}>{p.wpm}</span>
                    <span className="text-[8px] font-bold text-on-background/30 ml-1">wpm</span>
                  </div>

                  {/* Position badge */}
                  <div className="w-6 sm:w-8 text-center shrink-0">
                    {p.position && <span className="text-lg">{getPosition(p.position)}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Typing Area */}
          <div className="bg-surface-container/10 border border-outline/10 p-8">
            <p className="text-[9px] font-black text-on-background/30 uppercase tracking-widest mb-6">Type the text below</p>

            {/* Rendered text with highlights */}
            <div className={`relative ${fontSize} leading-relaxed tracking-wide mb-8 select-none typing-container-${raceLanguage}`}>
              {raceText.split('').map((char, i) => {
                let cls = 'text-on-background/25'; // upcoming
                if (i < inputValue.length) {
                  cls = inputValue[i] === char ? 'text-primary' : 'text-error bg-error/10';
                }
                if (i === inputValue.length) {
                  cls = 'text-on-background';
                }
                return (
                  <span key={i} className={`relative ${cls} transition-colors duration-75`}>
                    {i === inputValue.length && <Caret />}
                    {char}
                  </span>
                );
              })}
              
              {/* Caret at the very end if finished */}
              {inputValue.length === raceText.length && (
                <span className="relative w-0 h-full">
                  <Caret />
                </span>
              )}
            </div>

            {/* Hidden input */}
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleTyping}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="w-full bg-surface-container border border-outline/20 px-6 py-4 text-lg font-mono text-on-background outline-none focus:border-primary/50 transition-colors"
              placeholder="Start typing..."
            />
          </div>
        </div>
      )}

      {/* ===================== FINISHED ===================== */}
      {phase === 'finished' && (
        <div className="flex flex-col items-center py-16 gap-12">
          <div className="text-center">
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-2">Race Complete</p>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-on-background">Final Standings</h2>
          </div>

          <div className="w-full max-w-2xl space-y-2">
            {playerList
              .sort((a, b) => (a[1].position || 99) - (b[1].position || 99))
              .map(([id, p], idx) => {
                const isMe = socket && id === socket.id;
                return (
                  <div
                    key={id}
                    className={`flex items-center gap-6 p-6 border transition-all ${
                      isMe ? 'bg-primary/5 border-primary/30' : 'bg-surface-container/30 border-outline/10'
                    } ${p.position === 1 ? 'ring-2 ring-amber-400/30' : ''}`}
                  >
                    <span className="text-3xl w-12 text-center">{getPosition(p.position)}</span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black ${COLORS[idx % COLORS.length]}`}>
                      {p.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className={`font-black text-sm uppercase tracking-wider ${isMe ? 'text-primary' : 'text-on-background/70'}`}>
                        {p.username} {isMe && <span className="text-[8px] text-on-background/30 ml-2">(You)</span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-on-background/80">{p.wpm}</span>
                      <span className="text-[9px] font-bold text-on-background/30 ml-1 uppercase">wpm</span>
                    </div>
                  </div>
                );
              })}
          </div>

          <button
            onClick={() => {
              setPhase('idle');
              setPlayers({});
              setRaceText('');
              setTypedChars(0);
              setInputValue('');
              setMyWpm(0);
            }}
            className="px-16 py-5 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-primary/30 transition-all mt-4"
          >
            Race Again
          </button>
        </div>
      )}

      </>
      )}

    </div>
  );
};

export default Race;
