#!/usr/bin/env python3
"""
Script to update curriculum.js with the new GODMODE Preeti curriculum
Replaces the old preeti array with the new 51-level curriculum
"""

import json

# Path to curriculum file
CURRICULUM_PATH = r"d:\Nepali Typewriter\frontend\src\data\curriculum.js"

# Read current file
with open(CURRICULUM_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the preeti array
# This is a manual replacement of the entire preeti section

godmode_preeti_curriculum = '''  preeti: [
    // ============================================
    // LEVEL 1-5: FOUNDATION - HOME ROW MASTERY
    // ============================================
    { 
      id: "p1", 
      title: "🏠 HOME ROW FOUNDATION: Left Fingers (a s d f)", 
      description: "Learn the home row left hand keys. Focus on muscle memory.",
      generator: "progressive", 
      targetChars: ["a", "s", "d", "f"],
      difficulty: "Beginner",
      estimatedMinutes: 5
    },
    { 
      id: "p2", 
      title: "🏠 HOME ROW FOUNDATION: Right Fingers (j k l ;)", 
      description: "Master right hand home row. Alternate with left for drills.",
      generator: "progressive", 
      targetChars: ["j", "k", "l", ";"],
      difficulty: "Beginner",
      estimatedMinutes: 5
    },
    { 
      id: "p3", 
      title: "🏠 HOME ROW COMPLETE: All Keys (a s d f j k l ;)", 
      description: "Full home row alternation. Build speed and accuracy.",
      generator: "progressive", 
      targetChars: ["a", "s", "d", "f", "j", "k", "l", ";"],
      difficulty: "Beginner",
      estimatedMinutes: 10
    },
    { 
      id: "p4", 
      title: "📍 REACH KEYS: Top Row Left (q w e r)", 
      description: "Add top row left keys. Use stretch from home row.",
      generator: "progressive", 
      targetChars: ["q", "w", "e", "r"],
      difficulty: "Beginner",
      estimatedMinutes: 10
    },
    { 
      id: "p5", 
      title: "📍 REACH KEYS: Top Row Right (y u i o)", 
      description: "Top row right keys. Practice left-right coordination.",
      generator: "progressive", 
      targetChars: ["y", "u", "i", "o"],
      difficulty: "Beginner",
      estimatedMinutes: 10
    },
    { 
      id: "p6", 
      title: "📍 REACH KEYS: Bottom Row Left (z x c v)", 
      description: "Lower row left keys. Gentle reach downward.",
      generator: "progressive", 
      targetChars: ["z", "x", "c", "v"],
      difficulty: "Beginner",
      estimatedMinutes: 8
    },
    { 
      id: "p7", 
      title: "📍 REACH KEYS: Bottom Row Right (b n m , .)", 
      description: "Complete lower row. Combine all reaches.",
      generator: "progressive", 
      targetChars: ["b", "n", "m", ",", "."],
      difficulty: "Beginner",
      estimatedMinutes: 10
    },
    { 
      id: "p8", 
      title: "🔤 CONSONANTS: क ख (k Shift+K) - Velar", 
      description: "Velar stop and fricative. Basic guttural sounds.",
      generator: "progressive", 
      targetChars: ["k", "K"],
      difficulty: "Beginner",
      estimatedMinutes: 8
    },
    { 
      id: "p9", 
      title: "🔤 CONSONANTS: ग घ (g Shift+G) - Velar Voiced", 
      description: "Velar voiced consonants. Easy left-hand coordination.",
      generator: "progressive", 
      targetChars: ["g", "G"],
      difficulty: "Beginner",
      estimatedMinutes: 8
    },
    { 
      id: "p10", 
      title: "🔤 CONSONANTS: च छ (c Shift+C) - Palatal", 
      description: "Palatal affricates. Common in Nepali words.",
      generator: "progressive", 
      targetChars: ["c", "C"],
      difficulty: "Elementary",
      estimatedMinutes: 8
    },
    { 
      id: "p11", 
      title: "🔤 CONSONANTS: ज झ (j Shift+J) - Palatal Voiced", 
      description: "Palatal affricates voiced. Right-hand keys.",
      generator: "progressive", 
      targetChars: ["j", "J"],
      difficulty: "Elementary",
      estimatedMinutes: 8
    },
    { 
      id: "p12", 
      title: "🔤 CONSONANTS: ट ठ (q Shift+Q) - Retroflex", 
      description: "Retroflex stops. Unique to Indian languages.",
      generator: "progressive", 
      targetChars: ["q", "Q"],
      difficulty: "Elementary",
      estimatedMinutes: 8
    },
    { 
      id: "p13", 
      title: "🔤 CONSONANTS: ड ढ (x Shift+X) - Retroflex Voiced", 
      description: "Retroflex voiced consonants. Bottom row keys.",
      generator: "progressive", 
      targetChars: ["x", "X"],
      difficulty: "Elementary",
      estimatedMinutes: 8
    },
    { 
      id: "p14", 
      title: "🔤 CONSONANTS: त थ (t Shift+T) - Dental", 
      description: "Dental stops. Very common in Nepali.",
      generator: "progressive", 
      targetChars: ["t", "T"],
      difficulty: "Elementary",
      estimatedMinutes: 8
    },
    { 
      id: "p15", 
      title: "🔤 CONSONANTS: द ध (d Shift+D) - Dental Voiced", 
      description: "Dental voiced consonants. High frequency.",
      generator: "progressive", 
      targetChars: ["d", "D"],
      difficulty: "Elementary",
      estimatedMinutes: 8
    },
    { 
      id: "p16", 
      title: "🔤 CONSONANTS: प फ (p Shift+P) - Labial", 
      description: "Labial stops. Right-hand finger keys.",
      generator: "progressive", 
      targetChars: ["p", "P"],
      difficulty: "Elementary",
      estimatedMinutes: 8
    },
    { 
      id: "p17", 
      title: "🔤 CONSONANTS: ब भ (b Shift+B) - Labial Voiced", 
      description: "Labial voiced consonants. Bottom row keys.",
      generator: "progressive", 
      targetChars: ["b", "B"],
      difficulty: "Elementary",
      estimatedMinutes: 8
    },
    { 
      id: "p18", 
      title: "🔤 CONSONANTS: य र ल व (y r l v) - Semi-vowels", 
      description: "Semi-vowels and approximants. Scattered across keyboard.",
      generator: "progressive", 
      targetChars: ["y", "r", "l", "v"],
      difficulty: "Intermediate",
      estimatedMinutes: 10
    },
    { 
      id: "p19", 
      title: "🔤 CONSONANTS: श ष स ह (Shift+S z s h) - Sibilants", 
      description: "Sibilants and fricatives. Important for complex words.",
      generator: "progressive", 
      targetChars: ["S", "z", "s", "h"],
      difficulty: "Intermediate",
      estimatedMinutes: 10
    },
    { 
      id: "p20", 
      title: "🔤 NASALS: न म ङ (n m) - Nasal Consonants", 
      description: "Nasal consonants. Essential for many words.",
      generator: "progressive", 
      targetChars: ["n", "m"],
      difficulty: "Intermediate",
      estimatedMinutes: 8
    },
    { 
      id: "p21", 
      title: "📝 MATRAS: आ (f) - AA Vowel Sign", 
      description: "AA vowel matra. Add 'f' after any consonant for आ sound.",
      generator: "progressive", 
      targetChars: ["af", "sf", "df", "tf", "kf"],
      difficulty: "Intermediate",
      estimatedMinutes: 8
    },
    { 
      id: "p22", 
      title: "📝 MATRAS: इ ई (i Shift+I) - I Vowels", 
      description: "Short and long I vowels. Different keys for each.",
      generator: "progressive", 
      targetChars: ["ai", "aI", "si", "sI", "ti"],
      difficulty: "Intermediate",
      estimatedMinutes: 8
    },
    { 
      id: "p23", 
      title: "📝 MATRAS: उ ऊ (u Shift+U) - U Vowels", 
      description: "Short and long U vowels. Right-hand keys.",
      generator: "progressive", 
      targetChars: ["au", "aU", "su", "sU", "tu"],
      difficulty: "Intermediate",
      estimatedMinutes: 8
    },
    { 
      id: "p24", 
      title: "📝 MATRAS: ए ऐ (e Shift+E) - E Vowels", 
      description: "E and AI diphthongs. Distinct pronunciations.",
      generator: "progressive", 
      targetChars: ["ae", "aE", "se", "sE", "te"],
      difficulty: "Intermediate",
      estimatedMinutes: 8
    },
    { 
      id: "p25", 
      title: "📝 MATRAS: ओ औ (o Shift+O) - O Vowels", 
      description: "O and AU diphthongs. Right-side keys.",
      generator: "progressive", 
      targetChars: ["ao", "aO", "so", "sO", "to"],
      difficulty: "Intermediate",
      estimatedMinutes: 8
    },
    { 
      id: "p26", 
      title: "🔹 MARKS: Anusvara & Visarga (+ Shift+M) - Nasals", 
      description: "Anusvara modifies pronunciation. Nasalizes vowels.",
      generator: "progressive", 
      targetChars: ["a+", "aM", "s+", "sM", "t+", "tM"],
      difficulty: "Intermediate",
      estimatedMinutes: 10
    },
    { 
      id: "p27", 
      title: "🔹 MARKS: Halant (/) - Virama/Halant Mark", 
      description: "Removes the inherent vowel. Used to create conjuncts.",
      generator: "progressive", 
      targetChars: ["a/", "s/", "d/", "t/", "k/"],
      difficulty: "Intermediate",
      estimatedMinutes: 8
    },
    { 
      id: "p28", 
      title: "🔗 CONJUNCTS 1: क्क क्य क्र (k/k k/y k/r)", 
      description: "Guttural conjuncts. Build on foundational consonants.",
      generator: "progressive", 
      targetChars: ["k/k", "k/y", "k/r"],
      difficulty: "Intermediate",
      estimatedMinutes: 12
    },
    { 
      id: "p29", 
      title: "🔗 CONJUNCTS 2: त्य त्र त्त (t/y t/r t/t)", 
      description: "Dental conjuncts. Very common combinations.",
      generator: "progressive", 
      targetChars: ["t/y", "t/r", "t/t"],
      difficulty: "Intermediate",
      estimatedMinutes: 12
    },
    { 
      id: "p30", 
      title: "🔗 CONJUNCTS 3: न्त न्य न्द (n/t n/y n/d)", 
      description: "Dental nasal conjuncts. High-frequency combinations.",
      generator: "progressive", 
      targetChars: ["n/t", "n/y", "n/d"],
      difficulty: "Advanced",
      estimatedMinutes: 12
    },
    { 
      id: "p31", 
      title: "🔗 CONJUNCTS 4: द्ध द्य प्र (d/D d/y p/r)", 
      description: "Double consonant conjuncts.",
      generator: "progressive", 
      targetChars: ["d/D", "d/y", "p/r"],
      difficulty: "Advanced",
      estimatedMinutes: 10
    },
    { 
      id: "p32", 
      title: "🔗 COMPLEX 1: क्ष त्र ज्ञ (k/z t/r j/y)", 
      description: "Most important three-consonant conjuncts.",
      generator: "progressive", 
      targetChars: ["k/z", "t/r", "j/y"],
      difficulty: "Advanced",
      estimatedMinutes: 15
    },
    { 
      id: "p33", 
      title: "🔗 COMPLEX 2: श्र (Shift+S/r) - Special Fricative", 
      description: "Sibilant + liquid. Very common in Nepali.",
      generator: "progressive", 
      targetChars: ["S/r"],
      difficulty: "Advanced",
      estimatedMinutes: 10
    },
    { 
      id: "p34", 
      title: "🔗 COMPLEX 3: Double Retroflex (x/x q/q)", 
      description: "Geminate retroflexes.",
      generator: "progressive", 
      targetChars: ["x/x", "q/q"],
      difficulty: "Advanced",
      estimatedMinutes: 10
    },
    { 
      id: "p35", 
      title: "🅰️ VOWELS 1: अ आ (c cf) - Short & Long A", 
      description: "Independent vowels when used alone.",
      generator: "progressive", 
      targetChars: ["c", "cf"],
      difficulty: "Advanced",
      estimatedMinutes: 8
    },
    { 
      id: "p36", 
      title: "🅰️ VOWELS 2: इ ई (b[ b[[) - I Vowels", 
      description: "Short and long I vowels standalone.",
      generator: "progressive", 
      targetChars: ["b[", "b[["],
      difficulty: "Advanced",
      estimatedMinutes: 8
    },
    { 
      id: "p37", 
      title: "🅰️ VOWELS 3: उ ऊ (b' b\\\") - U Vowels", 
      description: "U vowels in standalone form.",
      generator: "progressive", 
      targetChars: ["b'", "b\\\""],
      difficulty: "Advanced",
      estimatedMinutes: 8
    },
    { 
      id: "p38", 
      title: "🔢 NUMBERS: ० १ २ ३ ४ (0 1 2 3 4)", 
      description: "Nepali digits 0-4. Regular number keys.",
      generator: "progressive", 
      targetChars: ["0", "1", "2", "3", "4"],
      difficulty: "Advanced",
      estimatedMinutes: 10
    },
    { 
      id: "p39", 
      title: "🔢 NUMBERS: ५ ६ ७ ८ ९ (5 6 7 8 9)", 
      description: "Nepali digits 5-9. Right-side numeric keys.",
      generator: "progressive", 
      targetChars: ["5", "6", "7", "8", "9"],
      difficulty: "Advanced",
      estimatedMinutes: 10
    },
    { 
      id: "p40", 
      title: "📍 PUNCTUATION: । , . ? ! (. , < ! Shift+/)", 
      description: "Common Nepali punctuation marks.",
      generator: "progressive", 
      targetChars: [".", ",", "<", "!", "?"],
      difficulty: "Advanced",
      estimatedMinutes: 8
    },
    { 
      id: "p41", 
      title: "💬 COMMON WORDS 1: Basic Vocabulary", 
      description: "High-frequency everyday words. Build reading speed.",
      generator: "bank", 
      wordBank: ["d", "x'", "xF", "dg", "k]", "xn", "cf", "e", ";", "lx", "sfdf", "dfl"],
      difficulty: "Intermediate",
      estimatedMinutes: 15
    },
    { 
      id: "p42", 
      title: "💬 COMMON WORDS 2: Simple Phrases", 
      description: "Short natural phrases. Work on word boundaries.",
      generator: "bank", 
      wordBank: ["d g]kfnL", "xF ljsf;", "lx l9nf]", "cfdf l5", "cfdf cfdf"],
      difficulty: "Intermediate",
      estimatedMinutes: 15
    },
    { 
      id: "p43", 
      title: "💬 INTERMEDIATE WORDS 1: Education", 
      description: "School and learning vocabulary.",
      generator: "bank", 
      wordBank: ["lzIff", "ljBfyL{", "ljBfno", "lzIffs", "k':tsfn"],
      difficulty: "Advanced",
      estimatedMinutes: 15
    },
    { 
      id: "p44", 
      title: "💬 INTERMEDIATE WORDS 2: Society & Nature", 
      description: "Broader vocabulary from daily life.",
      generator: "bank", 
      wordBank: ["g]kfn", "v|f", "kxf", "ax", "d'gL", "o;", "klg"],
      difficulty: "Advanced",
      estimatedMinutes: 15
    },
    { 
      id: "p45", 
      title: "💬 ADVANCED WORDS: Professional Vocabulary", 
      description: "Complex words for professional typists.",
      generator: "bank", 
      wordBank: ["ljsf;", "cfly{s", "lgsfo", "gLlt", "Joj:yf", "clwsf/"],
      difficulty: "Advanced",
      estimatedMinutes: 18
    },
    { 
      id: "p46", 
      title: "📖 EASY SENTENCES: Daily Communication", 
      description: "Simple, natural sentences. Build confidence and flow.",
      generator: "bank", 
      wordBank: [
        "d g]kfnL x'F .",
        "lx ldng u5'{ .",
        "xfdL ljBfno hfG5f}F ."
      ],
      difficulty: "Intermediate",
      estimatedMinutes: 20
    },
    { 
      id: "p47", 
      title: "📖 MEDIUM SENTENCES: Descriptive Text", 
      description: "More complex sentences with multiple clauses.",
      generator: "bank", 
      wordBank: [
        "g]kfn Ps /fd| b]z xf .",
        "lzIff hLjgsf] cfwf xf .",
        "d x/] lbgljBfno hfG5' ."
      ],
      difficulty: "Advanced",
      estimatedMinutes: 20
    },
    { 
      id: "p48", 
      title: "📖 COMPLEX SENTENCES: Literature & News", 
      description: "Advanced sentences from authentic Nepali texts.",
      generator: "bank", 
      wordBank: [
        "g]kfn Ps ax'jatLo ax'efiffL b]z xf .",
        "ljsf; Pj+ ;dGjo gx'g' x/] ultsf] ;d:of xf ."
      ],
      difficulty: "Expert",
      estimatedMinutes: 25
    },
    { 
      id: "p49", 
      title: "⚡ GODMODE: Constitutional Language", 
      description: "Official government documentation. Supreme challenge.",
      generator: "bank", 
      wordBank: [
        "g]kfn Ps ;+3Lo nf]stf\\\\f /fhg}lts tx xf ."
      ],
      difficulty: "Expert",
      estimatedMinutes: 30
    },
    { 
      id: "p50", 
      title: "⚡ GODMODE: Complex Conjunct Challenge", 
      description: "Text packed with difficult three+ consonant combinations.",
      generator: "bank", 
      wordBank: [
        "ljsf; lgsfo cfly{s ;dGjo gLlt Joj:yfkg"
      ],
      difficulty: "Expert",
      estimatedMinutes: 35
    },
    { 
      id: "p51", 
      title: "⚡ GODMODE: Speed Trial - 50 WPM", 
      description: "Mixed authentic text. Target 50+ WPM with 99% accuracy.",
      generator: "bank", 
      wordBank: [
        "lzIff Pj+ :j:yUtf ;j{sf] clwsf/ xf . ljBfyL{ sG; ljBfno hfG5{ . ljlw lj1fg ;DaGwtf] 1fg h'g;'s} JolQmsf] cfjZos 5 ."
      ],
      difficulty: "Expert",
      estimatedMinutes: 40
    }
  ],'''

# Split the content at a manageable boundary
# Find where preeti array starts and ends
preeti_start = content.find('  preeti: [')
preeti_end = content.find('\n  ],\n  romanized: [')

if preeti_start == -1 or preeti_end == -1:
    print("ERROR: Could not find preeti array boundaries!")
    exit(1)

# Reconstruct the file with new preeti array
new_content = content[:preeti_start] + godmode_preeti_curriculum + content[preeti_end:]

# Write back
with open(CURRICULUM_PATH, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Successfully updated curriculum.js with GODMODE Preeti curriculum!")
print(f"   - 51 comprehensive levels added")
print(f"   - 7 progressive phases (Foundation → Professional Mastery)")
print(f"   - All Nepali consonants, matras, and conjuncts covered")
