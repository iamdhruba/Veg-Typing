import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { useAuthStore } from './useAuthStore';

export const usePracticeStore = create(
  persist(
    (set, get) => ({
      // Progress tracking: { mode: { levelId: { stars: 0, bestWpm: 0, completed: false } } }
      progress: {
        english: {},
        preeti: {},
        unicode: {}
      },
      xp: 0,
      streak: 0,
      lastPracticeDate: null,

      updateProgress: async (mode, levelId, stats) => {
        const { stars, wpm, accuracy } = stats;
        const currentProgress = (get().progress[mode] && get().progress[mode][levelId]) || { stars: 0, bestWpm: 0, completed: false };
        
        const newProgress = {
          ...get().progress,
          [mode]: {
            ...get().progress[mode],
            [levelId]: {
              stars: Math.max(currentProgress.stars, stars),
              bestWpm: Math.max(currentProgress.bestWpm, wpm),
              completed: true,
              lastAccuracy: Math.max(currentProgress.lastAccuracy || 0, accuracy)
            }
          }
        };

        // Award XP: 10 XP per star
        const xpEarned = Math.max(0, (stars - currentProgress.stars) * 10) + 5; // +5 for any completion
        const newXp = get().xp + xpEarned;
        
        set({ progress: newProgress, xp: newXp });
        get().updateStreak();
        
        // Sync with backend if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            await api.put('/auth/progress', {
              xp: newXp,
              streak: get().streak,
              lastPracticeDate: get().lastPracticeDate,
              progress: newProgress
            });
          } catch (e) {
            console.error('Failed to sync progress:', e);
          }
        }
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const last = get().lastPracticeDate;
        
        if (last === today) return;

        const lastDate = last ? new Date(last) : null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (!lastDate || lastDate.toDateString() === yesterday.toDateString()) {
          set({ streak: get().streak + 1, lastPracticeDate: today });
        } else {
          set({ streak: 1, lastPracticeDate: today });
        }
      },

      loadFromUser: (user) => {
        if (user && user.curriculumProgress) {
          set({
            progress: user.curriculumProgress,
            xp: user.xp || 0,
            streak: user.streak || 0,
            lastPracticeDate: user.lastPracticeDate
          });
        }
      }
    }),
    {
      name: 'practice-storage-v3',
    }
  )
);
