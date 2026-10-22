import { describe, it, expect } from 'vitest';
import {
  areAdjacent,
  createInitialBoard,
  detectMatches,
  applyGravityAndRefill,
  hasValidMoves,
} from './matchThreeEngine';
import { getLevelConfig, getRealmForLevel } from '../data/levelGenerator';
import { TileData, SymbolType } from '../types/game';

describe('Match Three Engine', () => {
  const symbols: SymbolType[] = ['zeus', 'athena', 'poseidon', 'sun', 'amphora'];

  it('correctly checks adjacency', () => {
    expect(areAdjacent(0, 0, 0, 1)).toBe(true);
    expect(areAdjacent(0, 0, 1, 0)).toBe(true);
    expect(areAdjacent(0, 0, 1, 1)).toBe(false); // diagonal is not adjacent
    expect(areAdjacent(0, 0, 0, 2)).toBe(false);
  });

  it('creates an initial board without immediate 3-matches', () => {
    const board = createInitialBoard(7, 7, symbols);
    expect(board.length).toBe(7);
    expect(board[0].length).toBe(7);

    // Initial board must have 0 matches
    const marbleMap = new Map<string, number>();
    const matches = detectMatches(board, marbleMap, null, 1);
    expect(matches.matchedTileIds.size).toBe(0);
  });

  it('detects 3 horizontal identical symbols', () => {
    const board: (TileData | null)[][] = [
      [
        { id: '1', symbol: 'zeus', special: 'none', row: 0, col: 0 },
        { id: '2', symbol: 'zeus', special: 'none', row: 0, col: 1 },
        { id: '3', symbol: 'zeus', special: 'none', row: 0, col: 2 },
      ],
      [
        { id: '4', symbol: 'athena', special: 'none', row: 1, col: 0 },
        { id: '5', symbol: 'poseidon', special: 'none', row: 1, col: 1 },
        { id: '6', symbol: 'sun', special: 'none', row: 1, col: 2 },
      ],
      [
        { id: '7', symbol: 'amphora', special: 'none', row: 2, col: 0 },
        { id: '8', symbol: 'athena', special: 'none', row: 2, col: 1 },
        { id: '9', symbol: 'poseidon', special: 'none', row: 2, col: 2 },
      ],
    ];

    const marbleMap = new Map<string, number>();
    const result = detectMatches(board, marbleMap, null, 1);
    expect(result.matchedTileIds.has('1')).toBe(true);
    expect(result.matchedTileIds.has('2')).toBe(true);
    expect(result.matchedTileIds.has('3')).toBe(true);
    expect(result.matchedTileIds.size).toBe(3);
    expect(result.scoreGained).toBeGreaterThan(0);
  });

  it('detects 4-in-a-row and creates a lightning special tile', () => {
    const board: (TileData | null)[][] = [
      [
        { id: '1', symbol: 'sun', special: 'none', row: 0, col: 0 },
        { id: '2', symbol: 'sun', special: 'none', row: 0, col: 1 },
        { id: '3', symbol: 'sun', special: 'none', row: 0, col: 2 },
        { id: '4', symbol: 'sun', special: 'none', row: 0, col: 3 },
      ],
    ];

    const marbleMap = new Map<string, number>();
    const result = detectMatches(board, marbleMap, null, 1);
    expect(result.matchedTileIds.size).toBe(4);
    expect(result.specialCreations.length).toBe(1);
    expect(result.specialCreations[0].special).toBe('lightning_h');
  });

  it('detects 5-in-a-row and creates a sun supernova special tile', () => {
    const board: (TileData | null)[][] = [
      [
        { id: '1', symbol: 'athena', special: 'none', row: 0, col: 0 },
        { id: '2', symbol: 'athena', special: 'none', row: 0, col: 1 },
        { id: '3', symbol: 'athena', special: 'none', row: 0, col: 2 },
        { id: '4', symbol: 'athena', special: 'none', row: 0, col: 3 },
        { id: '5', symbol: 'athena', special: 'none', row: 0, col: 4 },
      ],
    ];

    const marbleMap = new Map<string, number>();
    const result = detectMatches(board, marbleMap, null, 1);
    expect(result.matchedTileIds.size).toBe(5);
    expect(result.specialCreations.length).toBe(1);
    expect(result.specialCreations[0].special).toBe('sun_supernova');
  });

  it('damages adjacent marble blocks on match', () => {
    const board: (TileData | null)[][] = [
      [
        { id: '1', symbol: 'zeus', special: 'none', row: 0, col: 0 },
        { id: '2', symbol: 'zeus', special: 'none', row: 0, col: 1 },
        { id: '3', symbol: 'zeus', special: 'none', row: 0, col: 2 },
      ],
    ];

    // Marble at row 1, col 1 (adjacent to match)
    const marbleMap = new Map<string, number>();
    marbleMap.set('1,1', 1);

    const result = detectMatches(board, marbleMap, null, 1);
    expect(result.brokenMarblePositions.length).toBe(1);
    expect(result.brokenMarblePositions[0]).toEqual({ row: 1, col: 1 });
    expect(marbleMap.has('1,1')).toBe(false);
  });

  it('drops tiles down and refills board after match', () => {
    const board: (TileData | null)[][] = [
      [
        null,
        { id: '2', symbol: 'zeus', special: 'none', row: 0, col: 1 },
      ],
      [
        { id: '1', symbol: 'athena', special: 'none', row: 1, col: 0 },
        null,
      ],
    ];

    const { newBoard, droppedTilesCount } = applyGravityAndRefill(board, symbols);
    expect(newBoard[0][0]).not.toBeNull();
    expect(newBoard[0][1]).not.toBeNull();
    expect(newBoard[1][0]).not.toBeNull();
    expect(newBoard[1][1]).not.toBeNull();
    expect(droppedTilesCount).toBeGreaterThan(0);
  });

  it('detects whether valid moves exist', () => {
    const board = createInitialBoard(7, 7, symbols);
    const marbleMap = new Map<string, number>();
    const hasMoves = hasValidMoves(board, marbleMap);
    expect(typeof hasMoves).toBe('boolean');
  });
});

