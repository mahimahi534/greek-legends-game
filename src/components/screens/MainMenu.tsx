import React from 'react';
import { Play, Map as MapIcon, Users, Settings, Award, ChevronRight } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { GreekLandscape } from '../common/GreekLandscape';
import { CHARACTERS } from '../../data/characters';
import { CharacterArt } from '../art/CharacterArt';
import { soundManager } from '../../services/audioService';
import { getPlayerRank } from '../../services/storageService';

interface MainMenuProps {
  profile: PlayerProfile;
  theme: 'olympus' | 'atlantis';
  onToggleTheme: () => void;
  onPlay: () => void;
  onOpenMap: () => void;
  onOpenCharacters: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  profile,
  theme,
  onToggleTheme,
  onPlay,
  onOpenMap,
  onOpenCharacters,
  onOpenSettings,
}) => {
  const rank = getPlayerRank(profile.totalXp);
  const activeGuardian = CHARACTERS.find((c) => c.id === profile.selectedCharacterId) || CHARACTERS[0];
  const completedCount = Object.keys(profile.completedLevels).length;

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center px-4 py-6 overflow-hidden">
      {/* Background Landscape */}
      <GreekLandscape intensity="full" theme={theme} />

      {/* Top Bar / Profile Info */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
        {/* Guardian Avatar & Quote */}
        <div
          onClick={() => {
            soundManager.playClick();
            onOpenCharacters();
          }}
          className="cursor-pointer group flex items-center gap-3 px-3 py-1.5 bg-gradient-to-r from-black/60 to-amber-950/60 border border-amber-500/40 rounded-full hover:border-amber-400 transition-all shadow-lg backdrop-blur-md"
        >
          <div className="relative">
            <CharacterArt id={activeGuardian.id} size={42} />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border border-black" />
          </div>
          <div className="pr-2">
            <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              Active Guardian
            </p>
            <p className="text-xs font-serif font-bold text-amber-100 group-hover:text-yellow-300 transition-colors">
              {activeGuardian.name}
            </p>
          </div>
        </div>

        {/* Right side controls: Theme Switcher & Settings */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (theme === 'olympus') soundManager.playBubble();
              else soundManager.playClick();
              onToggleTheme();
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-serif font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              theme === 'atlantis'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_15px_#00CED1]'
                : 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_15px_#F59E0B]'
            }`}
            title="Switch between Olympus and Atlantis themes"
          >
            {theme === 'atlantis' ? (
              <>
                <span className="text-sm">🔱</span>
                <span>ATLANTIS</span>
              </>
            ) : (
              <>
                <span className="text-sm">⚡</span>
                <span>OLYMPUS</span>
              </>
            )}
          </button>

          {/* Quick Settings Icon */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="p-2.5 rounded-full bg-black/60 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-300 transition-all shadow-lg backdrop-blur-md active:scale-95"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Logo & Centerpiece */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto py-6">
        {/* Divine Pediment & Laurel Wreath */}
        <div className="flex items-center gap-3 mb-2 animate-pulse">
          <div className={`h-[2px] w-12 sm:w-20 bg-gradient-to-r from-transparent ${theme === 'atlantis' ? 'to-cyan-400' : 'to-amber-400'}`} />
          <span className={`text-xs sm:text-sm font-serif font-bold tracking-[0.3em] uppercase ${theme === 'atlantis' ? 'text-cyan-300' : 'text-amber-400'}`}>
            {theme === 'atlantis' ? 'Sunken Kingdom of Atlantis' : 'Olympian Mythic Adventure'}
          </span>
          <div className={`h-[2px] w-12 sm:w-20 bg-gradient-to-l from-transparent ${theme === 'atlantis' ? 'to-cyan-400' : 'to-amber-400'}`} />
        </div>

        {/* Title */}
        <div className="relative">
          <h1
            className={`font-serif text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text tracking-wider ${
              theme === 'atlantis'
                ? 'bg-gradient-to-b from-[#FFFFFF] via-[#67E8F9] to-[#0284C7] drop-shadow-[0_5px_20px_rgba(6,182,212,0.6)]'
                : 'bg-gradient-to-b from-[#FFFBEB] via-[#FBBF24] to-[#B45309] drop-shadow-[0_5px_15px_rgba(251,191,36,0.4)]'
            }`}
          >
            {theme === 'atlantis' ? 'ATLANTIS' : 'GREEK LEGENDS'}
          </h1>
          <div
            className={`absolute -inset-1 blur-2xl rounded-full -z-10 ${
              theme === 'atlantis' ? 'bg-cyan-500/25' : 'bg-amber-500/20'
            }`}
          />
        </div>

        {/* Subtitle Banner */}
        <div
          className={`relative mt-2 px-6 py-1.5 border-y shadow-lg ${
            theme === 'atlantis'
              ? 'bg-gradient-to-r from-cyan-950/80 via-blue-950/90 to-cyan-950/80 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              : 'bg-gradient-to-r from-amber-950/80 via-red-950/90 to-amber-950/80 border-amber-500/60 shadow-[0_0_20px_rgba(180,83,9,0.5)]'
          }`}
        >
          <p
            className={`font-serif text-sm sm:text-lg font-bold tracking-[0.35em] text-transparent bg-clip-text uppercase ${
              theme === 'atlantis'
                ? 'bg-gradient-to-r from-cyan-100 via-sky-200 to-teal-300'
                : 'bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100'
            }`}
          >
            {theme === 'atlantis' ? 'Rise of the Sunken Gods' : 'Rise of the Gods'}
          </p>
        </div>

        {/* Current Level Quest Badge */}
        <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-[#0D182E]/80 border border-amber-400/40 rounded-full backdrop-blur-sm shadow-md">
          <Award size={16} className="text-amber-400" />
          <span className="text-xs sm:text-sm font-semibold text-amber-200">
            Quest Progress: Level {profile.currentLevel} / 1000
          </span>
          <span className="text-xs text-amber-400/80">
            ({completedCount} Conquered)
          </span>
        </div>

        {/* Menu Buttons Group */}
        <div className="mt-8 flex flex-col gap-3 w-full max-w-xs sm:max-w-sm">
          {/* Main Play / Continue Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPlay();
            }}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:via-yellow-400 hover:to-amber-500 text-slate-950 font-serif font-black text-lg tracking-wider rounded-xl border-2 border-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:shadow-[0_0_35px_rgba(251,191,36,0.9)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Play size={22} className="fill-slate-950" />
            <span>PLAY LEVEL {profile.currentLevel}</span>
          </button>

          {/* Adventure Map (Levels 1 to 1000) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenMap();
            }}
            className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 hover:from-amber-900/90 hover:to-slate-800/90 text-amber-100 font-serif font-bold text-base tracking-wide rounded-xl border border-amber-500/50 shadow-lg hover:border-amber-400 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <MapIcon size={20} className="text-amber-400" />
              <span>Adventure Map</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <span>1000 Realms</span>
              <ChevronRight size={16} />
            </div>
          </button>

          {/* Character Collection (Pantheon) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCharacters();
            }}
            className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 hover:from-amber-900/90 hover:to-slate-800/90 text-amber-100 font-serif font-bold text-base tracking-wide rounded-xl border border-amber-500/50 shadow-lg hover:border-amber-400 transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <Users size={20} className="text-cyan-400" />
              <span>Pantheon Gallery</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <span>{profile.unlockedCharacterIds.length} / {CHARACTERS.length} Gods</span>
              <ChevronRight size={16} />
            </div>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black/40 hover:bg-black/60 text-amber-300/80 hover:text-amber-200 font-serif text-sm tracking-wider rounded-lg border border-amber-900/40 hover:border-amber-700/60 transition-all"
          >
            <Settings size={16} />
            <span>Options & Sound</span>
          </button>
        </div>
      </div>

      {/* Footer Disclaimer & Ranks */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-amber-500/20 text-[11px] text-amber-300/60 font-serif">
        <div className="flex items-center gap-2">
          <span>{rank.badge}</span>
          <span className="text-amber-200 font-bold">{rank.title}</span>
          <span>•</span>
          <span>{profile.totalXp.toLocaleString()} Experience Points</span>
        </div>
        <div>
          <span>Entertainment-Only Mythology Adventure</span>
        </div>
      </div>
    </div>
  );
};
