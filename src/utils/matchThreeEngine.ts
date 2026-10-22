import { TileData, SymbolType, SpecialTileType, Character } from '../types/game';

export interface MatchResult {
  matchedTileIds: Set<string>;
  matchedPositions: { row: number; col: number; symbol: SymbolType }[];
  specialCreations: { row: number; col: number; symbol: SymbolType; special: SpecialTileType }[];
  brokenMarblePositions: { row: number; col: number }[];
  scoreGained: number;
  clearedSymbolCounts: Partial<Record<SymbolType, number>>;
}

let tileIdCounter = 1;
export const getUniqueTileId = (): string => `tile_${Date.now()}_${tileIdCounter++}`;

export const areAdjacent = (
  r1: number,
  c1: number,
  r2: number,
  c2: number
): boolean => {
  return (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
};

/**
 * Creates an initial board with no 3-in-a-row matches.
 */
export const createInitialBoard = (
  rows: number,
  cols: number,
  availableSymbols: SymbolType[]
): (TileData | null)[][] => {
  const board: (TileData | null)[][] = [];

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      // Pick a symbol that does not create a 3-match with already placed left or top neighbors
      const forbiddenSymbols: SymbolType[] = [];

      if (c >= 2 && board[r][c - 1]?.symbol === board[r][c - 2]?.symbol) {
        forbiddenSymbols.push(board[r][c - 1]!.symbol);
      }
      if (r >= 2 && board[r - 1][c]?.symbol === board[r - 2][c]?.symbol) {
        forbiddenSymbols.push(board[r - 1][c]!.symbol);
      }

      const validSymbols = availableSymbols.filter((s) => !forbiddenSymbols.includes(s));
      const chosenSymbol = validSymbols.length > 0
        ? validSymbols[Math.floor(Math.random() * validSymbols.length)]
        : availableSymbols[Math.floor(Math.random() * availableSymbols.length)];

      board[r][c] = {
        id: getUniqueTileId(),
        symbol: chosenSymbol,
        special: 'none',
        row: r,
        col: c,
      };
    }
  }

  return board;
};

/**
 * Finds all matches (horizontal, vertical, L/T shapes) and determines special tile creations.
 */
