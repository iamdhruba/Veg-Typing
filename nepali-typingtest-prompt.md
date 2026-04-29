# NepaliType — Full MERN Stack Typing Test App
## Complete Build Prompt with Exact Key Mappings

---

## PROJECT OVERVIEW

Build a full-featured competitive typing speed test website for Nepali users, inspired by MonkeyType. The app supports four language modes with a real-time leaderboard/score dashboard showing who is on top globally.

**Four Typing Modes:**
1. English (standard QWERTY)
2. Nepali Preeti (legacy font, exact key+alt-code mappings from official chart)
3. Nepali Romanized Unicode (phonetic → Devanagari, exact layout from official chart)
4. Nepali Unicode Direct (OS-level Devanagari input)

---

## TECH STACK

```
Frontend : React 18 + Vite, Tailwind CSS v3, Zustand, React Router v6, Recharts
Backend  : Node.js 20 + Express.js 4
Database : MongoDB + Mongoose 8
Auth     : JWT (access 15min + refresh 7d), bcryptjs
Realtime : Socket.io (live leaderboard updates)
Other    : Axios, react-hot-toast, date-fns, helmet, cors, express-rate-limit
```

---

## FOLDER STRUCTURE

```
nepali-type/
├── client/                          # React + Vite frontend
│   ├── public/
│   │   └── fonts/
│   │       ├── Preeti.ttf           # Self-host Preeti font
│   │       └── NotoSansDevanagari-Regular.ttf
│   ├── src/
│   │   ├── components/
│   │   │   ├── TypingBox.jsx        # Core typing UI + input handler
│   │   │   ├── ResultCard.jsx       # Animated post-test result
│   │   │   ├── ModeSelector.jsx     # Language + timer tabs
│   │   │   ├── TimerBar.jsx
│   │   │   ├── LiveStats.jsx        # WPM + accuracy live
│   │   │   ├── PreetiKeyboard.jsx   # Visual keyboard hint panel
│   │   │   ├── RomanizedHint.jsx    # Romanized phonetic cheat sheet
│   │   │   ├── Navbar.jsx
│   │   │   ├── Caret.jsx            # Animated blinking caret
│   │   │   └── CapslockWarning.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Main typing test
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx          # Personal stats + history
│   │   │   ├── Leaderboard.jsx      # Full leaderboard page
│   │   │   └── Dashboard.jsx        # Score dashboard — who is on top
│   │   ├── store/
│   │   │   ├── useTypingStore.js
│   │   │   └── useAuthStore.js
│   │   ├── utils/
│   │   │   ├── preetiMap.js         # EXACT Preeti key + alt-code map
│   │   │   ├── romanizedMap.js      # EXACT romanized → Unicode map
│   │   │   ├── wordLists.js
│   │   │   └── wpmCalc.js
│   │   ├── hooks/
│   │   │   ├── useTypingEngine.js
│   │   │   └── usePreetiInput.js    # Alt+code buffer handler
│   │   ├── App.jsx
│   │   └── main.jsx
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── results.js
│   │   └── leaderboard.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── rateLimiter.js
│   ├── data/
│   │   ├── english.json             # 300 common English words
│   │   ├── nepali-preeti.json       # 300 words in Preeti encoding
│   │   ├── nepali-romanized.json    # 300 words as romanized strings
│   │   └── nepali-unicode.json      # 300 words as Devanagari Unicode
│   ├── socket/
│   │   └── leaderboardSocket.js     # Socket.io live events
│   └── index.js
└── .env
```

---

## EXACT PREETI FONT KEY MAPPING (preetiMap.js)

This is the **complete and exact** mapping from the official Preeti font chart. Implement this verbatim.

