import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTypingStore = create(
  persist(
    (set) => ({
      language: 'english',
      mode: 'time',
      duration: 30,
      soundEnabled: true,
      customText: '',
      caretStyle: 'line', // 'line', 'block', 'underline'
      fontSize: 'text-3xl', // 'text-2xl', 'text-3xl', 'text-4xl'
      showKeyboard: false,
      result: null,
      
      setLanguage: (lang) => set({ language: lang }),
      setMode: (mode) => set({ mode }),
      setDuration: (duration) => set({ duration }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setCustomText: (text) => set({ customText: text }),
      setCaretStyle: (style) => set({ caretStyle: style }),
      setFontSize: (size) => set({ fontSize: size }),
      setShowKeyboard: (enabled) => set({ showKeyboard: enabled }),
      setResult: (res) => set({ result: res }),
    }),
    {
      name: 'typing-settings',
    }
  )
);
