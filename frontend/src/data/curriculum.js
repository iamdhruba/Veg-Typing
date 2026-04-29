// ============================================
// Nepali Typing Curriculum - Standardized Data
// ============================================

const NP_WORDS_EASY = ["कख", "घर", "वन", "जल", "नल", "मन", "धन", "तन", "कर", "पर", "काम", "नाम", "हात", "रात", "दिन", "चिया", "पानी"];
const NP_WORDS_MED = ["नेपाल", "हिमाल", "पहाड", "विद्यालय", "किताब", "शिक्षक", "प्रकृति", "संस्कृति", "इतिहास", "विज्ञान", "प्रविधि", "शिक्षा"];
const NP_WORDS_ADV = ["अन्तर्राष्ट्रिय", "प्रतियोगिता", "विश्वविद्यालय", "संविधान", "सर्वोच्च", "आत्मनिर्भर", "प्राथमिकता", "पारिवारिक"];

const NP_SENT_EASY = ["म नेपाली हुँ।", "नेपाल सुन्दर छ।", "मेरो नाम राम हो।", "हामी विद्यालय जान्छौं।"];
const NP_SENT_MED = ["मलाई मेरो देश नेपाल धेरै मन पर्छ।", "परिश्रमको फल सधैं मीठो हुन्छ।", "ज्ञान नै सबैभन्दा ठूलो धन हो।"];
const NP_SENT_ADV = ["नेपाल एक बहुजातीय, बहुभाषिक, बहुधार्मिक राष्ट्र हो।", "प्राकृतिक स्रोतको समुचित उपयोग गर्दै दिगो विकास हासिल गर्नुपर्छ।"];