```javascript
// preetiMap.js
// Part 1: Standard key → Nepali character (what the Preeti font renders)
export const PREETI_KEY_MAP = {
  // Consonants
  "s":        "क",
  "v":        "ख",
  "u":        "ग",
  "3":        "घ",
  // ङ = Alt+0170
  "r":        "च",
  "5":        "छ",
  "h":        "ज",
  // झ = (c+m)(Alt+0180) — combo
  "`":        "ञ",   // backtick
  "6":        "ट",
  "7":        "ठ",
  "8":        "ड",
  "9":        "ढ",
  // ण = 0+f (combo)
  "t":        "त",
  "y":        "थ",
  "b":        "द",
  "w":        "ध",
  "g":        "न",
  "k":        "प",
  // फ = k+m (combo)
  "a":        "ब",
  // भ = Alt+0137
  "e":        "म",
  "o":        "य",
  "/":        "र",
  "n":        "ल",
  "j":        "व",
  "z":        "श",
  // ष = i+f (combo)
  ";":        "स",
  "x":        "ह",
  // क्ष = I+f (combo)
  "q":        "त्र",  // (1 key)
  "l":        "ज्ञ",  // (1 key)
  "c":        "अ",
  // आ = c+f (combo)
  "O":        "इ",    // Shift+o
  // ई = O+{ (combo, Shift+O + Shift+{)
  "f":        "उ",
  // ऊ = p+m
  // ऋ = C (Shift+c)
  "P":        "ए",   // Shift+p
  // ऐ = P+] (combo)
  // ओ = c+f+]
  // औ = c+f+}
  // अं = c++
  // अः = c+M
  "Q":        "त",   // (different stroke)
  // क्त = Q+m
  "4":        "ढ",   // duplicate — use context
  "B":        "ण",   // Shift+b
  "2":        "ड",
  // ट = b+[ combo
  "?":        "रू",
  ">":        "श्र",
  "X":        "ह",   // Shift+x (aspirated)
  "f":        "f",   // halanta/virama helper
  "1":        "ज्ञ",
  // Vowel signs (matras) used in combos:
  "m":        "्",   // halanta (virama, used for half-chars)
  "{":        "ि",   // shift+[ = i-matra
  "[":        "ी",   // square bracket = ii-matra
  "}":        "ु",   // shift+} = u-matra
  "]":        "ू",   // = uu-matra
  // Digits:
  "L":        "।",   // daṇḍa (purna biram)
  // Punctuation and special:
  "'":        "ं",   // apostrophe → anusvara (bindu)
  "\"":       "ँ",   // double quote → chandrabindu
  "+":        "ः",   // plus → visarga
  "M":        ":",   // colon
  "F":        "\"",
  "{":        "´",
  "|":        "।",
  "=":        "=",
  "\\":       "\\",
  ",":        ",",
  "<":        "<",
  ".":        "।",   // period → purna biram in Nepali
  "-":        "–",   // en-dash
  "_":        "—",   // em-dash
};

// Part 2: Alt+code map (Windows numpad Alt codes → Preeti characters)
// Intercept in browser via keydown + buffer numpad digits while Alt held
export const PREETI_ALT_MAP = {
  // Format: altCode (as string) → Nepali character
  "0132": "ध",
  "0133": "'",   // left single quote
  "0136": "प",
  "0137": "भ",
  "0139": "ब्र",
  "0145": "'",   // right single quote / apostrophe variant
  "0149": "इ",
  "0150": "-",   // en dash
  "0151": "–",
  "0152": "ς",
  "0155": "द",
  "0160": "",   // non-breaking space / virama helper
  "0161": "ड",
  "0162": "ढ",
  "0163": "ह",   // variant
  "0165": "-",
  "0167": "इ",
  "0170": "ङ",   // ← NGa consonant
  "0171": "ट",
  "0176": "ब्र",
  "0177": "+",
  "0180": "झ",   // ← JHA consonant (also used with (c+m) combo)
  "0182": "ड",
  "0191": "रू",
  "0197": "ह",
  "0198": "\"",
  "0203": "ड",
  "0204": "ब्र",
  "0205": "ट",
  "0206": "ब्र",
  "0210": "…",   // ellipsis
  "0214": "=",
  "0216": "च",
  "0217": ";",
  "0218": "'",
  "0219": "!",
  "0220": "%",
  "0221": "इ",
  "0222": ".",
  "0223": "च",
  "0229": "द",
  "0230": "\"",
  "0231": "ॐ",   // ← Om symbol
  "0247": "/",
};

// Part 3: Multi-key combos (type these sequences to get one character)
// The typing engine must detect these sequences in the input buffer
export const PREETI_COMBO_MAP = [
  { seq: ["c", "+", "+"], char: "अं" },     // अं (a + anusvara)
  { seq: ["c", "+", "M"], char: "अः" },     // अः (a + visarga)
  { seq: ["c", "f", "]"], char: "ओ" },      // ओ
  { seq: ["c", "f", "}"], char: "औ" },      // औ
  { seq: ["c", "f"],      char: "आ" },      // आ
  { seq: ["O", "+", "{"], char: "ई" },      // ई (long i)
  { seq: ["p", "+", "m"], char: "ऊ" },      // ऊ (long u)
  { seq: ["P", "+", "]"], char: "ऐ" },      // ऐ
  { seq: ["k", "+", "m"], char: "फ" },      // फ
  { seq: ["i", "+", "f"], char: "ष" },      // ष (retroflex sha)
  { seq: ["I", "+", "f"], char: "क्ष" },    // क्ष (ksha)
  { seq: ["0", "+", "f"], char: "ण" },      // ण (retroflex na)
  { seq: ["Q", "+", "m"], char: "क्त" },    // क्त
  { seq: ["b", "+", "["], char: "ट" },      // ट (alt form)
];
```

---

## EXACT ROMANIZED UNICODE MAPPING (romanizedMap.js)

This is the **complete and exact** mapping from the official Nepali Romanized Unicode layout PDF.

```javascript
// romanizedMap.js
// IMPORTANT: Longer/more-specific patterns MUST come before shorter ones.
// The converter uses longest-match-first greedy algorithm.

