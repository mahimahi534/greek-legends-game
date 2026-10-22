import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, Map as MapIcon, Award, Sparkles, ChevronRight } from 'lucide-react';
import { Character } from '../../types/game';
import { CharacterArt } from '../art/CharacterArt';
import { soundManager } from '../../services/audioService';

interface LevelCompleteModalProps {
  levelNumber: number;
  score: number;
  highScore: number;
  stars: number;
  xpEarned: number;
  newCharacterUnlocked?: Character | null;
  onNextLevel: () => void;
  onReplay: () => void;
  onGoToMap: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  score,
  highScore,
  stars,
  xpEarned,
  newCharacterUnlocked,
  onNextLevel,
  onReplay,
  onGoToMap,
}) => {
  useEffect(() => {
    soundManager.playVictory();

    // Trigger golden celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#F59E0B', '#00CED1', '#FFFFFF', '#CD7F32'],
      });
    } catch {
      // safe fallback if canvas not available
    }
  }, []);

  const isNewHighScore = score >= highScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#101D38] via-[#091224] to-black border-2 border-yellow-400/80 p-6 shadow-[0_0_50px_rgba(251,191,36,0.4)] text-amber-50 text-center overflow-hidden">
        {/* Ancient Greek Pediment Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 shadow-[0_0_10px_#F59E0B]" />

        {/* Victory Header */}
        <div className="my-2">
          <p className="font-serif text-xs font-bold text-amber-300/80 uppercase tracking-[0.3em]">
            Olympian Triumph
          </p>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]">
            LEVEL {levelNumber} CONQUERED!
          </h2>
        </div>

        {/* 3 Animated Stars */}
        <div className="my-5 flex items-center justify-center gap-3">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transform transition-all duration-500 ${
                starIdx <= stars ? 'scale-110 animate-bounce' : 'scale-90 opacity-40'
              }`}
              style={{ animationDelay: `${starIdx * 0.2}s` }}
            >
              <Star
                size={starIdx === 2 ? 46 : 38}
                className={
                  starIdx <= stars
                    ? 'fill-amber-400 text-yellow-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]'
                    : 'fill-slate-800 text-slate-700'
                }
              />
            </div>
          ))}
        </div>

        {/* Score & Rewards Box */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-[#091329] to-[#040814] border border-amber-500/40 space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <span className="font-serif text-xs text-amber-300">Final Score</span>
            <div className="flex items-center gap-2">
              {isNewHighScore && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-yellow-400 text-slate-950">
                  NEW BEST
                </span>
              )}
              <span className="font-mono text-lg font-bold text-yellow-300">
                {score.toLocaleString()} pts
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-serif text-xs text-amber-300">Experience Gained</span>
            <span className="font-mono text-base font-bold text-cyan-300 flex items-center gap-1">
              <Sparkles size={14} /> +{xpEarned.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* New Guardian Character Unlocked Alert */}
        {newCharacterUnlocked && (
          <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-amber-950/80 border-2 border-yellow-400 animate-pulse flex items-center gap-3 text-left">
            <CharacterArt id={newCharacterUnlocked.id} size={50} />
            <div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-yellow-300">
                <Award size={12} /> New Guardian Unlocked!
              </div>
              <p className="font-serif font-black text-sm text-amber-100">
                {newCharacterUnlocked.name} — {newCharacterUnlocked.title}
              </p>
              <p className="text-[10px] text-amber-300/80">
                Blessing: {newCharacterUnlocked.divineBlessing.name}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="mt-6 space-y-2.5">
          {levelNumber < 1000 ? (
            <button
              onClick={() => {
                soundManager.playClick();
                onNextLevel();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-slate-950 font-serif font-black text-base tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.6)] border border-amber-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>ADVANCE TO LEVEL {levelNumber + 1}</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <div className="py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-400 font-serif font-black text-amber-300 text-sm">
              👑 YOU HAVE REACHED THE SUPREME CELESTIAL ZENITH!
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onReplay();
              }}
              className="flex-1 py-2.5 rounded-lg bg-[#0C152B] hover:bg-[#122042] border border-amber-500/30 text-amber-200 font-serif text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} /> Replay
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onGoToMap();
              }}
              className="flex-1 py-2.5 rounded-lg bg-[#0C152B] hover:bg-[#122042] border border-amber-500/30 text-amber-200 font-serif text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MapIcon size={14} /> Realm Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