describe('Level Generator (1 to 1000)', () => {
  it('generates Level 1 with valid objectives and bounds', () => {
    const lvl1 = getLevelConfig(1);
    expect(lvl1.levelNumber).toBe(1);
    expect(lvl1.moves).toBeGreaterThanOrEqual(18);
    expect(lvl1.targetScore).toBeGreaterThan(0);
    expect(lvl1.objectives.length).toBeGreaterThanOrEqual(2);
    expect(lvl1.availableSymbols.length).toBeGreaterThanOrEqual(5);
  });

  it('generates Level 100 with Mount Olympus realm', () => {
    const lvl100 = getLevelConfig(100);
    expect(lvl100.levelNumber).toBe(100);
    expect(lvl100.realmName).toBe('Mount Olympus');
  });

  it('generates Level 500 with Underworld realm', () => {
    const lvl500 = getLevelConfig(500);
    expect(lvl500.levelNumber).toBe(500);
    expect(lvl500.realmName).toBe('Underworld of Hades');
  });

  it('generates Level 1000 with Celestial Zenith realm and high stakes', () => {
    const lvl1000 = getLevelConfig(1000);
    expect(lvl1000.levelNumber).toBe(1000);
    expect(lvl1000.realmName).toBe('The Celestial Zenith');
    expect(lvl1000.targetScore).toBeGreaterThan(100000);
    expect(lvl1000.moves).toBeGreaterThanOrEqual(18);
    expect(lvl1000.availableSymbols.length).toBe(8);
  });

  it('correctly maps realms for different level brackets', () => {
    expect(getRealmForLevel(1).name).toBe('Mount Olympus');
    expect(getRealmForLevel(150).name).toBe('Athens Acropolis');
    expect(getRealmForLevel(250).name).toBe('Aegean Sunken Atlantis');
    expect(getRealmForLevel(999).name).toBe('The Celestial Zenith');
  });
});