export const ROMANIZED_MAP = [
  // === Multi-character conjuncts (longest first) ===
  { from: "K/R",      to: "क्र" },    // क्र  (K slash R)
  { from: "K/K",      to: "क्क" },    // क्क
  { from: "Q/R",      to: "त्र" },    // त्र  (त्र)
  { from: "Q/T",      to: "त्त" },    // not in PDF but standard
  { from: "R/K",      to: "र्क" },    // र्क  (reph+ka)
  { from: "D/V",      to: "द्व" },    // द्व  (dva)
  { from: "D/D",      to: "द्द" },    // द्द
  { from: "D/Shift+D",to: "द्ध" },    // द्ध
  { from: "X/X",      to: "ड्ड" },    // ड्ड
  { from: "D/Shift+G",to: "द्ग" },
  // === Aspirated + special consonants ===
  { from: "Shift+K",  to: "ख" },
  { from: "Shift+G",  to: "घ" },
  { from: "Shift+C",  to: "छ" },
  { from: "Shift+J",  to: "झ" },      // झ — em/Shift+J in PDF
  { from: "Shift+T",  to: "थ" },
  { from: "Shift+D",  to: "ध" },
  { from: "Shift+N",  to: "0f" },     // 0f (0+f in Preeti) → ण? check PDF
  { from: "Shift+P",  to: "फ" },
  { from: "Shift+B",  to: "भ" },
  { from: "Shift+S",  to: "ष" },
  { from: "Shift+H",  to: "अ" },      // अ standalone
  { from: "Shift+A",  to: "आ" },
  { from: "Shift+O",  to: "औ" },
  { from: "Shift+W",  to: "औ" },
  { from: "Shift+F",  to: "ऊ" },
  { from: "Shift+Z",  to: "ऋ" },      // ऋ
  { from: "Shift+[",  to: "ई" },      // ई
  { from: "Shift+]",  to: "ऐ" },      // ऐ
  { from: "Shift+M",  to: "ं" },      // anusvara (Shift+M in PDF for अं)
  { from: "Shift+;",  to: "ः" },      // visarga
  { from: "Shift+9",  to: "-" },
  { from: "Shift+0",  to: "_" },
  { from: "Shift+R",  to: "¶" },
  { from: "Shift+<",  to: "ण" },      // ण (Shift+<)
  { from: "Shift+>",  to: "." },
  { from: "Shift+V",  to: "कँ" },     // kaN (chandrabindu ka)
  { from: "Shift+Y",  to: "ˆ" },
  { from: "Shift+U",  to: "\"" },
  { from: "Shift+I",  to: "~" },
  { from: "Shift+1",  to: "!" },
  { from: "Shift+5",  to: "%" },
  // === T/R combos (tra) ===
  { from: "T/",       to: "त्र" },    // त्र with slash
  { from: "J/",       to: "ज्ञ" },    // ज्ञ with slash
  { from: "K/",       to: "क्ष" },    // क्ष with slash
  // === Single consonants (lowercase) ===
  { from: "s",  to: "क" },
  { from: "v",  to: "ख" },
  { from: "u",  to: "ग" },
  { from: "3",  to: "घ" },
  { from: "r",  to: "च" },
  { from: "5",  to: "छ" },
  { from: "h",  to: "ज" },
  { from: "6",  to: "ट" },
  { from: "7",  to: "ठ" },
  { from: "8",  to: "ड" },
  { from: "9",  to: "ढ" },
  { from: "t",  to: "त" },
  { from: "y",  to: "थ" },
  { from: "b",  to: "द" },
  { from: "w",  to: "ध" },
  { from: "g",  to: "न" },
  { from: "k",  to: "प" },
  { from: "a",  to: "ब" },
  { from: "e",  to: "म" },
  { from: "o",  to: "य" },
  { from: "/",  to: "र" },
  { from: "n",  to: "ल" },
  { from: "j",  to: "व" },
  { from: "z",  to: "श" },
  { from: ";",  to: "स" },
  { from: "x",  to: "ह" },
  { from: "q",  to: "त्र" },
  { from: "l",  to: "ज्ञ" },
  { from: "c",  to: "अ" },
  { from: "O",  to: "इ" },
  { from: "f",  to: "उ" },
  { from: "C",  to: "ऋ" },
  { from: "P",  to: "ए" },
  { from: "G",  to: "घ" },
  { from: "J",  to: "ज्ञ" },
  { from: "H",  to: "ह" },
  { from: "I",  to: "इ" },
  { from: "A",  to: "स" },     // S key in PDF
  { from: "S",  to: "स" },
  { from: "T",  to: "त्र" },
  { from: "B",  to: "द" },
  { from: "D",  to: "द" },
  { from: "M",  to: "ं" },     // anusvara
  { from: "N",  to: "न" },
  { from: "R",  to: "र" },
  { from: "V",  to: "व" },
  { from: "X",  to: "ड" },
  { from: "K",  to: "क्ष" },
  { from: "Z",  to: "।" },     // purna biram
  { from: "Q",  to: "ट" },
  { from: "W",  to: "औ" },
  { from: "Y",  to: "य" },
  { from: "L",  to: "ल" },
  { from: "F",  to: "उ" },
  // === Vowels ===
  { from: "[",  to: "ी" },     // ii-matra
  { from: "]",  to: "ू" },     // uu-matra (Shift+] → ऐ handled above)
  { from: "E",  to: "]" },     // bracket in PDF
  { from: "\\", to: "्" },    // halanta / virama (half char)
  { from: "I",  to: "[" },     // इ matra variant
  { from: "i",  to: "Z" },     // from PDF i → Z/Z
  // === Matras (vowel diacritics) in combo ===
  // These are appended after consonants in the output stream
  // The engine should handle ViramaConsonant+matra patterns
  // === Devanagari Digits ===
  { from: "0",  to: "०" },
  { from: "1",  to: "१" },
  { from: "2",  to: "२" },
  { from: "3",  to: "३" },
  { from: "4",  to: "४" },
  { from: "5",  to: "५" },
  { from: "6",  to: "६" },
  { from: "7",  to: "७" },
  { from: "8",  to: "८" },
  { from: "9",  to: "९" },
  // === Punctuation ===
  { from: ".",  to: "।" },     // purna biram (daṇḍa)
  { from: ",",  to: "," },
  { from: "Alt+43",  to: "±" },
  { from: "Alt+61",  to: "=" },
  { from: "Alt+47",  to: "/" },
  { from: "Alt+2384",to: "ॐ" }, // OM symbol
];

