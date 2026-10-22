import React, { useState, useRef, useCallback } from 'react';
import {
  RotateCcw,
  Pause,
  Play,
  Map as MapIcon,
  HelpCircle,
  Check,
  Star,
} from 'lucide-react';
import {
  LevelConfig,
  PlayerProfile,
  TileData,
  LevelObjective,
  FloatingText,
} from '../../types/game';
import {
  createInitialBoard,
  areAdjacent,
  detectMatches,
  applyGravityAndRefill,
  hasValidMoves,
  shuffleBoard,
  getUniqueTileId,
} from '../../utils/matchThreeEngine';
import { SymbolArt } from '../art/SymbolArt';
import { CharacterArt } from '../art/CharacterArt';
import { GreekLandscape } from '../common/GreekLandscape';
import { CHARACTERS } from '../../data/characters';
import { soundManager } from '../../services/audioService';

interface PuzzleGameProps {
  levelConfig: LevelConfig;
  profile: PlayerProfile;
  theme?: 'olympus' | 'atlantis';
  onLevelComplete: (score: number, stars: number) => void;
  onLevelFailed: (objectives: LevelObjective[]) => void;
  onExitToMap: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({
  levelConfig,
  profile,
  theme = 'olympus',
  onLevelComplete,
  onLevelFailed,
  onExitToMap,
}) => {
  const guardian = CHARACTERS.find((c) => c.id === profile.selectedCharacterId) || CHARACTERS[0];

  // Extra moves blessing from Athena
  const baseMoves = guardian.id === 'athena'
    ? levelConfig.moves + guardian.divineBlessing.bonusValue
    : levelConfig.moves;

  // Board State
  const [board, setBoard] = useState<(TileData | null)[][]>(() =>
    createInitialBoard(levelConfig.gridRows, levelConfig.gridCols, levelConfig.availableSymbols)
  );

  // Marble Obstacles Map (key: "r,c", value: health)
  const [marbleHealthMap, setMarbleHealthMap] = useState<Map<string, number>>(() => {
    const map = new Map<string, number>();
    (levelConfig.marbleLayout || []).forEach((m) => {
      map.set(`${m.row},${m.col}`, m.health);
    });
    return map;
  });

  // Gameplay Counters
  const [movesLeft, setMovesLeft] = useState<number>(baseMoves);
  const [score, setScore] = useState<number>(0);
  const [objectives, setObjectives] = useState<LevelObjective[]>(() =>
    levelConfig.objectives.map((o) => ({ ...o, current: 0 }))
  );

  // Interaction State
  const [selectedPos, setSelectedPos] = useState<{ row: number; col: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hintPos, setHintPos] = useState<{ r1: number; c1: number; r2: number; c2: number } | null>(null);

  // Animation FX
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [comboBanner, setComboBanner] = useState<string | null>(null);
  const [matchedTileIds, setMatchedTileIds] = useState<Set<string>>(new Set());

  // Prevent double completion triggers
  const isGameOverRef = useRef<boolean>(false);

  // Add floating point/combo text
  const addFloatingText = (text: string, x: number, y: number, color: string = '#FFD700') => {
    const id = `float_${Date.now()}_${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Check victory condition
  const checkVictory = useCallback(
    (currentScore: number, currentObjectives: LevelObjective[]) => {
      if (isGameOverRef.current) return;

      const allObjectivesMet = currentObjectives.every((obj) => obj.current >= obj.target);
      if (allObjectivesMet) {
        isGameOverRef.current = true;
        let stars = 1;
        if (currentScore >= levelConfig.starScores[2]) stars = 3;
        else if (currentScore >= levelConfig.starScores[1]) stars = 2;

        setTimeout(() => {
          onLevelComplete(currentScore, stars);
        }, 600);
      }
    },
    [levelConfig, onLevelComplete]
  );

  // Handle tile swapping and cascade resolution
  const handleTileClick = async (row: number, col: number) => {
    if (isProcessing || isPaused || isGameOverRef.current) return;
    setHintPos(null);

    // If nothing selected, select this tile
    if (!selectedPos) {
      soundManager.playClick();
      setSelectedPos({ row, col });
      return;
    }

    // If clicking same tile, deselect
    if (selectedPos.row === row && selectedPos.col === col) {
      setSelectedPos(null);
      return;
    }

    // If not adjacent, change selection to clicked tile
    if (!areAdjacent(selectedPos.row, selectedPos.col, row, col)) {
      soundManager.playClick();
      setSelectedPos({ row, col });
      return;
    }

    // Adjacent tile clicked: attempt swap!
    setIsProcessing(true);
    soundManager.playSwap();

    const r1 = selectedPos.row;
    const c1 = selectedPos.col;
    const r2 = row;
    const c2 = col;
    setSelectedPos(null);

    // Make temporary swapped board
    const newBoard = board.map((r) => r.map((t) => (t ? { ...t } : null)));
    const t1 = newBoard[r1][c1];
    const t2 = newBoard[r2][c2];

    if (!t1 || !t2) {
      setIsProcessing(false);
      return;
    }

    // Swap positions
    newBoard[r1][c1] = { ...t2, row: r1, col: c1 };
    newBoard[r2][c2] = { ...t1, row: r2, col: c2 };
    setBoard(newBoard);

    // Detect matches on swapped board
    const currentMarbleMap = new Map(marbleHealthMap);
    const initialMatch = detectMatches(newBoard, currentMarbleMap, guardian, 1, { row: r2, col: c2 });

    if (initialMatch.matchedTileIds.size === 0) {
      // Invalid swap! Animate back
      soundManager.playInvalid();
      await new Promise((res) => setTimeout(res, 250));
      // Swap back
      newBoard[r1][c1] = { ...t1, row: r1, col: c1 };
      newBoard[r2][c2] = { ...t2, row: r2, col: c2 };
      setBoard(newBoard);
      setIsProcessing(false);
      return;
    }

    // Valid swap! Deduct move
    const newMoves = movesLeft - 1;
    setMovesLeft(newMoves);

    // Run Cascades Loop
    let currentCombo = 1;
    let runningScore = score;
    let runningBoard = newBoard;
    let runningObjectives = [...objectives];
    let nextMatch: typeof initialMatch | null = initialMatch;

    while (nextMatch && nextMatch.matchedTileIds.size > 0) {
      // Play combo sound
      soundManager.playMatch(currentCombo);

      // Highlight matched tiles
      setMatchedTileIds(nextMatch.matchedTileIds);

      // Score update
      runningScore += nextMatch.scoreGained;
      setScore(runningScore);

      // Show floating text
      if (currentCombo > 1) {
        setComboBanner(`COMBO x${currentCombo}!`);
        addFloatingText(`+${nextMatch.scoreGained} (x${currentCombo})`, 50, 40, '#F59E0B');
      } else {
        addFloatingText(`+${nextMatch.scoreGained}`, 50, 45, '#FDE047');
      }

      // Update objectives
      const updatedObjs = runningObjectives.map((obj) => {
        if (obj.type === 'score') {
          return { ...obj, current: runningScore };
        }
        if (obj.type === 'collect_symbol' && obj.symbol) {
          const cleared = nextMatch?.clearedSymbolCounts[obj.symbol] || 0;
          return { ...obj, current: obj.current + cleared };
        }
        if (obj.type === 'clear_marble') {
          const brokenCount = nextMatch?.brokenMarblePositions.length || 0;
          return { ...obj, current: obj.current + brokenCount };
        }
        return obj;
      });
      runningObjectives = updatedObjs;
      setObjectives(updatedObjs);

      // Sound for broken marbles
      if (nextMatch.brokenMarblePositions.length > 0) {
        soundManager.playBreakMarble();
      }

      setMarbleHealthMap(new Map(currentMarbleMap));

      // Wait for match fade out animation
      await new Promise((res) => setTimeout(res, 300));
      setMatchedTileIds(new Set());

      // Remove matched tiles and insert special tiles created
      const clearedBoard = runningBoard.map((rowArr) =>
        rowArr.map((tile) => {
          if (!tile) return null;
          if (nextMatch?.matchedTileIds.has(tile.id)) return null;
          return tile;
        })
      );

      // Insert newly forged special tiles
      nextMatch.specialCreations.forEach((spec) => {
        clearedBoard[spec.row][spec.col] = {
          id: getUniqueTileId(),
          symbol: spec.symbol,
          special: spec.special,
          row: spec.row,
          col: spec.col,
        };
      });

      // Apply Gravity and Refill empty spaces
      const { newBoard: refilledBoard } = applyGravityAndRefill(
        clearedBoard,
        levelConfig.availableSymbols
      );
      runningBoard = refilledBoard;
      setBoard(refilledBoard);

      // Wait for drop animation
      await new Promise((res) => setTimeout(res, 250));

      // Check next cascade match
      currentCombo++;
      nextMatch = detectMatches(runningBoard, currentMarbleMap, guardian, currentCombo);
    }

    setComboBanner(null);

    // Check if board has valid moves left, if not auto-shuffle!
    if (!hasValidMoves(runningBoard, currentMarbleMap)) {
      addFloatingText('DIVINE SHUFFLE!', 50, 50, '#38BDF8');
      soundManager.playSupernova();
      await new Promise((res) => setTimeout(res, 400));
      const shuffled = shuffleBoard(runningBoard, levelConfig.availableSymbols);
      setBoard(shuffled);
    }

    setIsProcessing(false);

    // Check win condition
    checkVictory(runningScore, runningObjectives);

    // Check defeat condition
    if (newMoves <= 0 && !isGameOverRef.current) {
      const allMet = runningObjectives.every((obj) => obj.current >= obj.target);
      if (!allMet) {
        isGameOverRef.current = true;
        setTimeout(() => {
          onLevelFailed(runningObjectives);
        }, 600);
      }
    }
  };

  // Provide an Oracle Hint if player requests it
  const handleOracleHint = () => {
    if (isProcessing || isPaused) return;
    soundManager.playClick();

    const rows = board.length;
    const cols = board[0].length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Test right swap
        if (c + 1 < cols) {
          const testBoard = board.map((rowArr) => rowArr.map((t) => (t ? { ...t } : null)));
          const t1 = testBoard[r][c];
          const t2 = testBoard[r][c + 1];
          if (t1 && t2) {
            testBoard[r][c] = { ...t2, row: r, col: c };
            testBoard[r][c + 1] = { ...t1, row: r, col: c + 1 };
            const m = detectMatches(testBoard, marbleHealthMap, null, 1);
            if (m.matchedTileIds.size >= 3) {
              setHintPos({ r1: r, c1: c, r2: r, c2: c + 1 });
              addFloatingText("Oracle's Sight!", 50, 45, '#38BDF8');
              return;
            }
          }
        }
        // Test down swap
        if (r + 1 < rows) {
          const testBoard = board.map((rowArr) => rowArr.map((t) => (t ? { ...t } : null)));
          const t1 = testBoard[r][c];
          const t2 = testBoard[r + 1][c];
          if (t1 && t2) {
            testBoard[r][c] = { ...t2, row: r, col: c };
            testBoard[r + 1][c] = { ...t1, row: r + 1, col: c };
            const m = detectMatches(testBoard, marbleHealthMap, null, 1);
            if (m.matchedTileIds.size >= 3) {
              setHintPos({ r1: r, c1: c, r2: r + 1, c2: c });
              addFloatingText("Oracle's Sight!", 50, 45, '#38BDF8');
              return;
            }
          }
        }
      }
    }
  };

  // Restart level
  const handleRestart = () => {
    soundManager.playClick();
    setIsPaused(false);
    isGameOverRef.current = false;
    setBoard(createInitialBoard(levelConfig.gridRows, levelConfig.gridCols, levelConfig.availableSymbols));
    setMovesLeft(baseMoves);
    setScore(0);
    setObjectives(levelConfig.objectives.map((o) => ({ ...o, current: 0 })));
    const newMap = new Map<string, number>();
    (levelConfig.marbleLayout || []).forEach((m) => newMap.set(`${m.row},${m.col}`, m.health));
    setMarbleHealthMap(newMap);
    setSelectedPos(null);
  };

  // Calculate score progress for star meter
  const scorePercent = Math.min(100, (score / levelConfig.starScores[2]) * 100);

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center bg-[#070D1E] text-amber-50 overflow-hidden select-none">
      <GreekLandscape intensity="subtle" theme={theme} themeGradient={levelConfig.bgGradient} />

      {/* Floating Combo / Score Texts */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className="absolute font-serif font-black text-2xl md:text-3xl animate-bounce tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{
              top: `${ft.y}%`,
              left: `${ft.x}%`,
              transform: 'translate(-50%, -50%)',
              color: ft.color,
            }}
          >
            {ft.text}
          </div>
        ))}

        {comboBanner && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 text-slate-950 font-serif font-black text-xl tracking-widest shadow-[0_0_30px_#F59E0B] animate-pulse">
            {comboBanner}
          </div>
        )}
      </div>

      {/* Top Game Bar */}
      <header className="relative z-20 w-full max-w-4xl px-4 py-2 flex items-center justify-between border-b border-amber-500/30 bg-[#0B142B]/85 backdrop-blur-md shadow-lg">
        {/* Realm & Level Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsPaused(true);
            }}
            className="p-2 rounded-lg bg-black/60 border border-amber-500/40 text-amber-300 hover:text-white"
            title="Pause Game"
          >
            <Pause size={18} />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest">
                {levelConfig.realmName}
              </span>
            </div>
            <h1 className="font-serif font-black text-base sm:text-lg text-amber-100">
              LEVEL {levelConfig.levelNumber}
            </h1>
          </div>
        </div>

        {/* Center: Star Score Progress Bar */}
        <div className="flex-1 max-w-xs mx-4 hidden sm:block">
          <div className="flex items-center justify-between text-[10px] font-mono text-amber-300 mb-0.5">
            <span>SCORE: {score.toLocaleString()}</span>
            <span>TARGET: {levelConfig.targetScore.toLocaleString()}</span>
          </div>
          <div className="relative w-full h-2.5 bg-black/60 rounded-full border border-amber-500/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-300 shadow-[0_0_10px_#FFD700]"
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {/* Moves Counter & Active Guardian */}
        <div className="flex items-center gap-3">
          {/* Moves Left Badge */}
          <div
            className={`px-3 py-1 rounded-xl border flex flex-col items-center ${
              movesLeft <= 5
                ? 'bg-rose-950/80 border-rose-500 animate-pulse text-rose-300'
                : 'bg-gradient-to-b from-[#101F3E] to-black border-amber-500/50 text-amber-200'
            }`}
          >
            <span className="text-[9px] uppercase tracking-widest font-serif font-bold opacity-80">
              Moves
            </span>
            <span className="font-serif font-black text-xl leading-none">
              {movesLeft}
            </span>
          </div>

          {/* Active Guardian Badge */}
          <div
            className="flex items-center gap-2 px-2.5 py-1 bg-black/50 border border-amber-500/30 rounded-full"
            title={`${guardian.name}: ${guardian.divineBlessing.description}`}
          >
            <CharacterArt id={guardian.id} size={32} />
            <span className="text-xs font-serif font-bold text-amber-200 hidden md:inline">
              {guardian.name}
            </span>
          </div>
        </div>
      </header>

      {/* Objectives Banner Strip */}
      <div className="relative z-10 w-full max-w-4xl px-4 py-2 flex items-center justify-center gap-3 flex-wrap">
        {objectives.map((obj, i) => {
          const isComplete = obj.current >= obj.target;

          return (
            <div
              key={i}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-serif transition-all ${
                isComplete
                  ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-black/60 border-amber-500/30 text-amber-200'
              }`}
            >
              {obj.type === 'collect_symbol' && obj.symbol && (
                <SymbolArt symbol={obj.symbol} size={22} />
              )}
              {obj.type === 'clear_marble' && (
                <span className="text-sm">🏛️</span>
              )}
              {obj.type === 'score' && (
                <Star size={14} className="text-amber-400 fill-amber-400" />
              )}

              <span className="font-mono font-bold">
                {obj.current} / {obj.target}
              </span>

              {isComplete && <Check size={14} className="text-emerald-400" />}
            </div>
          );
        })}
      </div>

      {/* Center: The Greek / Atlantean Puzzle Grid */}
      <main className="relative z-10 my-auto p-2 sm:p-4 flex flex-col items-center">
        {/* Ancient Ornate Column Frame */}
        <div
          className={`relative p-3 sm:p-5 rounded-2xl backdrop-blur-md ${
            theme === 'atlantis'
              ? 'bg-gradient-to-b from-[#062438]/95 via-[#031826]/95 to-[#010D18]/95 border-2 border-cyan-400/80 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.4)]'
              : 'bg-gradient-to-b from-[#132247]/90 via-[#0A1224]/95 to-[#040812]/95 border-2 border-amber-500/60 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(251,191,36,0.25)]'
          }`}
        >
          {/* Top Temple Pediment Arch Trim */}
          <div
            className={`absolute -top-3 left-1/2 -translate-x-1/2 px-6 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-md ${
              theme === 'atlantis'
                ? 'bg-gradient-to-r from-cyan-700 via-teal-300 to-cyan-700 border-cyan-100 text-slate-950 shadow-[0_0_15px_#00CED1]'
                : 'bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-700 border-yellow-200 text-slate-950 shadow-md'
            }`}
          >
            {theme === 'atlantis' ? '🔱 ATLANTIS SUNKEN GRID 🔱' : 'GREEK TEMPLE GRID'}
          </div>

          {/* Grid Container */}
          <div
            className="grid gap-1.5 sm:gap-2 select-none"
            style={{
              gridTemplateColumns: `repeat(${levelConfig.gridCols}, minmax(0, 1fr))`,
            }}
          >
            {board.map((rowArr, r) =>
              rowArr.map((tile, c) => {
                const isSelected = selectedPos?.row === r && selectedPos?.col === c;
                const isHinted =
                  (hintPos?.r1 === r && hintPos?.c1 === c) ||
                  (hintPos?.r2 === r && hintPos?.c2 === c);
                const isMatched = tile ? matchedTileIds.has(tile.id) : false;

                // Marble stone obstacle
                const marbleHealth = marbleHealthMap.get(`${r},${c}`);

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleTileClick(r, c)}
                    className={`relative w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-150 transform ${
                      isSelected
                        ? theme === 'atlantis'
                          ? 'scale-110 ring-4 ring-cyan-300 shadow-[0_0_25px_#00CED1] z-20'
                          : 'scale-110 ring-4 ring-yellow-400 shadow-[0_0_20px_#FFD700] z-20'
                        : isHinted
                        ? 'animate-pulse ring-2 ring-cyan-400 scale-105'
                        : 'hover:scale-102 hover:brightness-110 active:scale-95'
                    } ${
                      isMatched ? 'scale-0 opacity-0 transition-all duration-300' : ''
                    } ${
                      marbleHealth !== undefined && marbleHealth > 0
                        ? 'bg-gradient-to-b from-stone-400 to-stone-700 border-2 border-stone-300 shadow-inner'
                        : theme === 'atlantis'
                        ? 'bg-gradient-to-b from-[#083344]/80 to-[#021827]/90 border border-cyan-500/30 hover:border-cyan-400 shadow-md'
                        : 'bg-gradient-to-b from-[#182647]/70 to-[#0A1224]/80 border border-amber-500/20 shadow-md'
                    }`}
                  >
                    {/* Marble Stone Crack Overlay if marble present */}
                    {marbleHealth !== undefined && marbleHealth > 0 && (
                      <div className="absolute inset-0 rounded-xl bg-stone-800/80 flex items-center justify-center z-10 pointer-events-none border border-stone-400/50">
                        <span className="text-sm font-serif font-black text-amber-200 opacity-90">
                          {marbleHealth > 1 ? '🏛️ x2' : '🏛️'}
                        </span>
                      </div>
                    )}

                    {/* Tile Symbol */}
                    {tile && (
                      <SymbolArt
                        symbol={tile.symbol}
                        special={tile.special}
                        size={typeof window !== 'undefined' && window.innerWidth < 640 ? 36 : 46}
                      />
                    )}

                    {/* Selection halo */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-xl border-2 border-amber-300 animate-ping opacity-50 pointer-events-none" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Oracle Hint & Auxiliary Controls Bar */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleOracleHint}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-900/80 to-blue-950/90 hover:from-cyan-800 hover:to-blue-900 border border-cyan-400/50 rounded-xl text-cyan-200 text-xs font-serif font-bold tracking-wider shadow-lg active:scale-95 transition-all"
          >
            <HelpCircle size={15} className="text-cyan-400" />
            <span>ORACLE HINT</span>
          </button>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-2 bg-black/60 hover:bg-slate-900 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-serif font-bold transition-all"
            title="Restart Level"
          >
            <RotateCcw size={15} />
            <span>RESTART</span>
          </button>
        </div>
      </main>

      {/* Pause Menu Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#0F1B38] to-black border-2 border-amber-500/60 p-6 shadow-2xl text-amber-50 text-center space-y-4">
            <h2 className="font-serif font-black text-2xl text-amber-300 tracking-wider">
              GAME PAUSED
            </h2>
            <p className="text-xs text-amber-200/80 font-serif">
              Level {levelConfig.levelNumber} • {levelConfig.realmName}
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsPaused(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-serif font-bold text-sm tracking-wider flex items-center justify-center gap-2"
              >
                <Play size={16} /> RESUME JOURNEY
              </button>

              <button
                onClick={handleRestart}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-200 font-serif text-xs font-bold flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} /> RESTART LEVEL
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsPaused(false);
                  onExitToMap();
                }}
                className="w-full py-2.5 rounded-xl bg-black/80 hover:bg-slate-900 border border-slate-700 text-slate-300 font-serif text-xs font-bold flex items-center justify-center gap-2"
              >
                <MapIcon size={14} /> EXIT TO REALM MAP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
