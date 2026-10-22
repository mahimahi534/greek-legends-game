import { LevelConfig, SymbolType, LevelObjective } from '../types/game';

interface RealmInfo {
  name: string;
  sub: string;
  themeColor: string;
  bgGradient: string;
  primarySymbols: SymbolType[];
}

export const REALMS: RealmInfo[] = [
  {
    name: 'Mount Olympus',
    sub: 'The Golden Peak of the Gods',
    themeColor: '#FFD700',
    bgGradient: 'from-[#1E1B4B] via-[#0F172A] to-[#3B0764]',
    primarySymbols: ['zeus', 'athena', 'temple', 'sun', 'amphora'],
  },
  {
    name: 'Athens Acropolis',
    sub: 'Citadel of Wisdom & Parthenon',
    themeColor: '#38BDF8',
    bgGradient: 'from-[#082F49] via-[#0F172A] to-[#1E3A8A]',
    primarySymbols: ['athena', 'temple', 'amphora', 'pandora', 'sun'],
  },
  {
    name: 'Aegean Sunken Atlantis',
    sub: 'Poseidon’s Fathomless Palace',
    themeColor: '#00CED1',
    bgGradient: 'from-[#042F2E] via-[#083344] to-[#071F38]',
    primarySymbols: ['poseidon', 'amphora', 'pegasus', 'zeus', 'temple'],
  },
  {
    name: 'Sanctuary of Delphi',
    sub: 'The Prophetic Temple of the Sun',
    themeColor: '#F59E0B',
    bgGradient: 'from-[#451A03] via-[#1C1917] to-[#292524]',
    primarySymbols: ['sun', 'athena', 'amphora', 'pandora', 'temple'],
  },
  {
    name: 'Underworld of Hades',
    sub: 'River Styx & The Asphodel Meadows',
    themeColor: '#A855F7',
    bgGradient: 'from-[#180828] via-[#090514] to-[#3B0764]',
    primarySymbols: ['pandora', 'amphora', 'temple', 'zeus', 'poseidon'],
  },
  {
    name: 'Island of Crete',
    sub: 'The Legendary Daedalian Labyrinth',
    themeColor: '#EA580C',
    bgGradient: 'from-[#3C1004] via-[#180903] to-[#451A03]',
    primarySymbols: ['temple', 'amphora', 'zeus', 'pegasus', 'sun'],
  },
  {
    name: 'Colossus of Rhodes',
    sub: 'The Radiant Harbor of Helios',
    themeColor: '#EAB308',
    bgGradient: 'from-[#422006] via-[#1E293B] to-[#1E3A8A]',
    primarySymbols: ['sun', 'poseidon', 'temple', 'amphora', 'zeus'],
  },
  {
    name: 'Mount Cithaeron',
    sub: 'Trials of Herculean Valor',
    themeColor: '#DC2626',
    bgGradient: 'from-[#450A0A] via-[#1C1917] to-[#2E1065]',
    primarySymbols: ['amphora', 'zeus', 'athena', 'temple', 'pegasus'],
  },
  {
    name: 'Sanctum of Sarpedon',
    sub: 'Medusa’s Petrified Sanctuary',
    themeColor: '#10B981',
    bgGradient: 'from-[#022C22] via-[#064E3B] to-[#021A14]',
    primarySymbols: ['temple', 'pandora', 'amphora', 'athena', 'sun'],
  },
  {
    name: 'The Celestial Zenith',
    sub: 'Throne of the Supreme God',
    themeColor: '#F43F5E',
    bgGradient: 'from-[#2B0938] via-[#0B132B] to-[#1C0522]',
    primarySymbols: ['zeus', 'pegasus', 'sun', 'poseidon', 'athena', 'pandora'],
  },
];

const ALL_SYMBOLS: SymbolType[] = [
  'zeus',
  'athena',
  'poseidon',
  'sun',
  'amphora',
  'pandora',
  'temple',
  'pegasus',
];

export const getRealmForLevel = (level: number): RealmInfo => {
  const boundedLevel = Math.max(1, Math.min(1000, level));
  const realmIndex = Math.floor((boundedLevel - 1) / 100);
  return REALMS[Math.min(realmIndex, REALMS.length - 1)];
};

