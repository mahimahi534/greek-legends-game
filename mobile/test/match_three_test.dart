import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/models/game_models.dart';
import 'package:mobile/engine/match_three_engine.dart';
import 'package:mobile/data/level_generator.dart';

void main() {
  group('Mobile Match Three Engine Tests', () {
    test('areAdjacent correctly checks grid neighbors', () {
      expect(areAdjacent(0, 0, 0, 1), isTrue);
      expect(areAdjacent(0, 0, 1, 0), isTrue);
      expect(areAdjacent(0, 0, 1, 1), isFalse); // diagonal
      expect(areAdjacent(0, 0, 0, 2), isFalse);
    });

    test('createInitialBoard generates grid without immediate 3-matches', () {
      final board = createInitialBoard(7, 7, SymbolType.values);
      expect(board.length, 7);
      expect(board[0].length, 7);

      final matches = detectMatches(board, {}, null, 1);
      expect(matches.matchedTileIds.isEmpty, isTrue);
    });

    test('detectMatches finds horizontal 3-in-a-row', () {
      final board = [
        [
          TileData(id: 't_0_0', symbol: SymbolType.zeus, row: 0, col: 0),
          TileData(id: 't_0_1', symbol: SymbolType.zeus, row: 0, col: 1),
          TileData(id: 't_0_2', symbol: SymbolType.zeus, row: 0, col: 2),
        ],
        [
          TileData(id: 't_1_0', symbol: SymbolType.athena, row: 1, col: 0),
          TileData(id: 't_1_1', symbol: SymbolType.poseidon, row: 1, col: 1),
          TileData(id: 't_1_2', symbol: SymbolType.amphora, row: 1, col: 2),
        ],
        [
          TileData(id: 't_2_0', symbol: SymbolType.pegasus, row: 2, col: 0),
          TileData(id: 't_2_1', symbol: SymbolType.sun, row: 2, col: 1),
          TileData(id: 't_2_2', symbol: SymbolType.temple, row: 2, col: 2),
        ],
      ];

      final matches = detectMatches(board, {}, null, 1);
      expect(matches.matchedTileIds.length, 3);
      expect(matches.matchedTileIds.contains('t_0_0'), isTrue);
      expect(matches.matchedTileIds.contains('t_0_1'), isTrue);
      expect(matches.matchedTileIds.contains('t_0_2'), isTrue);
      expect(matches.scoreGained, greaterThan(0));
    });

    test('generateLevelConfig generates levels up to 1000 correctly', () {
      final lvl1 = generateLevelConfig(1);
      expect(lvl1.levelNumber, 1);
      expect(lvl1.realmName, 'Mount Olympus');
      expect(lvl1.moves, greaterThanOrEqualTo(18));

      final lvl500 = generateLevelConfig(500);
      expect(lvl500.levelNumber, 500);
      expect(lvl500.realmName, 'Underworld of Hades');

      final lvl1000 = generateLevelConfig(1000);
      expect(lvl1000.levelNumber, 1000);
      expect(lvl1000.realmName, 'The Celestial Zenith');
      expect(lvl1000.targetScore, greaterThan(100000));
    });
  });
}