export const detectMatches = (
  board: (TileData | null)[][],
  marbleHealthMap: Map<string, number>,
  guardian: Character | null,
  comboLevel: number = 1,
  swappedOrigin?: { row: number; col: number }
): MatchResult => {
  const rows = board.length;
  const cols = board[0].length;
  const matchedTileIds = new Set<string>();
  const matchedPositions: { row: number; col: number; symbol: SymbolType }[] = [];
  const specialCreations: { row: number; col: number; symbol: SymbolType; special: SpecialTileType }[] = [];
  const clearedSymbolCounts: Partial<Record<SymbolType, number>> = {};
  const brokenMarblePositions: { row: number; col: number }[] = [];

  // Track horizontal runs
  const hMatches: { row: number; cols: number[]; symbol: SymbolType }[] = [];
  for (let r = 0; r < rows; r++) {
    let matchLen = 1;
    for (let c = 0; c < cols; c++) {
      const current = board[r][c];
      const next = c + 1 < cols ? board[r][c + 1] : null;

      if (current && next && current.symbol === next.symbol) {
        matchLen++;
      } else {
        if (matchLen >= 3 && current) {
          const colIndices = [];
          for (let k = c - matchLen + 1; k <= c; k++) {
            colIndices.push(k);
          }
          hMatches.push({ row: r, cols: colIndices, symbol: current.symbol });
        }
        matchLen = 1;
      }
    }
  }

  // Track vertical runs
  const vMatches: { col: number; rows: number[]; symbol: SymbolType }[] = [];
  for (let c = 0; c < cols; c++) {
    let matchLen = 1;
    for (let r = 0; r < rows; r++) {
      const current = board[r][c];
      const next = r + 1 < rows ? board[r + 1][c] : null;

      if (current && next && current.symbol === next.symbol) {
        matchLen++;
      } else {
        if (matchLen >= 3 && current) {
          const rowIndices = [];
          for (let k = r - matchLen + 1; k <= r; k++) {
            rowIndices.push(k);
          }
          vMatches.push({ col: c, rows: rowIndices, symbol: current.symbol });
        }
        matchLen = 1;
      }
    }
  }

  // Record matched tiles
  hMatches.forEach((m) => {
    m.cols.forEach((c) => {
      const t = board[m.row][c];
      if (t) {
        matchedTileIds.add(t.id);
        matchedPositions.push({ row: m.row, col: c, symbol: t.symbol });
        clearedSymbolCounts[t.symbol] = (clearedSymbolCounts[t.symbol] || 0) + 1;
      }
    });
  });

  vMatches.forEach((m) => {
    m.rows.forEach((r) => {
      const t = board[r][m.col];
      if (t) {
        matchedTileIds.add(t.id);
        matchedPositions.push({ row: r, col: m.col, symbol: t.symbol });
        clearedSymbolCounts[t.symbol] = (clearedSymbolCounts[t.symbol] || 0) + 1;
      }
    });
  });

  // Check for special tile creations:
  // 1. Intersection (T or L shape) -> Pandora Blast (3x3 explosive)
  for (const hm of hMatches) {
    for (const vm of vMatches) {
      if (hm.symbol === vm.symbol && vm.rows.includes(hm.row) && hm.cols.includes(vm.col)) {
        specialCreations.push({
          row: hm.row,
          col: vm.col,
          symbol: hm.symbol,
          special: 'pandora_blast',
        });
      }
    }
  }

  // 2. 5-in-a-row -> Sun Supernova
  hMatches.forEach((hm) => {
    if (hm.cols.length >= 5) {
      const targetCol = swappedOrigin && swappedOrigin.row === hm.row && hm.cols.includes(swappedOrigin.col)
        ? swappedOrigin.col
        : hm.cols[Math.floor(hm.cols.length / 2)];
      specialCreations.push({
        row: hm.row,
        col: targetCol,
        symbol: hm.symbol,
        special: 'sun_supernova',
      });
    }
  });

  vMatches.forEach((vm) => {
    if (vm.rows.length >= 5) {
      const targetRow = swappedOrigin && swappedOrigin.col === vm.col && vm.rows.includes(swappedOrigin.row)
        ? swappedOrigin.row
        : vm.rows[Math.floor(vm.rows.length / 2)];
      specialCreations.push({
        row: targetRow,
        col: vm.col,
        symbol: vm.symbol,
        special: 'sun_supernova',
      });
    }
  });

  // 3. 4-in-a-row -> Lightning H or V
  hMatches.forEach((hm) => {
    if (hm.cols.length === 4) {
      const targetCol = swappedOrigin && swappedOrigin.row === hm.row && hm.cols.includes(swappedOrigin.col)
        ? swappedOrigin.col
        : hm.cols[1];
      specialCreations.push({
        row: hm.row,
        col: targetCol,
        symbol: hm.symbol,
        special: 'lightning_h',
      });
    }
  });

  vMatches.forEach((vm) => {
    if (vm.rows.length === 4) {
      const targetRow = swappedOrigin && swappedOrigin.col === vm.col && vm.rows.includes(swappedOrigin.row)
        ? swappedOrigin.row
        : vm.rows[1];
      specialCreations.push({
        row: targetRow,
        col: vm.col,
        symbol: vm.symbol,
        special: 'lightning_v',
      });
    }
  });

  // Check if any matched tile already was a special tile and trigger its explosion
  const tilesToExplode: TileData[] = [];
  matchedPositions.forEach((pos) => {
    const tile = board[pos.row][pos.col];
    if (tile && tile.special !== 'none' && !tile.isSpecialActivated) {
      tile.isSpecialActivated = true;
      tilesToExplode.push(tile);
    }
  });

  // Process special tile detonations
  while (tilesToExplode.length > 0) {
    const tile = tilesToExplode.pop()!;
    if (tile.special === 'lightning_h') {
      // Clear entire row
      for (let c = 0; c < cols; c++) {
        const neighbor = board[tile.row][c];
        if (neighbor && !matchedTileIds.has(neighbor.id)) {
          matchedTileIds.add(neighbor.id);
          matchedPositions.push({ row: tile.row, col: c, symbol: neighbor.symbol });
          clearedSymbolCounts[neighbor.symbol] = (clearedSymbolCounts[neighbor.symbol] || 0) + 1;
          if (neighbor.special !== 'none' && !neighbor.isSpecialActivated) {
            neighbor.isSpecialActivated = true;
            tilesToExplode.push(neighbor);
          }
        }
      }
    } else if (tile.special === 'lightning_v') {
      // Clear entire column
      for (let r = 0; r < rows; r++) {
        const neighbor = board[r][tile.col];
        if (neighbor && !matchedTileIds.has(neighbor.id)) {
          matchedTileIds.add(neighbor.id);
          matchedPositions.push({ row: r, col: tile.col, symbol: neighbor.symbol });
          clearedSymbolCounts[neighbor.symbol] = (clearedSymbolCounts[neighbor.symbol] || 0) + 1;
          if (neighbor.special !== 'none' && !neighbor.isSpecialActivated) {
            neighbor.isSpecialActivated = true;
            tilesToExplode.push(neighbor);
          }
        }
      }
    } else if (tile.special === 'pandora_blast') {
      // 3x3 blast (or 5x5 if Hades blessing active)
      const blastRadius = guardian?.id === 'hades' ? 2 : 1;
      for (let r = Math.max(0, tile.row - blastRadius); r <= Math.min(rows - 1, tile.row + blastRadius); r++) {
        for (let c = Math.max(0, tile.col - blastRadius); c <= Math.min(cols - 1, tile.col + blastRadius); c++) {
          const neighbor = board[r][c];
          if (neighbor && !matchedTileIds.has(neighbor.id)) {
            matchedTileIds.add(neighbor.id);
            matchedPositions.push({ row: r, col: c, symbol: neighbor.symbol });
            clearedSymbolCounts[neighbor.symbol] = (clearedSymbolCounts[neighbor.symbol] || 0) + 1;
            if (neighbor.special !== 'none' && !neighbor.isSpecialActivated) {
              neighbor.isSpecialActivated = true;
              tilesToExplode.push(neighbor);
            }
          }
        }
      }
    } else if (tile.special === 'sun_supernova') {
      // Clears all tiles of the same symbol
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const neighbor = board[r][c];
          if (neighbor && neighbor.symbol === tile.symbol && !matchedTileIds.has(neighbor.id)) {
            matchedTileIds.add(neighbor.id);
            matchedPositions.push({ row: r, col: c, symbol: neighbor.symbol });
            clearedSymbolCounts[neighbor.symbol] = (clearedSymbolCounts[neighbor.symbol] || 0) + 1;
            if (neighbor.special !== 'none' && !neighbor.isSpecialActivated) {
              neighbor.isSpecialActivated = true;
              tilesToExplode.push(neighbor);
            }
          }
        }
      }
    }
  }

  // Handle adjacent marble damage
  if (marbleHealthMap.size > 0 && matchedPositions.length > 0) {
    const damagePerHit = guardian?.id === 'hercules' ? 2 : 1;

    for (const [key, currentHealth] of Array.from(marbleHealthMap.entries())) {
      const [mr, mc] = key.split(',').map(Number);
      // Check if any matched position is on or adjacent to this marble cell
      const isHit = matchedPositions.some((pos) => {
        return (
          (pos.row === mr && pos.col === mc) ||
          (Math.abs(pos.row - mr) <= 1 && Math.abs(pos.col - mc) <= 1)
        );
      });

      if (isHit) {
        const newHealth = currentHealth - damagePerHit;
        if (newHealth <= 0) {
          marbleHealthMap.delete(key);
          brokenMarblePositions.push({ row: mr, col: mc });
        } else {
          marbleHealthMap.set(key, newHealth);
        }
      }
    }
  }

  // Calculate score gained
  const basePointsPerTile = 60;
  let scoreGained = matchedTileIds.size * basePointsPerTile;

  // Bonus for larger matches
  if (matchedTileIds.size >= 4) scoreGained += 150;
  if (matchedTileIds.size >= 5) scoreGained += 400;

  // Guardian blessing score multipliers
  if (guardian) {
    if (guardian.id === 'zeus') {
      const lightningCount = clearedSymbolCounts['zeus'] || 0;
      scoreGained += Math.round(lightningCount * basePointsPerTile * guardian.divineBlessing.bonusValue);
    } else if (guardian.id === 'poseidon') {
      const waterCount = (clearedSymbolCounts['poseidon'] || 0) + (clearedSymbolCounts['amphora'] || 0);
      scoreGained += Math.round(waterCount * basePointsPerTile * guardian.divineBlessing.bonusValue);
    } else if (guardian.id === 'medusa' && comboLevel > 1) {
      scoreGained = Math.round(scoreGained * (1 + guardian.divineBlessing.bonusValue));
    }
  }

  // Combo multiplier
  const comboMultiplier = 1 + (comboLevel - 1) * 0.4;
  scoreGained = Math.round(scoreGained * comboMultiplier);

  return {
    matchedTileIds,
    matchedPositions,
    specialCreations,
    brokenMarblePositions,
    scoreGained,
    clearedSymbolCounts,
  };
};