const EN_WORDS = ["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "hello", "world", "typing", "practice"];
const EN_SENT = ["The quick brown fox jumps over the lazy dog.", "Practice makes a man perfect.", "Typing fast requires muscle memory."];

export const CURRICULUM = {
  english: [
    // --- FOUNDATION (Home Row) ---
    { id: "e1", title: "Home Row: Index Fingers (f j)", description: "Start with your index fingers on the home row bumps.", generator: "progressive", targetChars: ["f", "j"] },
    { id: "e2", title: "Home Row: Middle Fingers (d k)", description: "Add middle fingers to the home row.", generator: "progressive", targetChars: ["d", "k"] },
    { id: "e3", title: "Home Row: Ring & Pinky (a s l ;)", description: "Complete the outer home row keys.", generator: "progressive", targetChars: ["a", "s", "l", ";"] },
    { id: "e4", title: "Home Row: Extensions (g h)", description: "Reaching the inner home row keys.", generator: "progressive", targetChars: ["g", "h"] },
    { id: "e5", title: "Home Row: Full Mastery", description: "All home row keys combined.", generator: "progressive", targetChars: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"] },

    // --- EXPANSION (Top Row) ---
    { id: "e6", title: "Top Row: Left Hand (q w e r t)", description: "Reaching up with your left hand.", generator: "progressive", targetChars: ["q", "w", "e", "r", "t"] },
    { id: "e7", title: "Top Row: Right Hand (y u i o p)", description: "Reaching up with your right hand.", generator: "progressive", targetChars: ["y", "u", "i", "o", "p"] },
    { id: "e8", title: "Top Row: Full Mastery", description: "Combining both hands on the top row.", generator: "progressive", targetChars: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"] },

    // --- EXPANSION (Bottom Row) ---
    { id: "e9", title: "Bottom Row: Left Hand (z x c v b)", description: "Reaching down with your left hand.", generator: "progressive", targetChars: ["z", "x", "c", "v", "b"] },
    { id: "e10", title: "Bottom Row: Right Hand (n m , . /)", description: "Reaching down with your right hand.", generator: "progressive", targetChars: ["n", "m", ",", ".", "/"] },
    { id: "e11", title: "Bottom Row: Full Mastery", description: "Combining both hands on the bottom row.", generator: "progressive", targetChars: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"] },

    // --- ALL LETTERS (Lower Case) ---
    { id: "e12", title: "All Letters: Beginner Drills", description: "Simple words using all 26 letters.", generator: "bank", wordBank: ["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog"] },
    { id: "e13", title: "All Letters: Common Patterns", description: "Practice common letter sequences like 'th', 'he', 'in'.", generator: "bank", wordBank: ["the", "her", "his", "ing", "ion", "tion", "and", "ment"] },

    // --- SHIFT KEYS & CAPITALIZATION ---
    { id: "e14", title: "Shift Keys: Left Hand Capitals", description: "Capitalizing letters with your right pinky on Shift.", generator: "progressive", targetChars: ["A", "S", "D", "F", "G", "Q", "W", "E", "R", "T", "Z", "X", "C", "V", "B"] },
    { id: "e15", title: "Shift Keys: Right Hand Capitals", description: "Capitalizing letters with your left pinky on Shift.", generator: "progressive", targetChars: ["J", "K", "L", "H", "Y", "U", "I", "O", "P", "N", "M"] },
    { id: "e16", title: "Proper Nouns: Mixed Case", description: "Practice names and places.", generator: "bank", wordBank: ["London", "Paris", "Nepal", "Everest", "Alice", "Bob", "Charlie", "Google"] },

    // --- NUMBERS & SYMBOLS ---
    { id: "e17", title: "Number Row: Basics (1 2 3 4 5)", description: "Top row numbers with left hand.", generator: "progressive", targetChars: ["1", "2", "3", "4", "5"] },
    { id: "e18", title: "Number Row: Basics (6 7 8 9 0)", description: "Top row numbers with right hand.", generator: "progressive", targetChars: ["6", "7", "8", "9", "0"] },
    { id: "e19", title: "Punctuation: Basic ( , . ? ! ; :)", description: "Standard sentence marks.", generator: "progressive", targetChars: [",", ".", "?", "!", ";", ":"] },
    { id: "e20", title: "Punctuation: Advanced ( \" ' - _ )", description: "Quotes and dashes.", generator: "progressive", targetChars: ["\"", "'", "-", "_"] },
    { id: "e21", title: "Brackets & Braces ( ( ) [ ] { } )", description: "Parentheses, brackets, and braces.", generator: "progressive", targetChars: ["(", ")", "[", "]", "{", "}"] },
    { id: "e22", title: "Math Symbols ( + = * / % < > )", description: "Operators and comparators.", generator: "progressive", targetChars: ["+", "=", "*", "/", "%", "<", ">"] },
    { id: "e23", title: "Special Characters ( @ # $ ^ & | \\ ~ ` )", description: "Symbols used in tech and coding.", generator: "progressive", targetChars: ["@", "#", "$", "^", "&", "|", "\\", "~", "`"] },

    // --- INTERMEDIATE (Speed Building) ---
    { id: "e24", title: "Common Words: Top 50 (I)", description: "Master the most frequent English words.", generator: "bank", wordBank: ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with"] },
    { id: "e25", title: "Common Words: Top 50 (II)", description: "Build muscle memory for frequent words.", generator: "bank", wordBank: ["he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she"] },
    { id: "e26", title: "Intermediate Sentences (Short)", description: "Focus on rhythm and spacing.", generator: "bank", wordBank: ["The sun is bright.", "I like to type.", "We are learning.", "Practice is key."] },
    { id: "e27", title: "Intermediate Sentences (Medium)", description: "Balancing speed and accuracy.", generator: "bank", wordBank: ["Typing fast requires muscle memory.", "The quick brown fox jumps over the lazy dog.", "A journey of a thousand miles begins with a single step."] },

    // --- ADVANCED (Professional Skills) ---
    { id: "e28", title: "Professional: Business Vocabulary", description: "Corporate and administrative terms.", generator: "bank", wordBank: ["management", "strategy", "investment", "efficiency", "quarterly", "revenue", "partnership", "logistics"] },
    { id: "e29", title: "Professional: Academic Vocabulary", description: "Formal and research-oriented words.", generator: "bank", wordBank: ["hypothesis", "synthesis", "quantitative", "methodology", "empirical", "theoretical", "paradigm", "correlation"] },
    { id: "e30", title: "Professional: Technical Vocabulary", description: "Tech-focused terminology.", generator: "bank", wordBank: ["algorithm", "interface", "protocol", "framework", "database", "encryption", "bandwidth", "virtualization"] },
    { id: "e31", title: "Code Snippets: HTML/CSS", description: "Practice syntax patterns.", generator: "bank", wordBank: ["<div class=\"container\">", "flex: 1;", "margin: 0 auto;", "padding: 20px;", "background-color: #fff;"] },
    { id: "e32", title: "Code Snippets: JS/Logic", description: "Practice programming symbols.", generator: "bank", wordBank: ["const data = [];", "function(arg) {", "return true;", "if (x === y)", "console.log(msg);"] },

    // --- MASTERY (Expert Level) ---
    { id: "e33", title: "Advanced Mastery: Long Words", description: "Tackle multi-syllabic complex words.", generator: "bank", wordBank: ["misunderstanding", "extraordinary", "unquestionably", "disproportionate", "implementation", "synchronization"] },
    { id: "e34", title: "Expert Mastery: Quotes (I)", description: "Typing famous literary quotes.", generator: "bank", wordBank: ["To be, or not to be, that is the question.", "All that glitters is not gold.", "The only thing we have to fear is fear itself."] },
    { id: "e35", title: "Expert Mastery: Quotes (II)", description: "Longer, more complex literary excerpts.", generator: "bank", wordBank: ["It was the best of times, it was the worst of times.", "In the beginning God created the heaven and the earth.", "I have a dream that one day this nation will rise up."] },
    { id: "e36", title: "Expert Mastery: Statistics & Data", description: "Numbers and symbols mixed with text.", generator: "bank", wordBank: ["The 2024 GDP growth was 3.5%.", "Use $1,250.00 for the total budget.", "Error: 404 Not Found at line 147."] },
    { id: "e37", title: "Expert Mastery: Scientific Text", description: "Precise terminology and symbols.", generator: "bank", wordBank: ["H2O is water.", "E = mc^2 is Einstein's formula.", "The photosynthesis (C6H12O6) process is vital."] },

    // --- GODMODE (Ultimate Speed & Precision) ---
    { id: "e38", title: "GODMODE: Endurance Trial (Easy)", description: "Maintain speed for longer duration.", generator: "bank", wordBank: ["Consistency is more important than intensity. Focus on keeping a steady pace without looking at the keyboard."] },
    { id: "e39", title: "GODMODE: Endurance Trial (Medium)", description: "High-speed professional text.", generator: "bank", wordBank: ["The modern world is built on digital communication, where typing speed directly impacts productivity and professional success."] },
    { id: "e40", title: "GODMODE: Endurance Trial (Hard)", description: "Complex sentence structures.", generator: "bank", wordBank: ["Philosophical inquiries into the nature of reality often require a nuanced understanding of linguistic constructs and historical contexts."] },
    { id: "e41", title: "GODMODE: Special Character Storm", description: "Heavy use of non-alphanumeric keys.", generator: "bank", wordBank: ["{ [ ( @ # $ % ^ & * ! ? / \\ | ~ ` + = - _ < > : ; ' \" ) ] }"] },
    { id: "e42", title: "GODMODE: The 100 WPM Challenge", description: "Target 100+ WPM with pure accuracy.", generator: "bank", wordBank: ["Success is not final, failure is not fatal: it is the courage to continue that counts. Your speed is a reflection of your focus."] },
    { id: "e43", title: "GODMODE: Legal/Contractual Text", description: "Formal and repetitive complex text.", generator: "bank", wordBank: ["The party of the first part hereby agrees to indemnify and hold harmless the party of the second part from any liability."] },
    { id: "e44", title: "GODMODE: Philosophical Mastery", description: "Deep text for high-level concentration.", generator: "bank", wordBank: ["The unexamined life is not worth living. Knowledge is the food of the soul. We are what we repeatedly do. Excellence, then, is not an act, but a habit."] },
    { id: "e45", title: "GODMODE: ULTIMATE SPEED TEST", description: "Final exam. No errors allowed.", generator: "bank", wordBank: ["Congratulations on reaching the final level. You are now a professional expert typist. Keep practicing to maintain your elite performance!"] }
  ],

  preeti: [
    // BASIC CONSONANTS
    { id: "p1", title: "Preeti: Consonants: क ख ग घ ङ (s v u 3 Alt+0170)", description: "Velar stops.", generator: "progressive", targetChars: ["s", "v", "u", "3", "ª"] },
    { id: "p2", title: "Preeti: Consonants: च छ ज झ ञ (r 5 h e+m `)", description: "Palatal affricates.", generator: "progressive", targetChars: ["r", "5", "h", "em", "`"] },
    { id: "p3", title: "Preeti: Consonants: ट ठ ड ढ ण (6 7 8 9 0f)", description: "Retroflex stops.", generator: "progressive", targetChars: ["6", "7", "8", "9", "0f"] },
    { id: "p4", title: "Preeti: Consonants: त थ द ध न (t y b w g)", description: "Dental stops.", generator: "progressive", targetChars: ["t", "y", "b", "w", "g"] },
    { id: "p5", title: "Preeti: Consonants: प फ ब भ म (k k+m a e d)", description: "Labial stops.", generator: "progressive", targetChars: ["k", "km", "a", "e", "d"] },
    { id: "p6", title: "Preeti: Consonants: य र ल व (o / n j)", description: "Semi-vowels.", generator: "progressive", targetChars: ["o", "/", "n", "j"] },
    { id: "p7", title: "Preeti: Consonants: श ष स ह (z i+f ; x)", description: "Sibilants and fricatives.", generator: "progressive", targetChars: ["z", "if", ";", "x"] },

    // VOWELS
    { id: "p8", title: "Preeti: Vowels: अ आ इ ई (c c+f O O+{)", description: "Primary standalone vowels.", generator: "progressive", targetChars: ["c", "cf", "O", "O{"] },
    { id: "p9", title: "Preeti: Vowels: उ ऊ ऋ (p p+m C)", description: "More standalone vowels.", generator: "progressive", targetChars: ["p", "pm", "C"] },
    { id: "p10", title: "Preeti: Vowels: ए ऐ ओ औ (P P+] c+f+] c+f+})", description: "Diphthongs.", generator: "progressive", targetChars: ["P", "P]", "cf]", "cf}"] },
    { id: "p11", title: "Preeti: Vowels: अं अः (c+ c+M)", description: "Nasalized and visarga.", generator: "progressive", targetChars: ["c+", "cM"] },

    // MATRAS
    { id: "p12", title: "Preeti: Matras: का कि की (sf ls sL)", description: "Practice aa, i, ii matras with 'ka'.", generator: "progressive", targetChars: ["sf", "ls", "sL"] },
    { id: "p13", title: "Preeti: Matras: कृ के कै क् (s[ s] s} s\\)", description: "Practice ri, e, ai, and halant with 'ka'.", generator: "progressive", targetChars: ["s[", "s]", "s}", "s\\"] },

    // HALF LETTERS
    { id: "p14", title: "Preeti: Half Letters: क् ख् ग् घ् (S V U Alt+0163)", description: "Ka-varga half letters.", generator: "progressive", targetChars: ["S", "V", "U", "£"] },
    { id: "p15", title: "Preeti: Half Letters: च् छ् ज् झ् ञ् (R Alt+0165 H Alt+0137 ~)", description: "Cha-varga half letters.", generator: "progressive", targetChars: ["R", "¥", "H", "‰", "~"] },
    { id: "p16", title: "Preeti: Half Letters: त् थ् ध् न् (T Y W G)", description: "Ta-varga half letters.", generator: "progressive", targetChars: ["T", "Y", "W", "G"] },
    { id: "p17", title: "Preeti: Half Letters: प् फ् ब् भ् म् (K Alt+0136 A E D)", description: "Pa-varga half letters.", generator: "progressive", targetChars: ["K", "ˆ", "A", "E", "D"] },
    { id: "p18", title: "Preeti: Half Letters: ल् व् (N J)", description: "Ya-varga survivors.", generator: "progressive", targetChars: ["N", "J"] },
    { id: "p19", title: "Preeti: Half Letters: श् ष् स् (Z I :)", description: "Sha-varga half letters.", generator: "progressive", targetChars: ["Z", "I", ":"] },

    // CONJUNCTS & SPECIAL COMBINATIONS
    { id: "p20", title: "Preeti: Conjuncts 1: क्ष त्र ज्ञ (I+f q 1)", description: "Common conjuncts.", generator: "progressive", targetChars: ["If", "q", "1"] },
    { id: "p21", title: "Preeti: Conjuncts 2: त्त क्त (Q Q+m)", description: "Common conjuncts.", generator: "progressive", targetChars: ["Q", "Qm"] },
    { id: "p22", title: "Preeti: Conjuncts 3: द्द द्ध द्य (2 4 B)", description: "Double letters.", generator: "progressive", targetChars: ["2", "4", "B"] },
    { id: "p23", title: "Preeti: Special Combos: रु श्र ब्र हृ (? > a| x)", description: "Special form conjuncts.", generator: "progressive", targetChars: ["?", ">", "a|", "X"] },

    // SYMBOLS, PUNCTUATION & MATRAS
    { id: "p24", title: "Preeti: Matras & Symbols: कँ कु कू (sF s' s\")", description: "Practicing nasal and u-matras with 'ka'.", generator: "progressive", targetChars: ["sF", "s'", "s\""] },
    { id: "p25", title: "Preeti: Punctuation: । , ( . ,)", description: "Danda, comma.", generator: "progressive", targetChars: [".", ","] },
    { id: "p26", title: "Preeti: Symbols & Punctuation: कः कं (sM s+)", description: "Visarga and anusvara.", generator: "progressive", targetChars: ["sM", "s+"] },
    { id: "p27", title: "Preeti: Brackets: ( ) (- _)", description: "Brackets", generator: "progressive", targetChars: ["-", "_"] },

    // NUMBERS
    { id: "p28", title: "Preeti: Numbers: १ २ ३ ४ ५ (Shift+1-5)", description: "Nepali numbers 1-5 (Shift keys).", generator: "progressive", targetChars: ["१", "२", "३", "४", "५"] },
    { id: "p29", title: "Preeti: Numbers: ६ ७ ८ ९ ० (Shift+6-0)", description: "Nepali numbers 6-0 (Shift keys).", generator: "progressive", targetChars: ["६", "७", "८", "९", "०"] },

    { id: "p30", title: "Preeti: Alt Codes 1: ध्र फ् झ् ङ्घ (Alt+0132 Alt+0136 Alt+0137 Alt+0139)", description: "Extended Preeti characters.", generator: "progressive", targetChars: ["ध्र", "फ्", "झ्", "ङ्घ"] },
    { id: "p31", title: "Preeti: Alt Codes 2: – — (Alt+0150 Alt+0151)", description: "Nepali dashes.", generator: "progressive", targetChars: ["–", "—"] },
    { id: "p32", title: "Preeti: Alt Codes 3: ड्ड ऽ द्र ज्ञ् (Alt+0149 Alt+0152 Alt+0155 Alt+0161)", description: "Extended Preeti characters.", generator: "progressive", targetChars: ["ड्ड", "ऽ", "द्र", "ज्ञ्"] },
    { id: "p33", title: "Preeti: Alt Codes 4: द्ध घ् ¥ ट्ट ङ (4 Alt+0163 Alt+0165 Alt+0167 Alt+0170)", description: "Extended Preeti characters.", generator: "progressive", targetChars: ["द्ध", "घ्", "¥", "ट्ट", "ङ"] },
    { id: "p34", title: "Preeti: Alt Codes 5: ड्ढ झ ठ्ठ रू ह्र (Alt+0176 Alt+0180 Alt+0182 Alt+0191 Alt+0197)", description: "Extended Preeti characters.", generator: "progressive", targetChars: ["ड्ढ", "झ", "ठ्ठ", "रू", "ह्र"] },
    { id: "p35", title: "Preeti: Alt Codes 6: ङ्ग न्न ङ्क ङ्ख ॐ (Alt+0203 Alt+0204 Alt+0205 Alt+0206 Alt+0231)", description: "Extended Preeti characters.", generator: "progressive", targetChars: ["ङ्ग", "न्न", "ङ्क", "ङ्ख", "ॐ"] },
    { id: "p36", title: "Preeti: Alt Codes 7: च्य ट्ठ द्म ट्र (Alt+0216 Alt+0221 Alt+0223 Alt+0229)", description: "Extended Preeti characters.", generator: "progressive", targetChars: ["च्य", "ट्ठ", "द्म", "ट्र"] },
    { id: "p37", title: "Preeti: Alt Codes 8: + = / % (Alt+0177 Alt+0214 Alt+0247 Alt+0220)", description: "Mathematical symbols in Preeti.", generator: "progressive", targetChars: ["±", "Ö", "÷", "Ü"] },
    { id: "p38", title: "Preeti: Alt Codes 9: … ; . ! (Alt+0210 Alt+0217 Alt+0222 Alt+0219)", description: "Punctuation marks.", generator: "progressive", targetChars: ["Ò", "Ù", "Þ", "Û"] },
    { id: "p39", title: "Preeti: Alt Codes 10: { } ^ (Alt+0123 Alt+0145 Alt+0171)", description: "Curly braces and typography.", generator: "progressive", targetChars: ["{", "}", "^"] },
    { id: "p40", title: "Preeti: Alt Codes 11: ‘ ’ “ ” (Alt+0133 Alt+0218 Alt+0230 Alt+0198)", description: "Smart quotation marks.", generator: "progressive", targetChars: ["‘", "’", "“", "”"] },

    // MASTERY WORDS AND SENTENCES
    { id: "p41", title: "Preeti: Practice: Basic Vocabulary", description: "High-frequency everyday words.", generator: "bank", wordBank: ["dnfO{", "xfdL", "d", "clxn]", "eO{", "zfvf"] },
    { id: "p42", title: "Preeti: Practice: Intermediate Words", description: "School and learning vocabulary.", generator: "bank", wordBank: ["lzIff", "ljBfyL{", "ljBfno", "lzIffs", "k':tsfn", "g]kfn"] },
    { id: "p43", title: "Preeti: Practice: Professional Vocabulary", description: "Complex words for typists.", generator: "bank", wordBank: ["ljsf;", "cfly{s", "lgsfo", "gLlt", "Joj:yf", "clwsf/"] },
    { id: "p44", title: "Preeti: Mastery: Easy Sentences", description: "Simple, natural sentences.", generator: "bank", wordBank: ["d g]kfnL x'F .", "g]kfn ;'Gb/ 5 .", "xfdL ljBfno hfG5f}F ."] },
    { id: "p45", title: "Preeti: Mastery: Complex Sentences", description: "Advanced text.", generator: "bank", wordBank: ["g]kfn Ps ax'jatLo ax'efiffL b]z xf .", "ljsf; Pj+ ;dGjo gx'g' x/] ultsf] ;d:of xf ."] },
    { id: "p46", title: "Preeti: GODMODE: Speed Trial", description: "Target 50+ WPM.", generator: "bank", wordBank: ["lzIff Pj+ :j:yUtf ;j{sf] clwsf/ xf . ljlw lj1fg ;DaGwtf] 1fg h'g;'s} JolQmsf] cfjZos 5 ."] }
  ],

  unicode: [
    // BASIC CONSONANTS (Velar, Palatal, Retroflex, Dental, Labial)
    { id: "u1", title: "Unicode: Consonants: क ख ग घ ङ (k Shift+K g Shift+G Shift+<)", description: "Velar Consonants.", generator: "progressive", targetChars: ["क", "ख", "ग", "घ", "ङ"] },
    { id: "u2", title: "Unicode: Consonants: च छ ज झ ञ (c Shift+C j Shift+J Shift+Y)", description: "Palatal Consonants.", generator: "progressive", targetChars: ["च", "छ", "ज", "झ", "ञ"] },
    { id: "u3", title: "Unicode: Consonants: ट ठ ड ढ ण (q Shift+Q x Shift+X Shift+N)", description: "Retroflex Consonants.", generator: "progressive", targetChars: ["ट", "ठ", "ड", "ढ", "ण"] },
    { id: "u4", title: "Unicode: Consonants: त थ द ध न (t Shift+T d Shift+D n)", description: "Dental Consonants.", generator: "progressive", targetChars: ["त", "थ", "द", "ध", "न"] },
    { id: "u5", title: "Unicode: Consonants: प फ ब भ म (p Shift+P b Shift+B m)", description: "Labial Consonants.", generator: "progressive", targetChars: ["प", "फ", "ब", "भ", "म"] },

    // SEMI-VOWELS, SIBILANTS & FRICATIVES
    { id: "u6", title: "Unicode: Consonants: य र ल व श (y r l v Shift+S)", description: "Semi-vowels & Palatal Sibilant.", generator: "progressive", targetChars: ["य", "र", "ल", "व", "श"] },
    { id: "u7", title: "Unicode: Consonants: ष स ह (z s h)", description: "Fricatives.", generator: "progressive", targetChars: ["ष", "स", "ह"] },

    // PRIMARY VOWELS
    { id: "u8", title: "Unicode: Vowels: अ आ इ ई (Shift+H Shift+A [ Shift+[)", description: "Primary Vowels.", generator: "progressive", targetChars: ["अ", "आ", "इ", "ई"] },
    { id: "u9", title: "Unicode: Vowels: उ ऊ ऋ (f Shift+F Shift+Z)", description: "Secondary Vowels.", generator: "progressive", targetChars: ["उ", "ऊ", "ऋ"] },
    { id: "u10", title: "Unicode: Vowels: ए ऐ ओ औ (] Shift+] Shift+O Shift+W)", description: "Diphthongs.", generator: "progressive", targetChars: ["ए", "ऐ", "ओ", "औ"] },

    // MATRAS (Vowel Signs)
    { id: "u11", title: "Unicode: Matras: ा ि ी (a i Shift+I)", description: "Aa, i, ii matras.", generator: "progressive", targetChars: ["ा", "ि", "ी"] },
    { id: "u12", title: "Unicode: Matras: ु ू ृ (u Shift+U Shift+R)", description: "u, uu, ri matras.", generator: "progressive", targetChars: ["ु", "ू", "ृ"] },
    { id: "u13", title: "Unicode: Matras: े ै ो ौ (e Shift+E o w)", description: "e, ai, o, au matras.", generator: "progressive", targetChars: ["े", "ै", "ो", "ौ"] },

    // MODIFIERS & NASALS
    { id: "u14", title: "Unicode: Modifiers: ं ः ँ ् ़ (Shift+M Shift+; Shift+V / Shift+.)", description: "Nasal, visarga, candrabindu, halant, nukta.", generator: "progressive", targetChars: ["ं", "ः", "ँ", "्", "़"] },

    // EXPLICIT HALF LETTERS
    { id: "u15", title: "Unicode: Half Letters: ष् ञ् फ् ण् झ् क् (z+/ Shift+Y+/ Shift+P+/ Shift+N+/ Shift+J+/ \\)", description: "Explicit half letters. Note: क् has a dedicated key (\\).", generator: "progressive", targetChars: ["ष्", "ञ्", "फ्", "ण्", "झ्", "क्"] },

    // CONJUNCTS
    { id: "u16", title: "Unicode: Conjuncts 1: क्ष त्र ज्ञ क्र र्क (k+/+z t+/+r u k+/+r r+/+k)", description: "Common Conjuncts.", generator: "progressive", targetChars: ["क्ष", "त्र", "ज्ञ", "क्र", "र्क"] },
    { id: "u17", title: "Unicode: Conjuncts 2: र्य ट्र श्र रु त्त (r+/+/=/y q+/+r Shift+S+/+r ru t+/+t)", description: "Advanced Conjuncts.", generator: "progressive", targetChars: ["र्य", "ट्र", "श्र", "रु", "त्त"] },
    { id: "u18", title: "Unicode: Conjuncts 3: ट्ट ट्ठ ठ्ठ ङ्ग ङ्क (q+/+q q+/+Shift+Q Shift+Q+/+Shift+Q Shift+<+/+g Shift+<+/+k)", description: "Complex Combinations.", generator: "progressive", targetChars: ["ट्ट", "ट्ठ", "ठ्ठ", "ङ्ग", "ङ्क"] },
    { id: "u19", title: "Unicode: Conjuncts 4: द्ध द्व द्द क्क डड्ड ॐ (d+/+Shift+D d+/+v d+/+d k+/+k x+/+x Alt+2384)", description: "Special Conjuncts.", generator: "progressive", targetChars: ["द्ध", "द्व", "द्द", "क्क", "ड्ड", "ॐ"] },

    // NUMBERS & PUNCTUATION
    { id: "u20", title: "Unicode: Basic Punctuation: । , . ? ! ; (. , Shift+> Shift+/ Shift+1 ;)", description: "Standard Nepali punctuation marks.", generator: "progressive", targetChars: ["।", ",", ".", "?", "!", ";"] },
    { id: "u21", title: "Unicode: Brackets & Quotes: ( ) \" ' (Shift+9 Shift+0 Shift+' ')", description: "Brackets and quotation marks.", generator: "progressive", targetChars: ["(", ")", "\"", "'"] },
    { id: "u22", title: "Unicode: Symbols & Math: % + = - / (Shift+5 Alt+43 Alt+61 - Alt+47)", description: "Mathematical and special symbols.", generator: "progressive", targetChars: ["%", "+", "=", "-", "/"] },
    { id: "u23", title: "Unicode: Numbers: ० १ २ ३ ४ ५ ६ ७ ८ ९ (0 1 2 3 4 5 6 7 8 9)", description: "Nepali numbers.", generator: "progressive", targetChars: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"] },

    // MASTERY WORDS AND SENTENCES
    { id: "u24", title: "Unicode: Practice: Beginner Words", description: "Simple words.", generator: "bank", wordBank: NP_WORDS_EASY },
    { id: "u25", title: "Unicode: Practice: Intermediate Words", description: "Medium difficulty words.", generator: "bank", wordBank: NP_WORDS_MED },
    { id: "u26", title: "Unicode: Practice: Advanced Words", description: "Professional vocabulary.", generator: "bank", wordBank: NP_WORDS_ADV },
    { id: "u27", title: "Unicode: Mastery: Easy Sentences", description: "Daily communication.", generator: "bank", wordBank: NP_SENT_EASY },
    { id: "u28", title: "Unicode: Mastery: Complex Sentences", description: "Advanced phrasing.", generator: "bank", wordBank: NP_SENT_MED },
    { id: "u29", title: "Unicode: Professional Mastery: Official Text", description: "Constitutional text.", generator: "bank", wordBank: NP_SENT_ADV }
  ]
};
