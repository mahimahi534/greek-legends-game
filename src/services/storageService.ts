import { PlayerProfile, GameSettings } from '../types/game';

const STORAGE_KEY = 'GREEK_LEGENDS_SAVE_DATA_V1';

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.75,
  reducedMotion: false,
  themeMode: 'auto',
};

const DEFAULT_PROFILE: PlayerProfile = {
  currentLevel: 1,
  maxUnlockedLevel: 1,
  totalXp: 0,
  completedLevels: {},
  unlockedCharacterIds: ['zeus', 'athena'],
  selectedCharacterId: 'zeus',
  settings: DEFAULT_SETTINGS,
};

export const getPlayerRank = (xp: number): { title: string; badge: string } => {
  if (xp >= 50000) return { title: 'Supreme God of Olympus', badge: '👑' };
  if (xp >= 25000) return { title: 'Titan Slayer', badge: '⚡' };
  if (xp >= 12000) return { title: 'Divine Champion', badge: '🏛️' };
  if (xp >= 6000) return { title: 'Hero of Hellas', badge: '🛡️' };
  if (xp >= 2500) return { title: 'Mythic Demigod', badge: '⚔️' };
  if (xp >= 800) return { title: 'Spartan Initiate', badge: '📜' };
  return { title: 'Mortal Seeker', badge: '🌿' };
};

export const loadPlayerProfile = (): PlayerProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
      },
      completedLevels: parsed.completedLevels || {},
      unlockedCharacterIds: parsed.unlockedCharacterIds || ['zeus', 'athena'],
    };
  } catch (e) {
    console.error('Failed to load Greek Legends saved state, using default:', e);
    return DEFAULT_PROFILE;
  }
};

export const savePlayerProfile = (profile: PlayerProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save Greek Legends state:', e);
  }
};

export const clearPlayerProfile = (): PlayerProfile => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear save data:', e);
  }
  return DEFAULT_PROFILE;
};
