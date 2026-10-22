enum SymbolType {
  pandora,
  zeus,
  athena,
  pegasus,
  amphora,
  sun,
  temple,
  poseidon,
}

enum SpecialTileType {
  none,
  lightningH,
  lightningV,
  pandoraBlast,
  sunSupernova,
}

class TileData {
  final String id;
  final SymbolType symbol;
  final SpecialTileType special;
  int row;
  int col;
  bool isMatched;
  bool isNew;
  bool isSpecialActivated;

  TileData({
    required this.id,
    required this.symbol,
    this.special = SpecialTileType.none,
    required this.row,
    required this.col,
    this.isMatched = false,
    this.isNew = false,
    this.isSpecialActivated = false,
  });

  TileData copyWith({
    String? id,
    SymbolType? symbol,
    SpecialTileType? special,
    int? row,
    int? col,
    bool? isMatched,
    bool? isNew,
    bool? isSpecialActivated,
  }) {
    return TileData(
      id: id ?? this.id,
      symbol: symbol ?? this.symbol,
      special: special ?? this.special,
      row: row ?? this.row,
      col: col ?? this.col,
      isMatched: isMatched ?? this.isMatched,
      isNew: isNew ?? this.isNew,
      isSpecialActivated: isSpecialActivated ?? this.isSpecialActivated,
    );
  }
}

enum ObjectiveType { score, collectSymbol, clearMarble }

class LevelObjective {
  final ObjectiveType type;
  final int target;
  int current;
  final SymbolType? symbol;

  LevelObjective({
    required this.type,
    required this.target,
    this.current = 0,
    this.symbol,
  });

  LevelObjective copyWith({int? current}) {
    return LevelObjective(
      type: type,
      target: target,
      current: current ?? this.current,
      symbol: symbol,
    );
  }

  bool get isComplete => current >= target;
}

class MarbleCell {
  final int row;
  final int col;
  int health;

  MarbleCell({required this.row, required this.col, this.health = 1});
}

class LevelConfig {
  final int levelNumber;
  final String realmName;
  final String realmSub;
  final int gridRows;
  final int gridCols;
  final int moves;
  final int targetScore;
  final List<LevelObjective> objectives;
  final List<SymbolType> availableSymbols;
  final List<MarbleCell> marbleLayout;
  final List<int> starScores;

  LevelConfig({
    required this.levelNumber,
    required this.realmName,
    required this.realmSub,
    required this.gridRows,
    required this.gridCols,
    required this.moves,
    required this.targetScore,
    required this.objectives,
    required this.availableSymbols,
    required this.marbleLayout,
    required this.starScores,
  });
}

class DivineBlessing {
  final String name;
  final String description;
  final String bonusType;
  final double bonusValue;

  DivineBlessing({
    required this.name,
    required this.description,
    required this.bonusType,
    required this.bonusValue,
  });
}

class CharacterModel {
  final String id;
  final String name;
  final String title;
  final String domain;
  final int unlockLevel;
  final String quote;
  final String mythDescription;
  final String lore;
  final DivineBlessing blessing;
  final SymbolType symbolType;

  CharacterModel({
    required this.id,
    required this.name,
    required this.title,
    required this.domain,
    required this.unlockLevel,
    required this.quote,
    required this.mythDescription,
    required this.lore,
    required this.blessing,
    required this.symbolType,
  });
}

class LevelProgress {
  final int stars;
  final int highScore;
  final String completedAt;

  LevelProgress({
    required this.stars,
    required this.highScore,
    required this.completedAt,
  });

  Map<String, dynamic> toJson() => {
        'stars': stars,
        'highScore': highScore,
        'completedAt': completedAt,
      };

  factory LevelProgress.fromJson(Map<String, dynamic> json) => LevelProgress(
        stars: json['stars'] ?? 0,
        highScore: json['highScore'] ?? 0,
        completedAt: json['completedAt'] ?? '',
      );
}

class GameSettings {
  bool soundEnabled;
  bool musicEnabled;
  double volume;
  bool reducedMotion;
  String themeMode; // 'olympus', 'atlantis', 'auto'

  GameSettings({
    this.soundEnabled = true,
    this.musicEnabled = true,
    this.volume = 0.75,
    this.reducedMotion = false,
    this.themeMode = 'auto',
  });

  Map<String, dynamic> toJson() => {
        'soundEnabled': soundEnabled,
        'musicEnabled': musicEnabled,
        'volume': volume,
        'reducedMotion': reducedMotion,
        'themeMode': themeMode,
      };

  factory GameSettings.fromJson(Map<String, dynamic> json) => GameSettings(
        soundEnabled: json['soundEnabled'] ?? true,
        musicEnabled: json['musicEnabled'] ?? true,
        volume: (json['volume'] as num?)?.toDouble() ?? 0.75,
        reducedMotion: json['reducedMotion'] ?? false,
        themeMode: json['themeMode'] ?? 'auto',
      );
}

class PlayerProfile {
  int currentLevel;
  int maxUnlockedLevel;
  int totalXp;
  Map<int, LevelProgress> completedLevels;
  List<String> unlockedCharacterIds;
  String selectedCharacterId;
  GameSettings settings;

  PlayerProfile({
    this.currentLevel = 1,
    this.maxUnlockedLevel = 1,
    this.totalXp = 0,
    required this.completedLevels,
    required this.unlockedCharacterIds,
    this.selectedCharacterId = 'zeus',
    required this.settings,
  });
}
