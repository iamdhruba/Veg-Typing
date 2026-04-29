import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEMES = {
  obsidian: {
    '--background': '#121414',
    '--on-background': '#e3e2e2',
    '--primary': '#D30026',
    '--primary-rgb': '211, 0, 38',
    '--error': '#ff5252',
    '--correct': '#4ade80',
    '--surface': '#121414',
    '--surface-container': '#1e2020',
    '--surface-container-low': '#1a1c1c',
    '--surface-container-high': '#292a2a',
    '--outline': '#696868',
    '--on-surface': '#e3e2e2',
  },
  midas: {
    '--background': '#0a0a0a',
    '--on-background': '#fdfdfd',
    '--primary': '#f59e0b',
    '--primary-rgb': '245, 158, 11',
    '--error': '#ef4444',
    '--correct': '#10b981',
    '--surface': '#121212',
    '--surface-container': '#1a1a1a',
    '--surface-container-low': '#141414',
    '--surface-container-high': '#242424',
    '--outline': '#3d3d3d',
    '--on-surface': '#fdfdfd',
  },
  emerald: {
    '--background': '#060d0b',
    '--on-background': '#ccffe8',
    '--primary': '#00d68a',
    '--primary-rgb': '0, 214, 138',
    '--error': '#ff5f52',
    '--correct': '#34d399',
    '--surface': '#0a1412',
    '--surface-container': '#0f1f1b',
    '--surface-container-low': '#0c1916',
    '--surface-container-high': '#152b24',
    '--outline': '#1a4a38',
    '--on-surface': '#b3f5d8',
  },
  midnight: {
    '--background': '#0a0b10',
    '--on-background': '#cdd8f0',
    '--primary': '#4e9af1',
    '--primary-rgb': '78, 154, 241',
    '--error': '#f87171',
    '--correct': '#60a5fa',
    '--surface': '#0f121a',
    '--surface-container': '#161b26',
    '--surface-container-low': '#121721',
    '--surface-container-high': '#1e2533',
    '--outline': '#2a3a5e',
    '--on-surface': '#c0ccdf',
  },
  light: {
    '--background': '#ffffff',
    '--on-background': '#0f172a',
    '--primary': '#d30026',
    '--primary-rgb': '211, 0, 38',
    '--error': '#e11d48',
    '--correct': '#16a34a',
    '--surface': '#f8fafc',
    '--surface-container': '#f1f5f9',
    '--surface-container-low': '#f8fafc',
    '--surface-container-high': '#e2e8f0',
    '--outline': '#cbd5e1',
    '--on-surface': '#0f172a',
  },
};

function applyTheme(themeId) {
  const vars = THEMES[themeId] || THEMES.obsidian;
  const css = `:root { ${Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join(' ')} }`;
  let el = document.getElementById('veg-theme');
  if (!el) {
    el = document.createElement('style');
    el.id = 'veg-theme';
    document.head.appendChild(el);
  }
  el.textContent = css;
}

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (themeId) => {
        set({ theme: themeId });
        applyTheme(themeId);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

export { applyTheme };