export const getLevelConfig = (levelNumber: number): LevelConfig => {
  const clampedLevel = Math.max(1, Math.min(1000, levelNumber));
  const realm = getRealmForLevel(clampedLevel);

  // Deterministic seed generation based on level
  const pseudoSeed = (clampedLevel * 9301 + 49297) % 233280;
  const rand = (max: number) => {
    return Math.floor(((pseudoSeed * 37 + 101) % 10000 / 10000) * max);
  };

  const gridRows = clampedLevel <= 5 ? 7 : 8;
  const gridCols = clampedLevel <= 5 ? 7 : 8;

  // Active symbol pool: 5 symbols for early levels, 6 for intermediate, 7 for high levels
  let poolSize = 5;
  if (clampedLevel > 15) poolSize = 6;
  if (clampedLevel > 100) poolSize = 7;
  if (clampedLevel > 400) poolSize = 8;

  const availableSymbols = ALL_SYMBOLS.slice(0, poolSize);

  // Moves calculation: balanced between 20 and 30 moves
  const moves = Math.max(18, Math.min(32, 28 - Math.floor(clampedLevel / 80) + (clampedLevel % 4)));

  // Target score
  const baseScore = 1200 + clampedLevel * 250 + Math.floor(Math.pow(clampedLevel, 1.15) * 15);
  const targetScore = Math.round(baseScore / 100) * 100;

  // Objectives
  const objectives: LevelObjective[] = [];

  // Every level has score objective
  objectives.push({
    type: 'score',
    target: targetScore,
    current: 0,
  });

  // Symbol collection objective
  const primarySym = availableSymbols[rand(availableSymbols.length)];
  const symCount = Math.min(45, 12 + Math.floor(clampedLevel / 20) * 2 + (clampedLevel % 5));
  objectives.push({
    type: 'collect_symbol',
    symbol: primarySym,
    target: symCount,
    current: 0,
  });

  // Secondary symbol collection or Marble obstacle starting from level 3
  const marbleLayout: { row: number; col: number; health: number }[] = [];

  if (clampedLevel >= 3) {
    // Generate marble stone blocks
    const marbleCount = Math.min(16, 4 + Math.floor(clampedLevel / 25) * 2);
    // Symmetric or edge placement
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const isCorner = (r === 0 || r === gridRows - 1) && (c === 0 || c === gridCols - 1);
        const isSubCorner = (r === 1 || r === gridRows - 2) && (c === 1 || c === gridCols - 2);
        const isCenter = r >= 3 && r <= 4 && c >= 3 && c <= 4;

        if (clampedLevel % 3 === 0 && isCorner && marbleLayout.length < marbleCount) {
          marbleLayout.push({ row: r, col: c, health: clampedLevel > 50 ? 2 : 1 });
        } else if (clampedLevel % 3 === 1 && isSubCorner && marbleLayout.length < marbleCount) {
          marbleLayout.push({ row: r, col: c, health: 1 });
        } else if (clampedLevel % 3 === 2 && isCenter && marbleLayout.length < marbleCount) {
          marbleLayout.push({ row: r, col: c, health: clampedLevel > 150 ? 2 : 1 });
        }
      }
    }

    if (marbleLayout.length > 0) {
      objectives.push({
        type: 'clear_marble',
        target: marbleLayout.length,
        current: 0,
      });
    } else {
      // If no marble, add secondary symbol
      const secondSym = availableSymbols[(availableSymbols.indexOf(primarySym) + 2) % availableSymbols.length];
      objectives.push({
        type: 'collect_symbol',
        symbol: secondSym,
        target: Math.max(10, Math.floor(symCount * 0.75)),
        current: 0,
      });
    }
  }

  const starScores: [number, number, number] = [
    targetScore,
    Math.round(targetScore * 1.4),
    Math.round(targetScore * 1.9),
  ];

  return {
    levelNumber: clampedLevel,
    realmName: realm.name,
    realmSub: realm.sub,
    themeColor: realm.themeColor,
    bgGradient: realm.bgGradient,
    gridRows,
    gridCols,
    moves,
    targetScore,
    objectives,
    availableSymbols,
    marbleLayout,
    starScores,
  };
};