/**
 * Executes gravity: existing tiles drop down, empty cells are refilled with new tiles.
 */
export const applyGravityAndRefill = (
  board: (TileData | null)[][],
  availableSymbols: SymbolType[]
): { newBoard: (TileData | null)[][]; droppedTilesCount: number } => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard: (TileData | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  let droppedTilesCount = 0;

  for (let c = 0; c < cols; c++) {
    // Collect non-null tiles from bottom to top
    const remainingInCol: TileData[] = [];
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][c] !== null) {
        remainingInCol.push(board[r][c]!);
      }
    }

    // Place remaining tiles into bottom slots
    let targetRow = rows - 1;
    for (const tile of remainingInCol) {
      if (tile.row !== targetRow) {
        droppedTilesCount++;
      }
      newBoard[targetRow][c] = {
        ...tile,
        row: targetRow,
        col: c,
        isNew: false,
        isSpecialActivated: false,
      };
      targetRow--;
    }

    // Fill top empty spaces with newly spawned tiles
    while (targetRow >= 0) {
      const randomSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
      newBoard[targetRow][c] = {
        id: getUniqueTileId(),
        symbol: randomSymbol,
        special: 'none',
        row: targetRow,
        col: c,
        isNew: true,
      };
      droppedTilesCount++;
      targetRow--;
    }
  }

  return { newBoard, droppedTilesCount };
};

