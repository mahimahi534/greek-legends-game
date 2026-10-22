import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_models.dart';
import '../data/characters_data.dart';
import '../engine/match_three_engine.dart';
import '../art/symbol_painter.dart';
import '../art/character_painter.dart';
import '../art/landscape_painter.dart';
import '../widgets/level_complete_dialog.dart';
import '../widgets/level_failed_dialog.dart';

class PuzzleGameScreen extends StatefulWidget {
  final LevelConfig levelConfig;
  final PlayerProfile profile;
  final String theme; // 'olympus' or 'atlantis'
  final Function(int score, int stars) onLevelComplete;
  final VoidCallback onExitToMap;

  const PuzzleGameScreen({
    super.key,
    required this.levelConfig,
    required this.profile,
    required this.theme,
    required this.onLevelComplete,
    required this.onExitToMap,
  });

  @override
  State<PuzzleGameScreen> createState() => _PuzzleGameScreenState();
}

class _PuzzleGameScreenState extends State<PuzzleGameScreen> {
  late List<List<TileData?>> _board;
  late Map<String, int> _marbleMap;
  late int _movesLeft;
  late int _score;
  late List<LevelObjective> _objectives;
  late CharacterModel _guardian;

  Point<int>? _selectedPos;
  Point<int>? _hintPos1;
  Point<int>? _hintPos2;
  bool _isProcessing = false;
  bool _isGameOver = false;
  String? _comboText;

  @override
  void initState() {
    super.initState();
    _guardian = allCharacters.firstWhere(
      (c) => c.id == widget.profile.selectedCharacterId,
      orElse: () => allCharacters.first,
    );

    _movesLeft = _guardian.id == 'athena'
        ? widget.levelConfig.moves + _guardian.blessing.bonusValue.toInt()
        : widget.levelConfig.moves;

    _score = 0;
    _objectives = widget.levelConfig.objectives.map((o) => o.copyWith(current: 0)).toList();

    _marbleMap = {};
    for (final m in widget.levelConfig.marbleLayout) {
      _marbleMap['${m.row},${m.col}'] = m.health;
    }

    _board = createInitialBoard(
      widget.levelConfig.gridRows,
      widget.levelConfig.gridCols,
      widget.levelConfig.availableSymbols,
    );
  }

  void _playSound() {
    if (widget.profile.settings.soundEnabled) {
      SystemSound.play(SystemSoundType.click);
    }
  }

