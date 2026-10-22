import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, Eye, RotateCcw, AlertTriangle } from 'lucide-react';
import { GameSettings } from '../../types/game';
import { soundManager } from '../../services/audioService';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#0F1A33] via-[#091122] to-black border-2 border-amber-500/60 p-6 shadow-2xl text-amber-50">
        {/* Ancient Greek Pediment Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="font-serif font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-400">
              GAME SETTINGS
            </h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-amber-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Settings Options */}
        <div className="space-y-4">
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#060D1E] border border-amber-500/30">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <Volume2 size={20} className="text-amber-400" /> : <VolumeX size={20} className="text-slate-500" />}
              <div>
                <p className="font-serif font-bold text-sm text-amber-100">Sound Effects</p>
                <p className="text-[11px] text-amber-300/70">Matches, thunder & chimes</p>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                soundManager.setSoundEnabled(next);
                if (next) soundManager.playClick();
                onUpdateSettings({ soundEnabled: next });
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Background Lyre Music Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#060D1E] border border-amber-500/30">
            <div className="flex items-center gap-3">
              <Music size={20} className={settings.musicEnabled ? 'text-cyan-400' : 'text-slate-500'} />
              <div>
                <p className="font-serif font-bold text-sm text-amber-100">Mythological Lyre Music</p>
                <p className="text-[11px] text-amber-300/70">Ancient Dorian harp & ambient drone</p>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !settings.musicEnabled;
                soundManager.setMusicEnabled(next);
                if (settings.soundEnabled) soundManager.playClick();
                onUpdateSettings({ musicEnabled: next });
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
                settings.musicEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="p-3 rounded-xl bg-[#060D1E] border border-amber-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-serif font-bold text-xs text-amber-200">Master Volume</span>
              <span className="font-mono text-xs text-amber-400">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                soundManager.setVolume(val);
                onUpdateSettings({ volume: val });
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#060D1E] border border-amber-500/30">
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-amber-400" />
              <div>
                <p className="font-serif font-bold text-sm text-amber-100">Reduced Motion</p>
                <p className="text-[11px] text-amber-300/70">Minimize background waves and float</p>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onUpdateSettings({ reducedMotion: !settings.reducedMotion });
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
                settings.reducedMotion ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Visual Atmosphere Theme (Olympus vs Atlantis) */}
          <div className="p-3 rounded-xl bg-[#060D1E] border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-xs text-amber-200">
                Visual Atmosphere Theme
              </span>
              <span className="text-[10px] font-mono text-cyan-300 uppercase">
                {settings.themeMode || 'auto'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onUpdateSettings({ themeMode: 'olympus' });
                }}
                className={`py-1.5 px-2 rounded-lg font-serif text-[11px] font-bold border transition-all ${
                  settings.themeMode === 'olympus'
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_10px_#F59E0B]'
                    : 'bg-black/50 text-amber-200/80 border-amber-900/40 hover:bg-amber-950/40'
                }`}
              >
                ⚡ Olympus
              </button>
              <button
                onClick={() => {
                  soundManager.playBubble();
                  onUpdateSettings({ themeMode: 'atlantis' });
                }}
                className={`py-1.5 px-2 rounded-lg font-serif text-[11px] font-bold border transition-all ${
                  settings.themeMode === 'atlantis'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_#06B6D4]'
                    : 'bg-black/50 text-cyan-200/80 border-cyan-900/40 hover:bg-cyan-950/40'
                }`}
              >
                🔱 Atlantis
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  onUpdateSettings({ themeMode: 'auto' });
                }}
                className={`py-1.5 px-2 rounded-lg font-serif text-[11px] font-bold border transition-all ${
                  settings.themeMode === 'auto' || !settings.themeMode
                    ? 'bg-gradient-to-r from-amber-600 to-cyan-600 text-white border-white/50 shadow-md'
                    : 'bg-black/50 text-slate-300 border-slate-800 hover:bg-slate-900'
                }`}
              >
                🌐 Auto
              </button>
            </div>
          </div>

          {/* Reset Progress Confirmation Area */}
          <div className="pt-2">
            {!confirmReset ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setConfirmReset(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/40 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 font-serif text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw size={14} /> Reset Adventure Progress
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-rose-300 text-xs font-bold">
                  <AlertTriangle size={16} /> Confirm Complete Reset?
                </div>
                <p className="text-[11px] text-rose-200">
                  All level stars, unlocked guardians, and scores will be restored to Level 1.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onResetProgress();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setConfirmReset(false);
                    }}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-3 border-t border-amber-500/20 text-center text-[10px] text-amber-400/60 font-serif">
          Greek Legends: Rise of the Gods • Entertainment Only (No Wagering)
        </div>
      </div>
    </div>
  );
};
