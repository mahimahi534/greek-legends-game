import React, { useEffect } from 'react';
import { RotateCcw, Map as MapIcon } from 'lucide-react';
import { LevelObjective } from '../../types/game';
import { SymbolArt } from '../art/SymbolArt';
import { soundManager } from '../../services/audioService';

interface LevelFailedModalProps {
  levelNumber: number;
  objectives: LevelObjective[];
  onRetry: () => void;
  onGoToMap: () => void;
}

export const LevelFailedModal: React.FC<LevelFailedModalProps> = ({
  levelNumber,
  objectives,
  onRetry,
  onGoToMap,
}) => {
  useEffect(() => {
    soundManager.playDefeat();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#180808] via-[#0E0505] to-black border-2 border-rose-500/70 p-6 shadow-[0_0_50px_rgba(244,63,94,0.3)] text-amber-50 text-center overflow-hidden">
        {/* Ancient Greek Pediment Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-800 via-rose-500 to-red-800" />

        {/* Failed Header */}
        <div className="my-2">
          <p className="font-serif text-xs font-bold text-rose-400 uppercase tracking-[0.25em]">
            The Fates Intervene
          </p>
          <h2 className="font-serif font-black text-3xl text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-200 to-rose-400 mt-1">
            OUT OF MOVES!
          </h2>
          <p className="text-xs text-slate-300 font-serif mt-1">
            The gods demand greater strategy to conquer Level {levelNumber}.
          </p>
        </div>

        {/* Unfinished Objectives Summary */}
        <div className="my-5 p-4 rounded-xl bg-black/60 border border-rose-500/30 text-left space-y-2">
          <p className="font-serif text-[11px] font-bold text-rose-300 uppercase tracking-wider mb-2">
            Remaining Objectives:
          </p>

          {objectives.map((obj, i) => {
            const isMet = obj.current >= obj.target;

            return (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-rose-500/10 last:border-0">
                <div className="flex items-center gap-2">
                  {obj.type === 'collect_symbol' && obj.symbol && (
                    <SymbolArt symbol={obj.symbol} size={22} />
                  )}
                  {obj.type === 'clear_marble' && (
                    <span className="text-sm">🏛️</span>
                  )}
                  {obj.type === 'score' && (
                    <span className="text-sm">⭐</span>
                  )}
                  <span className={isMet ? 'text-emerald-400 line-through' : 'text-slate-300'}>
                    {obj.type === 'score'
                      ? `Score Target`
                      : obj.type === 'clear_marble'
                      ? `Break Marble Blocks`
                      : `Collect Symbols`}
                  </span>
                </div>

                <div className="font-mono font-bold">
                  <span className={isMet ? 'text-emerald-400' : 'text-rose-300'}>
                    {obj.current}
                  </span>
                  <span className="text-slate-500"> / {obj.target}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onRetry();
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-slate-950 font-serif font-black text-base tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.5)] border border-amber-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw size={18} />
            <span>TRY LEVEL {levelNumber} AGAIN</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onGoToMap();
            }}
            className="w-full py-2.5 rounded-lg bg-black/60 hover:bg-slate-900 border border-slate-700 text-slate-300 font-serif text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <MapIcon size={14} /> Return to Adventure Map
          </button>
        </div>
      </div>
    </div>
  );
};
