import React from 'react';
import { Volume2, VolumeX, Music, Settings as SettingsIcon, ChevronLeft } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { getPlayerRank } from '../../services/storageService';
import { soundManager } from '../../services/audioService';

interface GreekHeaderProps {
  title?: string;
  subtitle?: string;
  profile: PlayerProfile;
  showBack?: boolean;
  onBack?: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const GreekHeader: React.FC<GreekHeaderProps> = ({
  title,
  subtitle,
  profile,
  showBack = false,
  onBack,
  onOpenSettings,
  onToggleSound,
  onToggleMusic,
}) => {
  const rank = getPlayerRank(profile.totalXp);

  return (
    <header className="relative z-20 w-full px-4 py-3 bg-[#0B142B]/85 backdrop-blur-md border-b border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Ancient Greek Meander Ornamental Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 shadow-[0_0_8px_#F59E0B]" />

      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left Side: Back button or Logo */}
        <div className="flex items-center gap-3">
          {showBack && onBack ? (
            <button
              onClick={() => {
                soundManager.playClick();
                onBack();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-amber-800/80 to-amber-950/90 hover:from-amber-700 hover:to-amber-900 text-amber-200 border border-amber-500/50 rounded-lg text-sm font-semibold tracking-wide transition-all shadow-md active:scale-95"
            >
              <ChevronLeft size={18} />
              <span className="hidden sm:inline">RETURN</span>
            </button>
          ) : null}

          {title ? (
            <div>
              <h1 className="font-serif font-bold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 tracking-wider">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-amber-300/80 tracking-widest uppercase font-serif">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <span className="font-serif font-black text-amber-300 text-lg tracking-wider hidden sm:inline">
                GREEK LEGENDS
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Player Rank, Level, Sound Toggles & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Player Rank & XP Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-gradient-to-r from-amber-950/60 to-amber-900/40 border border-amber-500/40 rounded-full shadow-inner">
            <span className="text-base sm:text-lg">{rank.badge}</span>
            <div className="text-left hidden md:block">
              <p className="text-[11px] font-bold text-amber-200 leading-none">{rank.title}</p>
              <p className="text-[10px] text-amber-400/80 leading-none mt-0.5">{profile.totalXp.toLocaleString()} XP</p>
            </div>
            <div className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/40 rounded-full text-[10px] font-black text-amber-300">
              LVL {profile.currentLevel}
            </div>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            title={profile.settings.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className={`p-2 rounded-lg border transition-all active:scale-90 ${
              profile.settings.soundEnabled
                ? 'bg-amber-900/40 border-amber-500/50 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : 'bg-slate-900/60 border-slate-700 text-slate-500'
            }`}
          >
            {profile.settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Music Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMusic();
            }}
            title={profile.settings.musicEnabled ? 'Stop Lyre Melody' : 'Play Lyre Melody'}
            className={`p-2 rounded-lg border transition-all active:scale-90 ${
              profile.settings.musicEnabled
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 border-slate-700 text-slate-500'
            }`}
          >
            <Music size={18} />
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            title="Game Settings"
            className="p-2 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-200 hover:bg-amber-900/60 transition-all active:scale-90 shadow-md"
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
