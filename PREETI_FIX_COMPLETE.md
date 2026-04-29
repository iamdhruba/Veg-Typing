# Preeti Mode - Complete Fix Summary

## Root Cause
Preeti is a **legacy ASCII-based font**, not Unicode. It maps ASCII characters (like 's', 'k', 'a') to Nepali glyphs visually. The system was incorrectly treating it as Unicode.

## Issues Fixed

### 1. ✅ Font File Support
- **File**: `frontend/src/index.css`
- **Fix**: Added support for both `.otf` and `.ttf` font formats
- Font file location confirmed: `frontend/public/fonts/Preeti.otf`

### 2. ✅ Keyboard Mappings
- **File**: `frontend/src/data/keyMappings.js`
- **Fix**: Reverted PREETI_FULL_REF to use ASCII characters (s, k, a, etc.) instead of Unicode
- Now matches the ASCII encoding used in PREETI_WORDS

### 3. ✅ Text Splitting Logic
- **Files**: 
  - `frontend/src/hooks/useTypingEngine.js`
  - `frontend/src/components/TypingBox.jsx`
- **Fix**: Added language parameter to splitGraphemes function
- Preeti now uses simple character splitting (ASCII) instead of Unicode grapheme segmentation

### 4. ✅ Virtual Keyboard Display
- **Files**:
  - `frontend/src/index.css` - Added `.keyboard-preeti` class
  - `frontend/src/components/practice/VirtualKeyboard.jsx` - Applied Preeti font to keyboard
- **Fix**: Virtual keyboard now displays ASCII characters with Preeti font, showing Nepali glyphs

## How Preeti Works

```
User types: 's'  →  Stored as: 's'  →  Preeti font renders: 'क'
User types: 'k'  →  Stored as: 'k'  →  Preeti font renders: 'प'
User types: 'a'  →  Stored as: 'a'  →  Preeti font renders: 'ब'
```

The word "g]kfn" in the word list is stored as ASCII but rendered as "नेपाल" by the Preeti font.

## Testing Steps

1. **Restart dev server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Preeti mode**:
   - Select "Preeti" language mode
   - Text should display in Nepali characters (rendered by Preeti font)
   - Virtual keyboard should show Nepali characters on keys
   - Typing 's' should produce 'क', 'k' should produce 'प', etc.
   - Keyboard highlighting should work correctly

3. **Verify**:
   - Words appear in Nepali script
   - Virtual keyboard guides you to the correct keys
   - Typing matches the displayed characters
   - WPM and accuracy tracking works

## Key Differences: Preeti vs Unicode

| Aspect | Preeti | Unicode |
|--------|--------|---------|
| Encoding | ASCII | Unicode (U+0900-U+097F) |
| Storage | 's', 'k', 'a' | 'क', 'प', 'ब' |
| Font Required | Yes (Preeti.otf) | No (system fonts) |
| Splitting | Character-based | Grapheme-based |
| Portability | Low (needs font) | High (universal) |

## Files Modified

1. `frontend/src/index.css` - Font support + keyboard styling
2. `frontend/src/data/keyMappings.js` - ASCII mappings
3. `frontend/src/hooks/useTypingEngine.js` - Language-aware splitting
4. `frontend/src/components/TypingBox.jsx` - Language-aware splitting
5. `frontend/src/components/practice/VirtualKeyboard.jsx` - Preeti font class

All changes are backward compatible with Unicode, Romanized, and English modes.