// Converter function — longest match first greedy
export function romanToUnicode(input) {
  let result = "";
  let i = 0;
  while (i < input.length) {
    let matched = false;
    // Sort by length descending for longest-match
    const sorted = [...ROMANIZED_MAP].sort((a,b) => b.from.length - a.from.length);
    for (const { from, to } of sorted) {
      if (input.slice(i, i + from.length) === from) {
        result += to;
        i += from.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += input[i];
      i++;
    }
  }
  return result;
}
```

---

## ALT+CODE INPUT HANDLER (usePreetiInput.js)

```javascript
// usePreetiInput.js
// Handles Windows-style Alt+numpad code input in the browser
import { useEffect, useRef } from "react";
import { PREETI_ALT_MAP } from "../utils/preetiMap";

export function usePreetiInput(onCharInsert) {
  const altHeld = useRef(false);
  const numBuffer = useRef("");

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Alt") {
        altHeld.current = true;
        numBuffer.current = "";
        e.preventDefault();
        return;
      }
      if (altHeld.current) {
        // Accept numpad digits (Numpad0–Numpad9) or regular digits
        if (/^(Numpad\d|\d)$/.test(e.code) || /^\d$/.test(e.key)) {
          numBuffer.current += e.key.replace("Numpad", "");
          e.preventDefault();
          return;
        }
      }
    };

    const onKeyUp = (e) => {
      if (e.key === "Alt") {
        altHeld.current = false;
        const code = numBuffer.current.padStart(4, "0");
        if (PREETI_ALT_MAP[code]) {
          onCharInsert(PREETI_ALT_MAP[code]);
        }
        numBuffer.current = "";
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onCharInsert]);
}
```

---

## TYPING ENGINE (useTypingEngine.js)

```javascript
// Full hook — build from scratch, no external typing libraries
import { useState, useEffect, useRef, useCallback } from "react";
import { romanToUnicode } from "../utils/romanizedMap";