/**
 * Checks if there is at least one valid swap on the board that creates a match >= 3.
 */
export const hasValidMoves = (
  board: (TileData | null)[][],
  marbleHealthMap: Map<string, number>
): boolean => {
  const rows = board.length;
  const cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Try swap right
      if (c + 1 < cols) {
        // Swap
        const copyBoard = board.map((row) => row.map((tile) => (tile ? { ...tile } : null)));
        const t1 = copyBoard[r][c];
        const t2 = copyBoard[r][c + 1];
        if (t1 && t2) {
          copyBoard[r][c] = { ...t2, row: r, col: c };
          copyBoard[r][c + 1] = { ...t1, row: r, col: c + 1 };
          const result = detectMatches(copyBoard, marbleHealthMap, null, 1);
          if (result.matchedTileIds.size >= 3) return true;
        }
      }

      // Try swap down
      if (r + 1 < rows) {
        const copyBoard = board.map((row) => row.map((tile) => (tile ? { ...tile } : null)));
        const t1 = copyBoard[r][c];
        const t2 = copyBoard[r + 1][c];
        if (t1 && t2) {
          copyBoard[r][c] = { ...t2, row: r, col: c };
          copyBoard[r + 1][c] = { ...t1, row: r + 1, col: c };
          const result = detectMatches(copyBoard, marbleHealthMap, null, 1);
          if (result.matchedTileIds.size >= 3) return true;
        }
      }
    }
  }

  return false;
};

/**
 * Shuffles current tiles on the board if no valid moves exist.
 */
export const shuffleBoard = (
  board: (TileData | null)[][],
  availableSymbols: SymbolType[]
): (TileData | null)[][] => {
  const rows = board.length;
  const cols = board[0].length;
  const symbols: { symbol: SymbolType; special: SpecialTileType }[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c]) {
        symbols.push({ symbol: board[r][c]!.symbol, special: board[r][c]!.special });
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }

  let idx = 0;
  const newBoard: (TileData | null)[][] = [];
  for (let r = 0; r < rows; r++) {
    newBoard[r] = [];
    for (let c = 0; c < cols; c++) {
      const item = symbols[idx++] || {
        symbol: availableSymbols[0],
        special: 'none' as SpecialTileType,
      };
      newBoard[r][c] = {
        id: getUniqueTileId(),
        symbol: item.symbol,
        special: item.special,
        row: r,
        col: c,
      };
    }
  }

  return newBoard;
};
