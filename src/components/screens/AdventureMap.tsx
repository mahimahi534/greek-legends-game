import React, { useState } from 'react';
import { Star, Lock, Play, ChevronRight, ChevronLeft, Search, Compass } from 'lucide-react';
import { PlayerProfile } from '../../types/game';
import { GreekLandscape } from '../common/GreekLandscape';
import { GreekHeader } from '../common/GreekHeader';
import { REALMS } from '../../data/levelGenerator';
import { soundManager } from '../../services/audioService';

interface AdventureMapProps {
  profile: PlayerProfile;
  onSelectLevel: (levelNumber: number) => void;
  onBack: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  profile,
  onSelectLevel,
  onBack,
  onOpenSettings,
  onToggleSound,
  onToggleMusic,
}) => {
  // Determine current realm index from profile.currentLevel
  const initialRealmIndex = Math.min(REALMS.length - 1, Math.floor((profile.currentLevel - 1) / 100));
  const [activeRealmIndex, setActiveRealmIndex] = useState<number>(initialRealmIndex);

  // Pagination within active realm (each realm has 100 levels, 20 levels per sub-page)
  const [subPageIndex, setSubPageIndex] = useState<number>(
    Math.floor(((profile.currentLevel - 1) % 100) / 20)
  );

  const [jumpInput, setJumpInput] = useState<string>('');
  const [jumpError, setJumpError] = useState<string>('');

  const currentRealm = REALMS[activeRealmIndex];
  const realmStartLevel = activeRealmIndex * 100 + 1;
  const pageStartLevel = realmStartLevel + subPageIndex * 20;
  const pageEndLevel = Math.min(realmStartLevel + 99, pageStartLevel + 19);

  // Generate 20 levels for current view
  const levelsInPage: number[] = [];
  for (let lvl = pageStartLevel; lvl <= pageEndLevel; lvl++) {
    levelsInPage.push(lvl);
  }

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLvl = parseInt(jumpInput.trim(), 10);
    if (isNaN(targetLvl) || targetLvl < 1 || targetLvl > 1000) {
      setJumpError('Enter a valid level between 1 and 1000');
      return;
    }
    setJumpError('');
    const realmIdx = Math.floor((targetLvl - 1) / 100);
    setActiveRealmIndex(realmIdx);
    setSubPageIndex(Math.floor(((targetLvl - 1) % 100) / 20));
    setJumpInput('');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#070D1E] text-amber-50">
      <GreekLandscape intensity="subtle" themeGradient={currentRealm.bgGradient} />

      {/* Header */}
      <GreekHeader
        title="ADVENTURE MAP"
        subtitle="The 10 Legendary Realms of Hellas"
        profile={profile}
        showBack={true}
        onBack={onBack}
        onOpenSettings={onOpenSettings}
        onToggleSound={onToggleSound}
        onToggleMusic={onToggleMusic}
      />

      {/* Main Map Content */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Realm Navigation Carousel / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-600/40">
          {REALMS.map((realm, idx) => {
            const isUnlockedRealm = (idx * 100 + 1) <= profile.maxUnlockedLevel || idx === 0;
            const isSelected = idx === activeRealmIndex;

            return (
              <button
                key={realm.name}
                onClick={() => {
                  soundManager.playClick();
                  setActiveRealmIndex(idx);
                  setSubPageIndex(0);
                }}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border font-serif text-xs font-bold tracking-wide transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-950 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105'
                    : isUnlockedRealm
                    ? 'bg-[#0B1528]/80 text-amber-200/90 border-amber-500/30 hover:border-amber-400/60 hover:bg-[#12203D]'
                    : 'bg-black/50 text-slate-500 border-slate-800'
                }`}
              >
                {!isUnlockedRealm ? <Lock size={12} /> : <span>🏛️</span>}
                <span>{realm.name}</span>
                <span className="text-[10px] opacity-75">
                  ({idx * 100 + 1}-{idx * 100 + 100})
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Realm Card Banner */}
        <div className="relative rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-black/80 via-[#0E1A33]/90 to-black/80 border border-amber-500/40 shadow-xl backdrop-blur-md overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass size={18} className="text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-amber-400 font-bold">
                Realm {activeRealmIndex + 1} of 10
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500">
              {currentRealm.name}
            </h2>
            <p className="text-sm text-amber-200/80 font-serif italic mt-0.5">
              {currentRealm.sub}
            </p>
          </div>

          {/* Quick Level Jump Form */}
          <form onSubmit={handleJump} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-44">
              <input
                type="number"
                min="1"
                max="1000"
                placeholder="Jump to lvl (1-1000)"
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                className="w-full px-3 py-1.5 pl-8 text-xs bg-slate-900/90 border border-amber-500/40 rounded-lg text-amber-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-amber-400/60" />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-serif text-xs font-black rounded-lg border border-amber-400 transition-all shadow-md active:scale-95"
            >
              GO
            </button>
          </form>
        </div>
        {jumpError && (
          <p className="text-xs text-rose-400 text-center font-serif">{jumpError}</p>
        )}

        {/* Sub-page selector (Levels within current Realm) */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-serif font-bold text-amber-300">
              Levels {pageStartLevel} - {pageEndLevel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={subPageIndex <= 0}
              onClick={() => {
                soundManager.playClick();
                setSubPageIndex((prev) => Math.max(0, prev - 1));
              }}
              className="p-1.5 rounded-lg bg-[#0B1528] border border-amber-500/30 text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-950/60"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-mono text-amber-200">
              Page {subPageIndex + 1} / 5
            </span>
            <button
              disabled={subPageIndex >= 4}
              onClick={() => {
                soundManager.playClick();
                setSubPageIndex((prev) => Math.min(4, prev + 1));
              }}
              className="p-1.5 rounded-lg bg-[#0B1528] border border-amber-500/30 text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-950/60"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Level Grid (20 levels in current page) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 my-2">
          {levelsInPage.map((lvl) => {
            const isCompleted = Boolean(profile.completedLevels[lvl]);
            const levelInfo = profile.completedLevels[lvl];
            const stars = levelInfo ? levelInfo.stars : 0;
            const isCurrent = lvl === profile.currentLevel;
            const isUnlocked = lvl <= profile.maxUnlockedLevel;

            return (
              <div
                key={lvl}
                onClick={() => {
                  if (isUnlocked) {
                    soundManager.playClick();
                    onSelectLevel(lvl);
                  } else {
                    soundManager.playInvalid();
                  }
                }}
                className={`relative group rounded-xl p-3 flex flex-col justify-between items-center transition-all select-none ${
                  isUnlocked
                    ? 'cursor-pointer transform hover:-translate-y-1 active:scale-95'
                    : 'cursor-not-allowed opacity-60'
                } ${
                  isCurrent
                    ? 'bg-gradient-to-b from-amber-500/30 via-[#1C2640] to-amber-950/40 border-2 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] ring-2 ring-yellow-400/50'
                    : isCompleted
                    ? 'bg-gradient-to-b from-[#132247] to-[#0A1224] border border-amber-500/40 hover:border-amber-400 shadow-md'
                    : 'bg-[#080E1C] border border-slate-800'
                }`}
              >
                {/* Current level indicator ribbon */}
                {isCurrent && (
                  <div className="absolute -top-2.5 px-2 py-0.5 bg-yellow-400 text-slate-950 text-[9px] font-black tracking-widest rounded-full uppercase shadow-md animate-pulse">
                    CURRENT
                  </div>
                )}

                {/* Level Number */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-amber-400/80 tracking-wider">
                    LVL
                  </span>
                  {isUnlocked && (
                    <Play size={10} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>

                <div className="my-1.5 flex items-center justify-center">
                  {!isUnlocked ? (
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
                      <Lock size={18} />
                    </div>
                  ) : (
                    <span className="font-serif font-black text-2xl text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-yellow-500">
                      {lvl}
                    </span>
                  )}
                </div>

                {/* Star Rating Display */}
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      size={13}
                      className={
                        starIdx <= stars
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]'
                          : 'fill-slate-800 text-slate-700'
                      }
                    />
                  ))}
                </div>

                {/* High Score if completed */}
                {levelInfo && (
                  <div className="mt-1 text-[10px] font-mono text-amber-300/80">
                    {levelInfo.highScore.toLocaleString()} pts
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