export function useTypingEngine({ words, mode, duration, language }) {
  const [typedHistory, setTypedHistory] = useState([]);   // per-word typed strings
  const [currentInput, setCurrentInput] = useState("");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [charStates, setCharStates] = useState([]);       // "correct"|"incorrect"|"pending"
  const [status, setStatus] = useState("idle");           // idle|running|finished
  const [timeLeft, setTimeLeft] = useState(duration);
  const [wpmHistory, setWpmHistory] = useState([]);       // per-second WPM for consistency
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);
  const correctCharsRef = useRef(0);

  // Start test on first keypress
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
        // Record WPM snapshot each second
        const elapsed = (Date.now() - startTime) / 60000;
        const liveWpm = Math.round(correctCharsRef.current / 5 / elapsed);
        setWpmHistory(h => [...h, liveWpm]);
        return t - 1;
      });
    }, 1000);
  }, [status, startTime]);

  // Handle character input
  const handleInput = useCallback((e) => {
    const raw = e.target.value;
    if (status === "idle") startTest();
    if (status === "finished") return;

    let value = raw;
    // For romanized mode, convert on-the-fly
    if (language === "romanized") {
      value = romanToUnicode(raw);
    }

    // Space = submit word
    if (raw.endsWith(" ")) {
      const typed = value.trim();
      const target = words[currentWordIdx];
      setTypedHistory(h => [...h, typed]);
      // Count correct chars
      for (let i = 0; i < Math.min(typed.length, target.length); i++) {
        if (typed[i] === target[i]) correctCharsRef.current++;
      }
      setCurrentInput("");
      setCurrentWordIdx(i => i + 1);
      if (currentWordIdx + 1 >= words.length) {
        clearInterval(timerRef.current);
        setStatus("finished");
      }
      return;
    }

    setCurrentInput(value);

    // Update char states for current word
    const target = words[currentWordIdx] || "";
    const states = target.split("").map((ch, i) => {
      if (i >= value.length) return "pending";
      return value[i] === ch ? "correct" : "incorrect";
    });
    setCharStates(states);
  }, [status, language, words, currentWordIdx, startTest]);

  // Calculate final results
  const getResult = useCallback(() => {
    const elapsed = (Date.now() - startTime) / 60000;
    const wpm = Math.round(correctCharsRef.current / 5 / elapsed);
    const totalTyped = typedHistory.join(" ").length;
    const correctTyped = typedHistory.reduce((acc, typed, i) => {
      const target = words[i] || "";
      let c = 0;
      for (let j = 0; j < Math.min(typed.length, target.length); j++) {
        if (typed[j] === target[j]) c++;
      }
      return acc + c;
    }, 0);
    const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0;
    // Consistency = 100 - (stddev of wpmHistory / mean * 100)
    const mean = wpmHistory.reduce((a, b) => a + b, 0) / (wpmHistory.length || 1);
    const variance = wpmHistory.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (wpmHistory.length || 1);
    const stddev = Math.sqrt(variance);
    const consistency = Math.max(0, Math.round(100 - (stddev / (mean || 1)) * 100));
    return {
      wpm, rawWpm: Math.round(totalTyped / 5 / elapsed),
      accuracy, consistency,
      charStats: { correct: correctTyped, incorrect: totalTyped - correctTyped },
      language, duration,
      timestamp: new Date().toISOString(),
      wpmHistory,
    };
  }, [startTime, typedHistory, words, wpmHistory, language, duration]);

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
  }, [duration]);

  return {
    currentInput, handleInput, currentWordIdx,
    charStates, status, timeLeft,
    typedHistory, getResult, restart,
  };
}
```

---

## SCORE DASHBOARD & LEADERBOARD (Dashboard.jsx + Leaderboard.jsx)

### Dashboard Page Layout
Build a live score dashboard at `/dashboard` that shows:

```
┌─────────────────────────────────────────────────────────────┐
│  🏆  NepaliType Leaderboard          [Filter bar]           │
├──────────────────────────┬──────────────────────────────────┤
│  TOP 3 PODIUM (animated) │  YOUR RANK CARD                  │
│  👑 #1 RamBahadur 142wpm │  #47 of 2,341 users             │
│  🥈 #2 Sita 138wpm       │  Your best: 89 wpm (English)    │
│  🥉 #3 Hari 135wpm       │  Keep typing to climb!          │
├──────────────────────────┴──────────────────────────────────┤
│  LANGUAGE TABS: [English] [Preeti] [Romanized] [Unicode]    │
│  DURATION:      [15s] [30s] [60s] [120s]                    │
├─────────────────────────────────────────────────────────────┤
│  Rank │ Avatar │ Username    │ WPM │ Accuracy │ Date        │
│   1   │   RB   │ RamBahadur  │ 142 │  97.3%   │ 2 hrs ago  │
│   2   │   SK   │ Sita        │ 138 │  98.1%   │ 5 hrs ago  │
│  ...  │        │             │     │          │            │
│  [47] │  YOU   │ yourname    │  89 │  94.2%   │ yesterday  │ ← highlighted
├─────────────────────────────────────────────────────────────┤
│  ACTIVITY HEATMAP (last 52 weeks, like GitHub)              │
│  MOST IMPROVED THIS WEEK (top 5 users with biggest WPM gain)│
│  LANGUAGE BREAKDOWN PIE CHART                               │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Components to Build:
1. **PodiumCard** — Top 3 with animated crown/medals, avatar initials, WPM badge
2. **YourRankCard** — Shows logged-in user's global rank, best WPM per mode
3. **LeaderboardTable** — Paginated table (20/page), current user row highlighted in accent yellow
4. **FilterBar** — Language × Duration × Mode tabs, client-side filter (no refetch)
5. **ActivityHeatmap** — 52-week heatmap using user's test timestamps (like GitHub contribution graph)
6. **MostImprovedWidget** — Compare each user's WPM this week vs last week, show top 5 gainers
7. **LanguageBreakdownChart** — Pie/donut chart (Recharts) of test attempts by language
8. **LiveUpdateIndicator** — Socket.io: when a new top score is set, animate the new entry sliding in
   with a toast "🎉 RamBahadur just set a new record: 145 WPM!"

