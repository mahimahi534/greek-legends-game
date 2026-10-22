# Greek Legends: Rise of the Gods 🏛️⚡

> A mythology-themed symbol-matching puzzle adventure game inspired by ancient Greece.
> **Entertainment-Only**: No real-money gambling, no betting, no deposits, and no slot-machine wagering.

---

## 🏛️ Game Concept & Features

**Greek Legends: Rise of the Gods** transports players across ancient Greece to explore mythological sanctuaries, shatter marble obstacle blocks, unleash divine power-ups, collect heroic characters, and ascend through 1,000 adventure levels.

### 🌟 Key Highlights
- **Playable Match-Three Adventure Engine**:
  - Valid swap detection with adjacency rules.
  - Cascading chain reactions and combo score multipliers.
  - Special divine creations:
    - **Zeus Lightning (4-in-a-row)**: Clears an entire horizontal row or vertical column with crackling thunder.
    - **Pandora's Blast (T or L-shape)**: Detonates a 3×3 (or 5×5 with Hades) area of tiles.
    - **Sun Supernova (5-in-a-row)**: Radiates outward to vaporize all tiles matching that symbol across the board.
  - **Marble Stone Obstacles**: Ancient blocks requiring adjacent matches to crack and shatter.
  - **Oracle's Hint**: Highlights a valid tactical move when requested.
  - **Divine Auto-Shuffle**: Re-distributes tiles automatically if no valid moves exist on the board so you never get stuck.

- **1,000 Levels Across 10 Mythological Realms**:
  1. *Mount Olympus (1–100)*: The Sacred Peak of the Gods.
  2. *Athens Acropolis (101–200)*: Citadel of Wisdom & Parthenon.
  3. *Aegean Sunken Atlantis (201–300)*: Poseidon's Fathomless Palace.
  4. *Sanctuary of Delphi (301–400)*: The Sun Oracle's Valley.
  5. *Underworld of Hades (401–500)*: River Styx & The Asphodel Meadows.
  6. *Island of Crete (501–600)*: The Legendary Daedalian Labyrinth.
  7. *Colossus of Rhodes (601–700)*: The Radiant Harbor of Helios.
  8. *Mount Cithaeron (701–800)*: Trials of Herculean Valor.
  9. *Sanctum of Sarpedon (801–900)*: Medusa's Petrified Sanctuary.
  10. *The Celestial Zenith (901–1,000)*: Throne of the Supreme God.
  - Includes a direct level jump explorer allowing instant navigation to any level (1–1000).

- **8 Original Mythological Guardians**:
  1. **Zeus**: King of the Gods (*Wrath of Olympus: +25% score on lightning and gold matches*).
  2. **Athena**: Goddess of Wisdom (*Aegis of Wisdom: +3 bonus moves on every level*).
  3. **Poseidon**: Earth-Shaker & Sea Sovereign (*Tidal Crest: +30% score on ocean and amphora matches*).
  4. **Hercules**: Champion of Mortals (*Nemean Might: Double damage to marble stone obstacles*).
  5. **Pegasus**: The Winged Celestial (*Celestial Flight: +35% bonus XP on completed levels*).
  6. **Helios**: Titan of the Golden Sun (*Solar Flare: Supernovas clear an extra row*).
  7. **Hades**: Lord of the Underworld (*Underworld Resonance: Expands Pandora's blast to 5×5*).
  8. **Medusa**: Guardian of the Sacred Aegis (*Gorgon Gaze: +50% combo multiplier on consecutive cascades*).

- **Procedural Web Audio API Soundscape**:
  - Real-time synthesized Greek Dorian harp/lyre melodies and celestial atmospheric drone.
  - Dynamic sound effects: marble taps, tile swap whooshes, harmonic chord chimes (rising with combo count), thunder strikes, and victory fanfares.
  - Independent sound effects and music toggles with volume slider.

- **Local Persistence & Player Progression**:
  - Saves current level, completed levels with 1–3 star ratings and high scores, total XP, and unlocked guardians in `localStorage`.
  - Player ranks advance from *Mortal Seeker* through *Spartan Initiate*, *Hero of Hellas*, *Divine Champion*, *Titan Slayer*, up to *Supreme God of Olympus*.

---

## 🛠️ Technology Stack

- **Runtime & Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Greek mythology tokens (gold, bronze, marble, ocean, navy)
- **Typography**: Google Fonts (*Cinzel* & *Cinzel Decorative*)
- **Icons & Art**: Custom SVG vector illustrations & Lucide Icons
- **Celebration FX**: Canvas Confetti
- **Audio**: Web Audio API (Synthesizer & Oscillators)
- **Testing**: Vitest unit test suite

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer recommended, tested on v22.17.0)
- npm (v9 or newer, tested on v10.9.2)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 3. Run Test Suite
```bash
npm test
```
Executes all unit tests covering adjacency, match detection, powerup generation, gravity refills, and level generator logic (levels 1 to 1000).

### 4. Build for Production
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```
Serves the production bundle locally at `http://localhost:4173/`.

---

## 🏛️ Project Architecture

```
greek/
├── index.html                           # HTML entry point with Cinzel Greek typography
├── package.json                         # Project dependencies and npm scripts
├── vite.config.ts                       # Vite bundling configuration
├── tsconfig.json                        # TypeScript compiler options
├── tailwind.config.js                   # Greek mythology color palette & animations
├── src/
│   ├── main.tsx                         # React root entry
│   ├── App.tsx                          # Root state router & modal orchestrator
│   ├── index.css                        # Tailwind directives & classical Greek styles
│   ├── types/
│   │   └── game.ts                      # Core models: Symbols, Levels, Characters, Profile
│   ├── data/
│   │   ├── characters.ts                # Profiles, lore, and divine blessings for 8 gods
│   │   └── levelGenerator.ts            # Procedural level generator for levels 1 to 1000
│   ├── utils/
│   │   ├── matchThreeEngine.ts          # Match-3 engine (swaps, special tiles, gravity)
│   │   └── matchThreeEngine.test.ts     # Vitest unit test suite (13 test cases)
│   ├── services/
│   │   ├── audioService.ts              # Web Audio procedural synth & ambient lyre
│   │   └── storageService.ts            # LocalStorage persistence & player rank system
│   └── components/
│       ├── common/
│       │   ├── GreekHeader.tsx          # Top bar with meander trim, sound & rank
│       │   └── GreekLandscape.tsx       # Animated Mount Olympus landscape & stars
│       ├── art/
│       │   ├── SymbolArt.tsx            # Custom SVG artwork for all 8 symbols & powerups
│       │   └── CharacterArt.tsx         # Detailed SVG portraits for all 8 Greek guardians
│       └── screens/
│           ├── MainMenu.tsx             # Animated main menu with Greek Legends logo
│           ├── AdventureMap.tsx         # 10-realm map explorer & level jump (1-1000)
│           ├── CharacterCollection.tsx  # Pantheon gallery with mythos & guardian equip
│           ├── PuzzleGame.tsx           # Match-three board with columns, moves, combos
│           ├── LevelCompleteModal.tsx   # Victory fanfare, star ratings, XP, & confetti
│           ├── LevelFailedModal.tsx     # Defeat banner, objective breakdown & retry
│           └── SettingsModal.tsx        # Sound, lyre music, volume & progress reset
```

---

## 📜 Legal & Compliance

This game is designed purely for **entertainment and recreational puzzle gaming**. It contains **no gambling elements**:
- No wagering, bets, or real money currency.
- No slot-machine reel payout mechanisms.
- No in-app purchases or deposits.
- All progression, stars, and unlockables are earned exclusively through puzzle skill and gameplay.
