export type SymbolType =
  | 'pandora'
  | 'zeus'
  | 'athena'
  | 'pegasus'
  | 'amphora'
  | 'sun'
  | 'temple'
  | 'poseidon';

export type SpecialTileType =
  | 'none'
  | 'lightning_h' // clears row
  | 'lightning_v' // clears col
  | 'pandora_blast' // 3x3 blast
  | 'sun_supernova'; // clears all tiles of matched color

export interface TileData {
  id: string;
  symbol: SymbolType;
  special: SpecialTileType;
  row: number;
  col: number;
  isMatched?: boolean;
  isNew?: boolean;
  isSpecialActivated?: boolean;
}

export interface CellObstacle {
  type: 'marble';
  health: number; // 1 or 2 hits to break
}

export type ObjectiveType = 'score' | 'collect_symbol' | 'clear_marble';

export interface LevelObjective {
  type: ObjectiveType;
  target: number;
  current: number;
  symbol?: SymbolType;
}

export interface LevelConfig {
  levelNumber: number;
  realmName: string;
  realmSub: string;
  themeColor: string;
  bgGradient: string;
  gridRows: number;
  gridCols: number;
  moves: number;
  targetScore: number;
  objectives: LevelObjective[];
  availableSymbols: SymbolType[];
  marbleLayout?: { row: number; col: number; health: number }[];
  starScores: [number, number, number];
}

export interface Character {
  id: string;
  name: string;
  title: string;
  domain: string;
  color: string;
  accentColor: string;
  unlockLevel: number;
  lore: string;
  mythDescription: string;
  quote: string;
  divineBlessing: {
    name: string;
    description: string;
    bonusType: 'lightning_boost' | 'extra_moves' | 'water_score' | 'solar_blast' | 'xp_boost' | 'athena_wisdom';
    bonusValue: number;
  };
  symbolType: SymbolType;
}

export interface LevelProgress {
  stars: number; // 1 to 3
  highScore: number;
  completedAt: string;
}

export interface PlayerProfile {
  currentLevel: number;
  maxUnlockedLevel: number;
  totalXp: number;
  completedLevels: Record<number, LevelProgress>;
  unlockedCharacterIds: string[];
  selectedCharacterId: string;
  settings: GameSettings;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number; // 0 to 1
  reducedMotion: boolean;
  themeMode: 'olympus' | 'atlantis' | 'auto';
}

export type ScreenType = 'menu' | 'map' | 'game' | 'characters' | 'settings';

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}