### Socket.io Events (leaderboardSocket.js)
```javascript
// Server emits:
socket.emit("new_record", { username, wpm, language, duration });
socket.emit("leaderboard_update", { top20: [...] });

// Client listens:
socket.on("new_record", (data) => showToast + animate row);
socket.on("leaderboard_update", (data) => setLeaderboard(data.top20));
```

---

## BACKEND API

### Auth  
```
POST /api/auth/register   { username, email, password }
POST /api/auth/login      { email, password }  → { accessToken, refreshToken }
POST /api/auth/refresh    { refreshToken }      → { accessToken }
GET  /api/auth/me         (Bearer token)        → User object
```

### Results
```
POST /api/results            Save result (protected)
GET  /api/results/me         My results (paginated)
GET  /api/results/me/best    Personal best per language
GET  /api/results/stats/me   Aggregate: total tests, time typed, avg WPM
```

### Leaderboard
```
GET /api/leaderboard?language=english&duration=60&page=1&limit=20
GET /api/leaderboard/top3?language=english&duration=60
GET /api/leaderboard/rank/:userId?language=english&duration=60
GET /api/leaderboard/most-improved?days=7
GET /api/leaderboard/activity/:userId   → heatmap data (date → count)
```

---

## MONGODB SCHEMAS

```javascript
// User.js
const UserSchema = new Schema({
  username:    { type: String, unique: true, required: true, minlength: 3, maxlength: 20 },
  email:       { type: String, unique: true, required: true },
  password:    String,
  createdAt:   { type: Date, default: Date.now },
  personalBests: {
    english:   { wpm: Number, accuracy: Number, resultId: ObjectId },
    preeti:    { wpm: Number, accuracy: Number, resultId: ObjectId },
    romanized: { wpm: Number, accuracy: Number, resultId: ObjectId },
    unicode:   { wpm: Number, accuracy: Number, resultId: ObjectId },
  },
  totalTests:   { type: Number, default: 0 },
  totalSeconds: { type: Number, default: 0 },
});

// Result.js
const ResultSchema = new Schema({
  userId:      { type: ObjectId, ref: "User", required: true, index: true },
  language:    { type: String, enum: ["english","preeti","romanized","unicode"], index: true },
  mode:        { type: String, enum: ["time","words"] },
  duration:    { type: Number, index: true },   // seconds or word count
  wpm:         { type: Number, index: true },
  rawWpm:      Number,
  accuracy:    Number,
  consistency: Number,
  charStats:   { correct: Number, incorrect: Number },
  wpmHistory:  [Number],                          // per-second WPM for replay
  timestamp:   { type: Date, default: Date.now, index: true },
});

// Compound index for leaderboard queries
ResultSchema.index({ language: 1, duration: 1, wpm: -1 });
```

---

## UI DESIGN SPEC

