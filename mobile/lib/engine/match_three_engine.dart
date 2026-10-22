import 'dart:math';
import '../models/game_models.dart';

class MatchResult {
  final Set<String> matchedTileIds;
  final List<TileData> matchedTiles;
  final List<SpecialCreation> specialCreations;
  final List<MarbleCell> brokenMarbles;
  final int scoreGained;
  final Map<SymbolType, int> clearedCounts;

  MatchResult({
    required this.matchedTileIds,
    required this.matchedTiles,
    required this.specialCreations,
    required this.brokenMarbles,
    required this.scoreGained,
    required this.clearedCounts,
  });
}

class SpecialCreation {
  final int row;
  final int col;
  final SymbolType symbol;
  final SpecialTileType special;

  SpecialCreation({
    required this.row,
    required this.col,
    required this.symbol,
    required this.special,
  });
}

int _tileCounter = 0;
String generateTileId() => 'tile_${DateTime.now().millisecondsSinceEpoch}_${_tileCounter++}';

bool areAdjacent(int r1, int c1, int r2, int c2) {
  return (r1 == r2 && (c1 - c2).abs() == 1) || (c1 == c2 && (r1 - r2).abs() == 1);
}

List<List<TileData?>> createInitialBoard(
  int rows,
  int cols,
  List<SymbolType> symbols,
) {
  final random = Random();
  final board = List.generate(
    rows,
    (r) => List<TileData?>.filled(cols, null),
  );

  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      final forbidden = <SymbolType>{};
      if (c >= 2 && board[r][c - 1]?.symbol == board[r][c - 2]?.symbol) {
        forbidden.add(board[r][c - 1]!.symbol);
      }
      if (r >= 2 && board[r - 1][c]?.symbol == board[r - 2][c]?.symbol) {
        forbidden.add(board[r - 1][c]!.symbol);
      }

      final valid = symbols.where((s) => !forbidden.contains(s)).toList();
      final chosen = valid.isNotEmpty
          ? valid[random.nextInt(valid.length)]
          : symbols[random.nextInt(symbols.length)];

      board[r][c] = TileData(
        id: generateTileId(),
        symbol: chosen,
        row: r,
        col: c,
      );
    }
  }

  return board;
}

