export const ACHIEVEMENTS = [
  {
    id: 'speed_demon_50',
    title: 'Speed Demon I',
    description: 'Reach 50 WPM in any language',
    icon: '⚡',
    condition: (stats) => stats.wpm >= 50,
  },
  {
    id: 'speed_demon_80',
    title: 'Speed Demon II',
    description: 'Reach 80 WPM in any language',
    icon: '🔥',
    condition: (stats) => stats.wpm >= 80,
  },
  {
    id: 'speed_demon_100',
    title: 'Speed Demon III',
    description: 'Reach 100 WPM in any language',
    icon: '🚀',
    condition: (stats) => stats.wpm >= 100,
  },
  {
    id: 'accuracy_king',
    title: 'Accuracy King',
    description: 'Achieve 100% accuracy on a 30s+ test',
    icon: '🎯',
    condition: (stats) => stats.accuracy === 100 && stats.duration >= 30,
  },
  {
    id: 'marathoner',
    title: 'Marathoner',
    description: 'Complete a 120s typing test',
    icon: '🏃',
    condition: (stats) => stats.duration >= 120,
  },
  {
    id: 'consistent_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day practice streak',
    icon: '📅',
    condition: (stats) => stats.streak >= 7,
  },
  {
    id: 'preeti_pro',
    title: 'Preeti Professional',
    description: 'Complete 20 levels in Preeti curriculum',
    icon: '⌨️',
    condition: (stats) => stats.preetiLevels >= 20,
  },
  {
    id: 'race_winner',
    title: 'Race Winner',
    description: 'Win your first multiplayer race',
    icon: '🏆',
    condition: (stats) => stats.racePosition === 1,
  }
];