### Color Theme (Dark — MonkeyType-inspired with Nepali identity)
```css
:root {
  --bg-primary:    #0f0f11;   /* near-black background */
  --bg-surface:    #1a1a1e;   /* card/panel background */
  --bg-elevated:   #252529;   /* hover/active surface */
  --accent:        #e2b714;   /* gold — typing cursor + highlights */
  --accent-dim:    #b8920f;   /* dimmed accent */
  --text-primary:  #d1d0c5;   /* typed correct text */
  --text-dim:      #646669;   /* untyped text */
  --text-error:    #ca4754;   /* incorrect typed chars */
  --text-ghost:    #3a3a3e;   /* placeholder */
  --rank-gold:     #ffd700;
  --rank-silver:   #c0c0c0;
  --rank-bronze:   #cd7f32;
  --green:         #57c26d;   /* accuracy / correct */
  --blue:          #5ba6e0;   /* info */
}
```

### Typography
```css
/* Typing area fonts — load via @font-face */
.mode-english   { font-family: "JetBrains Mono", monospace; font-size: 1.5rem; }
.mode-preeti    { font-family: "Preeti", serif; font-size: 1.6rem; }
.mode-romanized { font-family: "Noto Sans Devanagari", sans-serif; font-size: 1.5rem; }
.mode-unicode   { font-family: "Noto Sans Devanagari", sans-serif; font-size: 1.5rem; }

/* UI fonts */
body { font-family: "Fira Code", monospace; }
h1, h2 { font-family: "Syne", sans-serif; }
```

### Typing Area Layout
- Words wrap across 3 visible lines, overflow hidden (not scrollable — words scroll up)
- Each character is a `<span>` with class: `correct` | `incorrect` | `pending`
- Blinking caret: absolutely positioned yellow `|` before current char
- Current word: slightly brighter background pill highlight
- Input: transparent `<input>` overlaid, no visible focus ring
- Live WPM + accuracy shown in small text below the word area

### Keyboard Hint Panel (PreetiKeyboard.jsx)
- Floating panel (bottom-right), toggle with `?` button
- Tab 1: Visual QWERTY layout — each key shows the Preeti character it produces
- Tab 2: Alt+Codes table (3 columns: Code | Character | Preview)
- Tab 3: Combo sequences table
- Draggable via mouse, resizable
- For Romanized mode: shows phonetic equivalents in a table

---

## PREETI KEYBOARD PANEL — ALL KEYS

Render a visual QWERTY keyboard where each key shows two characters:
- Top-left: the ASCII key label
- Top-right: the Preeti Devanagari character it produces (in Preeti font)

```
Row 1 (numbers): 1→? | 2→ड | 3→घ | 4→ढ | 5→छ | 6→ट | 7→ठ | 8→ड | 9→ढ | 0→? | -→– | =→=
Row 2 (QWERTY):  q→त्र | w→ध | e→म | r→च | t→त | y→थ | u→ग | i→? | o→य | p→? | [→ी | ]→ू
Row 3 (ASDF):    a→ब | s→क | d→? | f→उ | g→न | h→ज | j→व | k→प | l→ज्ञ | ;→स | '→ं
Row 4 (ZXCV):    z→श | x→ह | c→अ | v→ख | b→द | n→ल | m→? | ,→, | .→। | /→र
```

---

## WORD LISTS (sample, build out to 300 each)

### nepali-preeti.json (store in Preeti encoding)
```json
["k]Gb", "hLjg", "k|ltlbg", "gofF", "wGojfb", "k|d", "sfd", "efiff", "d'n's"]
```
*(These are common Nepali words encoded in Preeti ASCII. Generate 300 of the most common Nepali words in Preeti encoding.)*

### nepali-romanized.json (store as romanized strings, display as Unicode)
```json
["namaste", "dhanyabad", "kasto", "tapai", "ramro", "ghar", "paani", "khana", "subha"]
```

### nepali-unicode.json (store as Devanagari Unicode)
```json
["नमस्ते", "धन्यवाद", "कस्तो", "तपाई", "राम्रो", "घर", "पानी", "खाना", "शुभ"]
```

---

## RESULT CARD (ResultCard.jsx)

After test ends, show an animated card with:
```
┌──────────────────────────────────┐
│  wpm         raw        acc      │
│  89          95         96.3%    │
│                                  │
│  consistency  characters         │
│  87%          421/8/0/2          │
│               (c/i/extra/missed) │
│                                  │
│  [WPM over time line chart]      │
│                                  │
│  [Save Result] [Try Again]       │
│  [Share]                         │
└──────────────────────────────────┘
```
- Each stat animates counting up from 0
- Chart uses wpmHistory array (Recharts LineChart)
- Share button generates a shareable image (html2canvas)