MatchResult detectMatches(
  List<List<TileData?>> board,
  Map<String, int> marbleMap,
  CharacterModel? guardian,
  int comboLevel, {
  Point<int>? swappedOrigin,
}) {
  final rows = board.length;
  final cols = board[0].length;
  final matchedTileIds = <String>{};
  final matchedTiles = <TileData>[];
  final specialCreations = <SpecialCreation>[];
  final clearedCounts = <SymbolType, int>{};
  final brokenMarbles = <MarbleCell>[];

  // Horizontal runs
  final hMatches = <_RunMatch>[];
  for (int r = 0; r < rows; r++) {
    int runLen = 1;
    for (int c = 0; c < cols; c++) {
      final cur = board[r][c];
      final nxt = c + 1 < cols ? board[r][c + 1] : null;

      if (cur != null && nxt != null && cur.symbol == nxt.symbol) {
        runLen++;
      } else {
        if (runLen >= 3 && cur != null) {
          final indices = [for (int k = c - runLen + 1; k <= c; k++) k];
          hMatches.add(_RunMatch(row: r, colIndices: indices, symbol: cur.symbol));
        }
        runLen = 1;
      }
    }
  }

  // Vertical runs
  final vMatches = <_ColMatch>[];
  for (int c = 0; c < cols; c++) {
    int runLen = 1;
    for (int r = 0; r < rows; r++) {
      final cur = board[r][c];
      final nxt = r + 1 < rows ? board[r + 1][c] : null;

      if (cur != null && nxt != null && cur.symbol == nxt.symbol) {
        runLen++;
      } else {
        if (runLen >= 3 && cur != null) {
          final indices = [for (int k = r - runLen + 1; k <= r; k++) k];
          vMatches.add(_ColMatch(col: c, rowIndices: indices, symbol: cur.symbol));
        }
        runLen = 1;
      }
    }
  }

  for (final hm in hMatches) {
    for (final c in hm.colIndices) {
      final t = board[hm.row][c];
      if (t != null) {
        matchedTileIds.add(t.id);
        matchedTiles.add(t);
        clearedCounts[t.symbol] = (clearedCounts[t.symbol] ?? 0) + 1;
      }
    }
  }

  for (final vm in vMatches) {
    for (final r in vm.rowIndices) {
      final t = board[r][vm.col];
      if (t != null) {
        matchedTileIds.add(t.id);
        matchedTiles.add(t);
        clearedCounts[t.symbol] = (clearedCounts[t.symbol] ?? 0) + 1;
      }
    }
  }

  // Special creations
  // 1. T or L shape -> Pandora Blast
  for (final hm in hMatches) {
    for (final vm in vMatches) {
      if (hm.symbol == vm.symbol && vm.rowIndices.contains(hm.row) && hm.colIndices.contains(vm.col)) {
        specialCreations.add(SpecialCreation(
          row: hm.row,
          col: vm.col,
          symbol: hm.symbol,
          special: SpecialTileType.pandoraBlast,
        ));
      }
    }
  }

  // 2. 5-in-a-row -> Sun Supernova
  for (final hm in hMatches) {
    if (hm.colIndices.length >= 5) {
      final targetCol = swappedOrigin != null && swappedOrigin.x == hm.row && hm.colIndices.contains(swappedOrigin.y)
          ? swappedOrigin.y
          : hm.colIndices[hm.colIndices.length ~/ 2];
      specialCreations.add(SpecialCreation(
        row: hm.row,
        col: targetCol,
        symbol: hm.symbol,
        special: SpecialTileType.sunSupernova,
      ));
    }
  }
  for (final vm in vMatches) {
    if (vm.rowIndices.length >= 5) {
      final targetRow = swappedOrigin != null && swappedOrigin.y == vm.col && vm.rowIndices.contains(swappedOrigin.x)
          ? swappedOrigin.x
          : vm.rowIndices[vm.rowIndices.length ~/ 2];
      specialCreations.add(SpecialCreation(
        row: targetRow,
        col: vm.col,
        symbol: vm.symbol,
        special: SpecialTileType.sunSupernova,
      ));
    }
  }

  // 3. 4-in-a-row -> Lightning H / V
  for (final hm in hMatches) {
    if (hm.colIndices.length == 4) {
      specialCreations.add(SpecialCreation(
        row: hm.row,
        col: hm.colIndices[1],
        symbol: hm.symbol,
        special: SpecialTileType.lightningH,
      ));
    }
  }
  for (final vm in vMatches) {
    if (vm.rowIndices.length == 4) {
      specialCreations.add(SpecialCreation(
        row: vm.rowIndices[1],
        col: vm.col,
        symbol: vm.symbol,
        special: SpecialTileType.lightningV,
      ));
    }
  }

  // Process detonations of existing special tiles
  final toExplode = <TileData>[];
  for (final t in matchedTiles) {
    if (t.special != SpecialTileType.none && !t.isSpecialActivated) {
      t.isSpecialActivated = true;
      toExplode.add(t);
    }
  }

  while (toExplode.isNotEmpty) {
    final t = toExplode.removeLast();
    if (t.special == SpecialTileType.lightningH) {
      for (int c = 0; c < cols; c++) {
        final neighbor = board[t.row][c];
        if (neighbor != null && !matchedTileIds.contains(neighbor.id)) {
          matchedTileIds.add(neighbor.id);
          matchedTiles.add(neighbor);
          clearedCounts[neighbor.symbol] = (clearedCounts[neighbor.symbol] ?? 0) + 1;
          if (neighbor.special != SpecialTileType.none && !neighbor.isSpecialActivated) {
            neighbor.isSpecialActivated = true;
            toExplode.add(neighbor);
          }
        }
      }
    } else if (t.special == SpecialTileType.lightningV) {
      for (int r = 0; r < rows; r++) {
        final neighbor = board[r][t.col];
        if (neighbor != null && !matchedTileIds.contains(neighbor.id)) {
          matchedTileIds.add(neighbor.id);
          matchedTiles.add(neighbor);
          clearedCounts[neighbor.symbol] = (clearedCounts[neighbor.symbol] ?? 0) + 1;
          if (neighbor.special != SpecialTileType.none && !neighbor.isSpecialActivated) {
            neighbor.isSpecialActivated = true;
            toExplode.add(neighbor);
          }
        }
      }
    } else if (t.special == SpecialTileType.pandoraBlast) {
      final radius = guardian?.id == 'hades' ? 2 : 1;
      for (int r = max(0, t.row - radius); r <= min(rows - 1, t.row + radius); r++) {
        for (int c = max(0, t.col - radius); c <= min(cols - 1, t.col + radius); c++) {
          final neighbor = board[r][c];
          if (neighbor != null && !matchedTileIds.contains(neighbor.id)) {
            matchedTileIds.add(neighbor.id);
            matchedTiles.add(neighbor);
            clearedCounts[neighbor.symbol] = (clearedCounts[neighbor.symbol] ?? 0) + 1;
            if (neighbor.special != SpecialTileType.none && !neighbor.isSpecialActivated) {
              neighbor.isSpecialActivated = true;
              toExplode.add(neighbor);
            }
          }
        }
      }
    } else if (t.special == SpecialTileType.sunSupernova) {
      for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
          final neighbor = board[r][c];
          if (neighbor != null && neighbor.symbol == t.symbol && !matchedTileIds.contains(neighbor.id)) {
            matchedTileIds.add(neighbor.id);
            matchedTiles.add(neighbor);
            clearedCounts[neighbor.symbol] = (clearedCounts[neighbor.symbol] ?? 0) + 1;
            if (neighbor.special != SpecialTileType.none && !neighbor.isSpecialActivated) {
              neighbor.isSpecialActivated = true;
              toExplode.add(neighbor);
            }
          }
        }
      }
    }
  }

  // Marble obstacle damage
  if (marbleMap.isNotEmpty && matchedTiles.isNotEmpty) {
    final damage = guardian?.id == 'hercules' ? 2 : 1;
    final keys = marbleMap.keys.toList();

    for (final key in keys) {
      final parts = key.split(',');
      final mr = int.parse(parts[0]);
      final mc = int.parse(parts[1]);
      final curHealth = marbleMap[key]!;

      final isHit = matchedTiles.any((t) => (t.row - mr).abs() <= 1 && (t.col - mc).abs() <= 1);
      if (isHit) {
        final newHealth = curHealth - damage;
        if (newHealth <= 0) {
          marbleMap.remove(key);
          brokenMarbles.add(MarbleCell(row: mr, col: mc, health: 0));
        } else {
          marbleMap[key] = newHealth;
        }
      }
    }
  }

  // Score
  int score = matchedTileIds.length * 60;
  if (matchedTileIds.length >= 4) score += 150;
  if (matchedTileIds.length >= 5) score += 400;

  if (guardian != null) {
    if (guardian.id == 'zeus') {
      score += ((clearedCounts[SymbolType.zeus] ?? 0) * 60 * guardian.blessing.bonusValue).toInt();
    } else if (guardian.id == 'poseidon' || guardian.id == 'amphitrite') {
      final water = (clearedCounts[SymbolType.poseidon] ?? 0) + (clearedCounts[SymbolType.amphora] ?? 0);
      score += (water * 60 * guardian.blessing.bonusValue).toInt();
    } else if (guardian.id == 'medusa' && comboLevel > 1) {
      score = (score * (1 + guardian.blessing.bonusValue)).toInt();
    }
  }

  final comboMultiplier = 1.0 + (comboLevel - 1) * 0.4;
  score = (score * comboMultiplier).toInt();

  return MatchResult(
    matchedTileIds: matchedTileIds,
    matchedTiles: matchedTiles,
    specialCreations: specialCreations,
    brokenMarbles: brokenMarbles,
    scoreGained: score,
    clearedCounts: clearedCounts,
  );
}

