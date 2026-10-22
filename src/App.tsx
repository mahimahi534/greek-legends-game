import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  PlayerProfile,
  GameSettings,
  LevelObjective,
  Character,
} from './types/game';
import {
  loadPlayerProfile,
  savePlayerProfile,
  clearPlayerProfile,
} from './services/storageService';
import { getLevelConfig } from './data/levelGenerator';
import { CHARACTERS } from './data/characters';
import { soundManager } from './services/audioService';

import { MainMenu } from './components/screens/MainMenu';
import { AdventureMap } from './components/screens/AdventureMap';
import { CharacterCollection } from './components/screens/CharacterCollection';
import { PuzzleGame } from './components/screens/PuzzleGame';
import { SettingsModal } from './components/screens/SettingsModal';
import { LevelCompleteModal } from './components/screens/LevelCompleteModal';
import { LevelFailedModal } from './components/screens/LevelFailedModal';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('menu');
  const [activeLevelNumber, setActiveLevelNumber] = useState<number>(profile.currentLevel);

  // Modals
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [completeData, setCompleteData] = useState<{
    levelNumber: number;
    score: number;
    highScore: number;
    stars: number;
    xpEarned: number;
    newCharacterUnlocked: Character | null;
  } | null>(null);

  const [failedData, setFailedData] = useState<{
    levelNumber: number;
    objectives: LevelObjective[];
  } | null>(null);

  // Sync audio settings with soundManager
  useEffect(() => {
    soundManager.setSoundEnabled(profile.settings.soundEnabled);
    soundManager.setMusicEnabled(profile.settings.musicEnabled);
    soundManager.setVolume(profile.settings.volume);
  }, []);

  // Save profile whenever it updates
  useEffect(() => {
    savePlayerProfile(profile);
  }, [profile]);

  // Audio toggles
  const handleToggleSound = () => {
    const next = !profile.settings.soundEnabled;
    soundManager.setSoundEnabled(next);
    setProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: next },
    }));
  };

  const handleToggleMusic = () => {
    const next = !profile.settings.musicEnabled;
    soundManager.setMusicEnabled(next);
    setProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, musicEnabled: next },
    }));
  };

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const handleResetProgress = () => {
    const fresh = clearPlayerProfile();
    setProfile(fresh);
    setActiveLevelNumber(1);
    setCurrentScreen('menu');
  };

  // Guardian Selection
  const handleSelectGuardian = (characterId: string) => {
    setProfile((prev) => ({
      ...prev,
      selectedCharacterId: characterId,
    }));
  };

  // Start Playing a Level
  const handleStartLevel = (levelNumber: number) => {
    setActiveLevelNumber(levelNumber);
    setCompleteData(null);
    setFailedData(null);
    setCurrentScreen('game');
  };

  // Level Complete Handler
  const handleLevelComplete = (score: number, stars: number) => {
    const activeGuardian = CHARACTERS.find((c) => c.id === profile.selectedCharacterId);

    // Calculate XP earned (Pegasus bonus if active)
    let xpGain = Math.round(activeLevelNumber * 120 + score / 8);
    if (activeGuardian?.id === 'pegasus') {
      xpGain = Math.round(xpGain * (1 + activeGuardian.divineBlessing.bonusValue));
    }

    // Previous high score
    const existing = profile.completedLevels[activeLevelNumber];
    const prevHighScore = existing ? existing.highScore : 0;
    const finalHighScore = Math.max(score, prevHighScore);
    const finalStars = Math.max(stars, existing ? existing.stars : 0);

    // Next level unlock
    const nextLevel = Math.min(1000, activeLevelNumber + 1);
    const newMaxLevel = Math.max(profile.maxUnlockedLevel, nextLevel);

    // Check for newly unlocked characters
    let newlyUnlockedChar: Character | null = null;
    const currentUnlockedIds = new Set(profile.unlockedCharacterIds);

    CHARACTERS.forEach((char) => {
      if (activeLevelNumber >= char.unlockLevel && !currentUnlockedIds.has(char.id)) {
        currentUnlockedIds.add(char.id);
        newlyUnlockedChar = char;
      }
    });

    // Update state
    setProfile((prev) => ({
      ...prev,
      currentLevel: nextLevel,
      maxUnlockedLevel: newMaxLevel,
      totalXp: prev.totalXp + xpGain,
      completedLevels: {
        ...prev.completedLevels,
        [activeLevelNumber]: {
          stars: finalStars,
          highScore: finalHighScore,
          completedAt: new Date().toISOString(),
        },
      },
      unlockedCharacterIds: Array.from(currentUnlockedIds),
    }));

    setCompleteData({
      levelNumber: activeLevelNumber,
      score,
      highScore: finalHighScore,
      stars,
      xpEarned: xpGain,
      newCharacterUnlocked: newlyUnlockedChar,
    });
  };

  // Level Failed Handler
  const handleLevelFailed = (objectives: LevelObjective[]) => {
    setFailedData({
      levelNumber: activeLevelNumber,
      objectives,
    });
  };

  // Effective visual theme: Olympus vs Atlantis
  const effectiveTheme: 'olympus' | 'atlantis' =
    profile.settings.themeMode === 'atlantis'
      ? 'atlantis'
      : profile.settings.themeMode === 'olympus'
      ? 'olympus'
      : activeLevelNumber >= 201 && activeLevelNumber <= 300
      ? 'atlantis'
      : 'olympus';

  const handleToggleTheme = () => {
    const nextTheme: 'olympus' | 'atlantis' = effectiveTheme === 'atlantis' ? 'olympus' : 'atlantis';
    setProfile((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        themeMode: nextTheme,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-amber-50">
      {/* Active Screen */}
      {currentScreen === 'menu' && (
        <MainMenu
          profile={profile}
          theme={effectiveTheme}
          onToggleTheme={handleToggleTheme}
          onPlay={() => handleStartLevel(profile.currentLevel)}
          onOpenMap={() => setCurrentScreen('map')}
          onOpenCharacters={() => setCurrentScreen('characters')}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {currentScreen === 'map' && (
        <AdventureMap
          profile={profile}
          onSelectLevel={(lvl) => handleStartLevel(lvl)}
          onBack={() => setCurrentScreen('menu')}
          onOpenSettings={() => setShowSettings(true)}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {currentScreen === 'characters' && (
        <CharacterCollection
          profile={profile}
          onSelectGuardian={handleSelectGuardian}
          onBack={() => setCurrentScreen('menu')}
          onOpenSettings={() => setShowSettings(true)}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {currentScreen === 'game' && (
        <PuzzleGame
          key={activeLevelNumber}
          levelConfig={getLevelConfig(activeLevelNumber)}
          profile={profile}
          theme={effectiveTheme}
          onLevelComplete={handleLevelComplete}
          onLevelFailed={handleLevelFailed}
          onExitToMap={() => setCurrentScreen('map')}
        />
      )}

      {/* Global Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={profile.settings}
          onUpdateSettings={handleUpdateSettings}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Level Complete Modal */}
      {completeData && (
        <LevelCompleteModal
          levelNumber={completeData.levelNumber}
          score={completeData.score}
          highScore={completeData.highScore}
          stars={completeData.stars}
          xpEarned={completeData.xpEarned}
          newCharacterUnlocked={completeData.newCharacterUnlocked}
          onNextLevel={() => {
            if (activeLevelNumber < 1000) {
              handleStartLevel(activeLevelNumber + 1);
            }
          }}
          onReplay={() => handleStartLevel(activeLevelNumber)}
          onGoToMap={() => {
            setCompleteData(null);
            setCurrentScreen('map');
          }}
        />
      )}

      {/* Level Failed Modal */}
      {failedData && (
        <LevelFailedModal
          levelNumber={failedData.levelNumber}
          objectives={failedData.objectives}
          onRetry={() => handleStartLevel(activeLevelNumber)}
          onGoToMap={() => {
            setFailedData(null);
            setCurrentScreen('map');
          }}
        />
      )}
    </div>
  );
};
