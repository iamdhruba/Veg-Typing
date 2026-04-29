import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACHIEVEMENTS } from '../utils/achievements';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('user');
        set({ user: null });
      },
      checkAchievements: async (stats) => {
        const user = get().user;
        if (!user) return;

        for (const achievement of ACHIEVEMENTS) {
          // Skip if already unlocked
          if (user.achievements?.some(a => a.id === achievement.id)) continue;

          if (achievement.condition(stats)) {
            try {
              const res = await api.post('/auth/achievements', { achievementId: achievement.id });
              set({ user: res.data });
              // You could trigger a toast notification here
              console.log(`Unlocked achievement: ${achievement.title}`);
            } catch (error) {
              console.error('Failed to grant achievement:', error);
            }
          }
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