class _RunMatch {
  final int row;
  final List<int> colIndices;
  final SymbolType symbol;
  _RunMatch({required this.row, required this.colIndices, required this.symbol});
}

class _ColMatch {
  final int col;
  final List<int> rowIndices;
  final SymbolType symbol;
  _ColMatch({required this.col, required this.rowIndices, required this.symbol});
}

List<List<TileData?>> applyGravityAndRefill(
  List<List<TileData?>> board,
  List<SymbolType> availableSymbols,
) {
  final rows = board.length;
  final cols = board[0].length;
  final random = Random();
  final newBoard = List.generate(rows, (r) => List<TileData?>.filled(cols, null));

  for (int c = 0; c < cols; c++) {
    final remainingInCol = <TileData>[];
    for (int r = rows - 1; r >= 0; r--) {
      if (board[r][c] != null) {
        remainingInCol.add(board[r][c]!);
      }
    }

    int targetRow = rows - 1;
    for (final tile in remainingInCol) {
      tile.row = targetRow;
      tile.col = c;
      tile.isNew = false;
      tile.isSpecialActivated = false;
      newBoard[targetRow][c] = tile;
      targetRow--;
    }

    while (targetRow >= 0) {
      final sym = availableSymbols[random.nextInt(availableSymbols.length)];
      newBoard[targetRow][c] = TileData(
        id: generateTileId(),
        symbol: sym,
        row: targetRow,
        col: c,
        isNew: true,
      );
      targetRow--;
    }
  }

  return newBoard;
}

bool hasValidMoves(List<List<TileData?>> board, Map<String, int> marbleMap) {
  final rows = board.length;
  final cols = board[0].length;

  for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
      if (c + 1 < cols) {
        final bCopy = [for (final row in board) [for (final t in row) t?.copyWith()]];
        final t1 = bCopy[r][c];
        final t2 = bCopy[r][c + 1];
        if (t1 != null && t2 != null) {
          bCopy[r][c] = t2.copyWith(row: r, col: c);
          bCopy[r][c + 1] = t1.copyWith(row: r, col: c + 1);
          final res = detectMatches(bCopy, marbleMap, null, 1);
          if (res.matchedTileIds.length >= 3) return true;
        }
      }
      if (r + 1 < rows) {
        final bCopy = [for (final row in board) [for (final t in row) t?.copyWith()]];
        final t1 = bCopy[r][c];
        final t2 = bCopy[r + 1][c];
        if (t1 != null && t2 != null) {
          bCopy[r][c] = t2.copyWith(row: r, col: c);
          bCopy[r + 1][c] = t1.copyWith(row: r + 1, col: c);
          final res = detectMatches(bCopy, marbleMap, null, 1);
          if (res.matchedTileIds.length >= 3) return true;
        }
      }
    }
  }

  return false;
}