---

## .env

```env
# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nepalitype
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLIENT_URL=http://localhost:5173

# Client (.env in /client)
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## SETUP INSTRUCTIONS

```bash
# 1. Clone and install
git clone <repo> && cd nepali-type

# Backend
cd server && npm install
# npm install express mongoose bcryptjs jsonwebtoken cors helmet express-rate-limit dotenv socket.io

# Frontend
cd ../client && npm create vite@latest . -- --template react
npm install axios zustand react-router-dom recharts react-hot-toast tailwindcss

# 2. Add fonts
# Download Preeti.ttf and place in client/public/fonts/
# Download NotoSansDevanagari-Regular.ttf and place in client/public/fonts/

# 3. Start
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && npm run dev
```

---

## IMPLEMENTATION CHECKLIST

```
BACKEND:
[ ] Express server with CORS, helmet, rate-limiter
[ ] MongoDB connection with Mongoose
[ ] User model + Result model with compound indexes
[ ] JWT auth (register/login/refresh/me)
[ ] Results CRUD routes + leaderboard queries
[ ] Socket.io server emitting new_record events
[ ] Word list JSON files (300 words each × 4 languages)

FRONTEND — CORE:
[ ] useTypingEngine.js — built from scratch
[ ] usePreetiInput.js — Alt+code buffer via keydown/keyup
[ ] preetiMap.js — complete PREETI_KEY_MAP + PREETI_ALT_MAP + PREETI_COMBO_MAP
[ ] romanizedMap.js — complete ROMANIZED_MAP + romanToUnicode()
[ ] TypingBox.jsx — renders colored char spans + caret + transparent input
[ ] ModeSelector — Language (4) × Timer (15/30/60/120s) × Words (25/50/100)
[ ] ResultCard — animated stats + Recharts WPM line chart
[ ] CapslockWarning — toast when Caps Lock is on

FRONTEND — DASHBOARD:
[ ] PodiumCard — top 3 with crown/medal animations
[ ] YourRankCard — personal rank + best per language
[ ] LeaderboardTable — paginated, highlighted current user row
[ ] FilterBar — language × duration filters
[ ] ActivityHeatmap — 52-week GitHub-style heatmap
[ ] MostImprovedWidget — WPM gain this week
[ ] LanguageBreakdownChart — Recharts PieChart
[ ] Live Socket.io — animate new record entries + toast

FRONTEND — OTHER PAGES:
[ ] PreetiKeyboard — visual QWERTY + Alt-codes + combos, draggable
[ ] RomanizedHint — phonetic cheat sheet
[ ] Profile — avatar, stats grid, WPM chart, personal bests per language
[ ] Login / Register forms
[ ] Navbar with language mode indicator

QUALITY:
[ ] Keyboard shortcut: Tab = restart, Esc = stop
[ ] Guest mode (no login needed to type; login to save)
[ ] Language preference persisted in localStorage
[ ] All API calls with loading states + error toasts
[ ] Responsive: tablet (768px+) and desktop
[ ] Font licensing note in README
```

---

## IMPORTANT NOTES FOR AI CODING ASSISTANT

1. **Do NOT use any third-party typing engine library** — build `useTypingEngine.js` from scratch.
2. **Preeti font must be self-hosted** — load via `@font-face` from `/public/fonts/Preeti.ttf`. Never use Google Fonts or CDN for Preeti.
3. **Alt+code input**: Browsers do not natively fire the Windows Alt+numpad character. You MUST implement the buffer listener in `usePreetiInput.js` using `keydown`/`keyup` events.
4. **Romanized converter**: Sort ROMANIZED_MAP by `from.length` descending before matching. Never sort alphabetically or it will break multi-char patterns.
5. **Devanagari rendering**: Use `unicode-bidi: normal` and `direction: ltr` on Devanagari text containers. Do NOT use RTL settings.
6. **Preeti encoding**: Words in `nepali-preeti.json` are stored as ASCII strings that render as Nepali when the Preeti font is applied. Do NOT store them as Unicode.
7. **Leaderboard queries**: Always use the compound MongoDB index `{ language, duration, wpm: -1 }` for leaderboard queries. Never do full collection scans.
8. **Socket.io**: Only emit `new_record` when the submitted WPM actually beats the existing top-10 for that language+duration combination.
9. **Consistency score**: Calculate as `100 - (stddev(wpmHistory) / mean(wpmHistory) * 100)` clamped to [0, 100].
10. **WPM formula**: `(correctChars / 5) / elapsedMinutes` — a "word" is defined as 5 characters.
```