  Future<void> _handleTileTap(int r, int c) async {
    if (_isProcessing || _isGameOver) return;
    setState(() {
      _hintPos1 = null;
      _hintPos2 = null;
    });

    if (_selectedPos == null) {
      _playSound();
      setState(() => _selectedPos = Point(r, c));
      return;
    }

    final p1 = _selectedPos!;
    final p2 = Point(r, c);

    if (p1 == p2) {
      setState(() => _selectedPos = null);
      return;
    }

    if (!areAdjacent(p1.x, p1.y, p2.x, p2.y)) {
      _playSound();
      setState(() => _selectedPos = p2);
      return;
    }

    // Attempt Swap
    setState(() {
      _isProcessing = true;
      _selectedPos = null;
    });
    _playSound();

    final copyBoard = [for (final row in _board) [for (final t in row) t?.copyWith()]];
    final t1 = copyBoard[p1.x][p1.y];
    final t2 = copyBoard[p2.x][p2.y];

    if (t1 == null || t2 == null) {
      setState(() => _isProcessing = false);
      return;
    }

    copyBoard[p1.x][p1.y] = t2.copyWith(row: p1.x, col: p1.y);
    copyBoard[p2.x][p2.y] = t1.copyWith(row: p2.x, col: p2.y);
    setState(() => _board = copyBoard);

    final initialMatch = detectMatches(copyBoard, _marbleMap, _guardian, 1, swappedOrigin: p2);
    if (initialMatch.matchedTileIds.isEmpty) {
      // Revert swap
      await Future.delayed(const Duration(milliseconds: 250));
      copyBoard[p1.x][p1.y] = t1.copyWith(row: p1.x, col: p1.y);
      copyBoard[p2.x][p2.y] = t2.copyWith(row: p2.x, col: p2.y);
      setState(() {
        _board = copyBoard;
        _isProcessing = false;
      });
      return;
    }

    // Valid match
    _movesLeft--;
    int combo = 1;
    var currentMatch = initialMatch;
    var runningBoard = copyBoard;

    while (currentMatch.matchedTileIds.isNotEmpty) {
      _score += currentMatch.scoreGained;
      if (combo > 1) {
        setState(() => _comboText = 'COMBO x$combo!');
      }

      // Update objectives
      for (int i = 0; i < _objectives.length; i++) {
        final obj = _objectives[i];
        if (obj.type == ObjectiveType.score) {
          _objectives[i] = obj.copyWith(current: _score);
        } else if (obj.type == ObjectiveType.collectSymbol && obj.symbol != null) {
          final cleared = currentMatch.clearedCounts[obj.symbol!] ?? 0;
          _objectives[i] = obj.copyWith(current: obj.current + cleared);
        } else if (obj.type == ObjectiveType.clearMarble) {
          _objectives[i] = obj.copyWith(current: obj.current + currentMatch.brokenMarbles.length);
        }
      }

      // Animate match disappearing
      for (final row in runningBoard) {
        for (final t in row) {
          if (t != null && currentMatch.matchedTileIds.contains(t.id)) {
            t.isMatched = true;
          }
        }
      }
      setState(() => _board = runningBoard);
      await Future.delayed(const Duration(milliseconds: 250));

      // Remove matched and spawn special tiles
      for (int r = 0; r < runningBoard.length; r++) {
        for (int c = 0; c < runningBoard[0].length; c++) {
          if (runningBoard[r][c]?.isMatched == true) {
            runningBoard[r][c] = null;
          }
        }
      }

      for (final spec in currentMatch.specialCreations) {
        runningBoard[spec.row][spec.col] = TileData(
          id: generateTileId(),
          symbol: spec.symbol,
          special: spec.special,
          row: spec.row,
          col: spec.col,
        );
      }

      // Gravity and refill
      runningBoard = applyGravityAndRefill(runningBoard, widget.levelConfig.availableSymbols);
      setState(() => _board = runningBoard);
      await Future.delayed(const Duration(milliseconds: 250));

      combo++;
      currentMatch = detectMatches(runningBoard, _marbleMap, _guardian, combo);
    }

    setState(() => _comboText = null);

    // Auto shuffle if no valid moves left
    if (!hasValidMoves(runningBoard, _marbleMap)) {
      _playSound();
      runningBoard = createInitialBoard(
        widget.levelConfig.gridRows,
        widget.levelConfig.gridCols,
        widget.levelConfig.availableSymbols,
      );
      setState(() => _board = runningBoard);
    }

    setState(() => _isProcessing = false);

    // Check Victory
    final allComplete = _objectives.every((o) => o.isComplete);
    if (allComplete && !_isGameOver) {
      _isGameOver = true;
      int stars = 1;
      if (_score >= widget.levelConfig.starScores[2]) {
        stars = 3;
      } else if (_score >= widget.levelConfig.starScores[1]) {
        stars = 2;
      }

      Future.delayed(const Duration(milliseconds: 400), () {
        if (!mounted) return;
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => LevelCompleteDialog(
            levelNumber: widget.levelConfig.levelNumber,
            score: _score,
            highScore: max(_score, widget.profile.completedLevels[widget.levelConfig.levelNumber]?.highScore ?? 0),
            stars: stars,
            xpEarned: widget.levelConfig.levelNumber * 100 + (_score ~/ 10),
            onNextLevel: () => widget.onLevelComplete(_score, stars),
            onReplay: _restartLevel,
            onGoToMap: widget.onExitToMap,
          ),
        );
      });
    } else if (_movesLeft <= 0 && !_isGameOver) {
      _isGameOver = true;
      Future.delayed(const Duration(milliseconds: 400), () {
        if (!mounted) return;
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => LevelFailedDialog(
            levelNumber: widget.levelConfig.levelNumber,
            objectives: _objectives,
            onRetry: _restartLevel,
            onGoToMap: widget.onExitToMap,
          ),
        );
      });
    }
  }

  void _restartLevel() {
    setState(() {
      _isGameOver = false;
      _movesLeft = _guardian.id == 'athena'
          ? widget.levelConfig.moves + _guardian.blessing.bonusValue.toInt()
          : widget.levelConfig.moves;
      _score = 0;
      _objectives = widget.levelConfig.objectives.map((o) => o.copyWith(current: 0)).toList();
      _marbleMap = {};
      for (final m in widget.levelConfig.marbleLayout) {
        _marbleMap['${m.row},${m.col}'] = m.health;
      }
      _board = createInitialBoard(
        widget.levelConfig.gridRows,
        widget.levelConfig.gridCols,
        widget.levelConfig.availableSymbols,
      );
      _selectedPos = null;
    });
  }

  void _showOracleHint() {
    if (_isProcessing || _isGameOver) return;
    _playSound();

    final rows = _board.length;
    final cols = _board[0].length;

    for (int r = 0; r < rows; r++) {
      for (int c = 0; c < cols; c++) {
        if (c + 1 < cols) {
          final bCopy = [for (final row in _board) [for (final t in row) t?.copyWith()]];
          final t1 = bCopy[r][c];
          final t2 = bCopy[r][c + 1];
          if (t1 != null && t2 != null) {
            bCopy[r][c] = t2.copyWith(row: r, col: c);
            bCopy[r][c + 1] = t1.copyWith(row: r, col: c + 1);
            if (detectMatches(bCopy, _marbleMap, null, 1).matchedTileIds.length >= 3) {
              setState(() {
                _hintPos1 = Point(r, c);
                _hintPos2 = Point(r, c + 1);
              });
              return;
            }
          }
        }
        if (r + 1 < rows) {
          final bCopy = [for (final row in _board) [for (final t in row) t?.copyWith()]];
          final t1 = bCopy[r][c];
          final t2 = bCopy[r + 1][c];
          if (t1 != null && t2 != null) {
            bCopy[r][c] = t2.copyWith(row: r, col: c);
            bCopy[r + 1][c] = t1.copyWith(row: r + 1, col: c);
            if (detectMatches(bCopy, _marbleMap, null, 1).matchedTileIds.length >= 3) {
              setState(() {
                _hintPos1 = Point(r, c);
                _hintPos2 = Point(r + 1, c);
              });
              return;
            }
          }
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final rows = widget.levelConfig.gridRows;
    final cols = widget.levelConfig.gridCols;
    final isAtlantis = widget.theme == 'atlantis';

    return Scaffold(
      backgroundColor: const Color(0xFF070D1E),
      body: Stack(
        children: [
          Positioned.fill(
            child: LandscapeWidget(theme: isAtlantis ? 'atlantis' : 'olympus'),
          ),

          SafeArea(
            child: Column(
              children: [
                // Top Header Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios, color: Color(0xFFFDE68A), size: 20),
                        onPressed: widget.onExitToMap,
                      ),
                      Column(
                        children: [
                          Text(
                            widget.levelConfig.realmName,
                            style: const TextStyle(color: Color(0xAAFDE68A), fontSize: 10, letterSpacing: 1.2),
                          ),
                          Text(
                            'LEVEL ${widget.levelConfig.levelNumber}',
                            style: const TextStyle(color: Color(0xFFFFD700), fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      // Moves Box
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                        decoration: BoxDecoration(
                          color: _movesLeft <= 5 ? const Color(0x80F44336) : const Color(0xCC0F1B38),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: _movesLeft <= 5 ? Colors.redAccent : const Color(0xFFFFD700)),
                        ),
                        child: Column(
                          children: [
                            const Text('MOVES', style: TextStyle(color: Colors.white70, fontSize: 8)),
                            Text('$_movesLeft',
                                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Objectives Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: Wrap(
                    spacing: 8,
                    alignment: WrapAlignment.center,
                    children: _objectives.map((obj) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: obj.isComplete ? const Color(0x664CAF50) : Colors.black54,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: obj.isComplete ? Colors.greenAccent : const Color(0x33F59E0B)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (obj.symbol != null) ...[
                              SymbolWidget(symbol: obj.symbol!, size: 18),
                              const SizedBox(width: 4),
                            ],
                            Text(
                              '${obj.current} / ${obj.target}',
                              style: TextStyle(
                                color: obj.isComplete ? Colors.greenAccent : Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            if (obj.isComplete) ...[
                              const SizedBox(width: 4),
                              const Icon(Icons.check, color: Colors.greenAccent, size: 12),
                            ],
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),

                // Combo Banner
                if (_comboText != null)
                  Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFD700),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _comboText!,
                      style: const TextStyle(color: Colors.black, fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                  ),

                // The Matching Board Grid
                Expanded(
                  child: Center(
                    child: Container(
                      margin: const EdgeInsets.all(12),
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: isAtlantis
                              ? [const Color(0xEE062438), const Color(0xEE010D18)]
                              : [const Color(0xEE132247), const Color(0xEE040812)],
                        ),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(
                          color: isAtlantis ? const Color(0xFF00CED1) : const Color(0xFFFFD700),
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isAtlantis ? const Color(0x4D00CED1) : const Color(0x33FFD700),
                            blurRadius: 20,
                          ),
                        ],
                      ),
                      child: AspectRatio(
                        aspectRatio: cols / rows,
                        child: LayoutBuilder(
                          builder: (context, constraints) {
                            final tileSize = constraints.maxWidth / cols;
                            return GridView.builder(
                              physics: const NeverScrollableScrollPhysics(),
                              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: cols,
                              ),
                              itemCount: rows * cols,
                              itemBuilder: (context, i) {
                                final r = i ~/ cols;
                                final c = i % cols;
                                final tile = _board[r][c];
                                final isSelected = _selectedPos?.x == r && _selectedPos?.y == c;
                                final isHint = (_hintPos1?.x == r && _hintPos1?.y == c) ||
                                    (_hintPos2?.x == r && _hintPos2?.y == c);
                                final marbleHealth = _marbleMap['$r,$c'];

                                return GestureDetector(
                                  onTap: () => _handleTileTap(r, c),
                                  child: Container(
                                    margin: const EdgeInsets.all(2),
                                    decoration: BoxDecoration(
                                      color: isSelected
                                          ? (isAtlantis ? const Color(0x8800CED1) : const Color(0x88FFD700))
                                          : marbleHealth != null
                                              ? Colors.grey.shade700
                                              : Colors.black26,
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(
                                        color: isSelected
                                            ? (isAtlantis ? const Color(0xFF00CED1) : const Color(0xFFFFD700))
                                            : isHint
                                                ? Colors.cyanAccent
                                                : Colors.white12,
                                        width: isSelected ? 2 : 1,
                                      ),
                                    ),
                                    child: Center(
                                      child: marbleHealth != null
                                          ? const Text('🏛️', style: TextStyle(fontSize: 18))
                                          : tile != null
                                              ? SymbolWidget(
                                                  symbol: tile.symbol,
                                                  special: tile.special,
                                                  size: tileSize * 0.75,
                                                  isAtlantis: isAtlantis,
                                                )
                                              : null,
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                        ),
                      ),
                    ),
                  ),
                ),

                // Bottom Bar: Oracle Hint & Guardian Blessing
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0891B2),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        icon: const Icon(Icons.help_outline, size: 16),
                        label: const Text('Oracle Hint', style: TextStyle(fontSize: 12)),
                        onPressed: _showOracleHint,
                      ),
                      Row(
                        children: [
                          CharacterWidget(id: _guardian.id, size: 34),
                          const SizedBox(width: 8),
                          Text(
                            _guardian.name,
                            style: const TextStyle(color: Color(0xFFFFD700), fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
