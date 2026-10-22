import 'dart:math';
import '../models/game_models.dart';

class RealmInfo {
  final String name;
  final String sub;
  final bool isUnderwater;

  RealmInfo({
    required this.name,
    required this.sub,
    this.isUnderwater = false,
  });
}

final List<RealmInfo> realms = [
  RealmInfo(name: 'Mount Olympus', sub: 'The Golden Peak of the Gods'),
  RealmInfo(name: 'Athens Acropolis', sub: 'Citadel of Wisdom & Parthenon'),
  RealmInfo(name: 'Aegean Sunken Atlantis', sub: 'Poseidon’s Fathomless Palace', isUnderwater: true),
  RealmInfo(name: 'Sanctuary of Delphi', sub: 'The Prophetic Temple of the Sun'),
  RealmInfo(name: 'Underworld of Hades', sub: 'River Styx & The Asphodel Meadows'),
  RealmInfo(name: 'Island of Crete', sub: 'The Legendary Daedalian Labyrinth'),
  RealmInfo(name: 'Colossus of Rhodes', sub: 'The Radiant Harbor of Helios'),
  RealmInfo(name: 'Mount Cithaeron', sub: 'Trials of Herculean Valor'),
  RealmInfo(name: 'Sanctum of Sarpedon', sub: 'Medusa’s Petrified Sanctuary'),
  RealmInfo(name: 'The Celestial Zenith', sub: 'Throne of the Supreme God'),
];

RealmInfo getRealmForLevel(int level) {
  final bounded = level.clamp(1, 1000);
  final idx = ((bounded - 1) ~/ 100).clamp(0, realms.length - 1);
  return realms[idx];
}

LevelConfig generateLevelConfig(int levelNumber) {
  final clampedLevel = levelNumber.clamp(1, 1000);
  final realm = getRealmForLevel(clampedLevel);

  final gridRows = clampedLevel <= 5 ? 7 : 8;
  final gridCols = clampedLevel <= 5 ? 7 : 8;

  int poolSize = 5;
  if (clampedLevel > 15) poolSize = 6;
  if (clampedLevel > 100) poolSize = 7;
  if (clampedLevel > 400) poolSize = 8;

  final availableSymbols = SymbolType.values.sublist(0, poolSize);

  final moves = (28 - (clampedLevel ~/ 80) + (clampedLevel % 4)).clamp(18, 32);

  final baseScore = 1200 + clampedLevel * 250 + (pow(clampedLevel, 1.15) * 15).toInt();
  final targetScore = ((baseScore / 100).round()) * 100;

  final List<LevelObjective> objectives = [
    LevelObjective(type: ObjectiveType.score, target: targetScore),
  ];

  final primarySym = availableSymbols[(clampedLevel * 7) % availableSymbols.length];
  final symCount = (12 + (clampedLevel ~/ 20) * 2 + (clampedLevel % 5)).clamp(10, 45);
  objectives.add(LevelObjective(
    type: ObjectiveType.collectSymbol,
    symbol: primarySym,
    target: symCount,
  ));

  final List<MarbleCell> marbleLayout = [];
  if (clampedLevel >= 3) {
    final marbleCount = (4 + (clampedLevel ~/ 25) * 2).clamp(4, 16);
    for (int r = 0; r < gridRows; r++) {
      for (int c = 0; c < gridCols; c++) {
        final isCorner = (r == 0 || r == gridRows - 1) && (c == 0 || c == gridCols - 1);
        final isSubCorner = (r == 1 || r == gridRows - 2) && (c == 1 || c == gridCols - 2);
        final isCenter = r >= 3 && r <= 4 && c >= 3 && c <= 4;

        if (clampedLevel % 3 == 0 && isCorner && marbleLayout.length < marbleCount) {
          marbleLayout.add(MarbleCell(row: r, col: c, health: clampedLevel > 50 ? 2 : 1));
        } else if (clampedLevel % 3 == 1 && isSubCorner && marbleLayout.length < marbleCount) {
          marbleLayout.add(MarbleCell(row: r, col: c, health: 1));
        } else if (clampedLevel % 3 == 2 && isCenter && marbleLayout.length < marbleCount) {
          marbleLayout.add(MarbleCell(row: r, col: c, health: clampedLevel > 150 ? 2 : 1));
        }
      }
    }

    if (marbleLayout.isNotEmpty) {
      objectives.add(LevelObjective(
        type: ObjectiveType.clearMarble,
        target: marbleLayout.length,
      ));
    }
  }

  final starScores = [
    targetScore,
    (targetScore * 1.4).round(),
    (targetScore * 1.9).round(),
  ];

  return LevelConfig(
    levelNumber: clampedLevel,
    realmName: realm.name,
    realmSub: realm.sub,
    gridRows: gridRows,
    gridCols: gridCols,
    moves: moves,
    targetScore: targetScore,
    objectives: objectives,
    availableSymbols: availableSymbols,
    marbleLayout: marbleLayout,
    starScores: starScores,
  );
}
