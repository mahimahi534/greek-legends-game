import React, { useState } from 'react';
import { Sparkles, Check, Lock, BookOpen, Quote } from 'lucide-react';
import { PlayerProfile, Character } from '../../types/game';
import { CHARACTERS } from '../../data/characters';
import { CharacterArt } from '../art/CharacterArt';
import { GreekLandscape } from '../common/GreekLandscape';
import { GreekHeader } from '../common/GreekHeader';
import { soundManager } from '../../services/audioService';

interface CharacterCollectionProps {
  profile: PlayerProfile;
  onSelectGuardian: (characterId: string) => void;
  onBack: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const CharacterCollection: React.FC<CharacterCollectionProps> = ({
  profile,
  onSelectGuardian,
  onBack,
  onOpenSettings,
  onToggleSound,
  onToggleMusic,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(() => {
    return CHARACTERS.find((c) => c.id === profile.selectedCharacterId) || CHARACTERS[0];
  });

  const isCurrentGuardian = selectedCharacter.id === profile.selectedCharacterId;
  const isSelectedUnlocked = profile.unlockedCharacterIds.includes(selectedCharacter.id);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#070D1E] text-amber-50">
      <GreekLandscape intensity="subtle" />

      {/* Header */}
      <GreekHeader
        title="PANTHEON GALLERY"
        subtitle="Mythological Guardians & Divine Blessings"
        profile={profile}
        showBack={true}
        onBack={onBack}
        onOpenSettings={onOpenSettings}
        onToggleSound={onToggleSound}
        onToggleMusic={onToggleMusic}
      />

      {/* Main Pantheon Content */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-4 flex flex-col lg:flex-row gap-6">
        {/* Left: Character List Grid */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-base text-amber-200 uppercase tracking-widest">
              Olympian Guardians ({profile.unlockedCharacterIds.length}/{CHARACTERS.length} Unlocked)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHARACTERS.map((char) => {
              const isUnlocked = profile.unlockedCharacterIds.includes(char.id);
              const isSelected = selectedCharacter.id === char.id;
              const isEquipped = profile.selectedCharacterId === char.id;

              return (
                <div
                  key={char.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedCharacter(char);
                  }}
                  className={`relative p-3 rounded-xl border flex flex-col items-center text-center cursor-pointer transition-all select-none ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-600/30 to-amber-950/60 border-2 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-102'
                      : isUnlocked
                      ? 'bg-[#0B1528]/80 border-amber-500/30 hover:border-amber-400/60 hover:bg-[#12203D]'
                      : 'bg-[#070B14]/80 border-slate-800 opacity-60'
                  }`}
                >
                  {/* Equipped Guardian Badge */}
                  {isEquipped && (
                    <div className="absolute top-2 right-2 p-1 bg-yellow-400 text-slate-950 rounded-full shadow-md" title="Equipped Guardian">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  {/* Character Artwork */}
                  <CharacterArt id={char.id} size={70} isUnlocked={isUnlocked} />

                  <h3 className="font-serif font-black text-sm text-amber-100 mt-2">
                    {char.name}
                  </h3>
                  <p className="text-[10px] text-amber-300/80 font-serif line-clamp-1">
                    {char.title}
                  </p>

                  <div className="mt-2 w-full pt-1.5 border-t border-amber-500/20 text-[10px] font-semibold">
                    {isUnlocked ? (
                      <span className="text-emerald-400 flex items-center justify-center gap-1">
                        <Sparkles size={10} /> Ready
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center justify-center gap-1">
                        <Lock size={10} /> Unlocks Lvl {char.unlockLevel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Character Detailed Information Panel */}
        <div className="w-full lg:w-[420px] rounded-2xl bg-gradient-to-b from-[#0F1C38]/90 via-[#0A1326]/95 to-black/90 border border-amber-500/50 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          <div>
            {/* Header / Portrait */}
            <div className="flex items-center gap-4 border-b border-amber-500/30 pb-4">
              <CharacterArt id={selectedCharacter.id} size={90} isUnlocked={isSelectedUnlocked} />
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-amber-500/20 border border-amber-400/40 text-amber-300">
                  {selectedCharacter.domain}
                </span>
                <h2 className="font-serif font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 mt-1">
                  {selectedCharacter.name}
                </h2>
                <p className="text-xs text-amber-200/80 font-serif">
                  {selectedCharacter.title}
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="my-4 p-3 bg-amber-950/30 border-l-2 border-amber-400 rounded-r-lg italic text-xs text-amber-200/90 font-serif flex items-start gap-2">
              <Quote size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span>"{selectedCharacter.quote}"</span>
            </div>

            {/* Mythology Lore */}
            <div className="space-y-3 text-xs leading-relaxed text-amber-100/90 font-sans">
              <div>
                <p className="font-serif font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <BookOpen size={13} /> Mythology
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedCharacter.mythDescription}
                </p>
              </div>

              <div>
                <p className="font-serif font-bold text-amber-300 mb-1">
                  Legendary Lore
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedCharacter.lore}
                </p>
              </div>
            </div>

            {/* Divine Blessing Box */}
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-950/60 to-purple-950/40 border border-amber-400/50 shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-300 font-serif font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles size={14} className="text-yellow-400" />
                <span>Divine Blessing: {selectedCharacter.divineBlessing.name}</span>
              </div>
              <p className="text-xs text-amber-100 font-medium">
                {selectedCharacter.divineBlessing.description}
              </p>
            </div>
          </div>

          {/* Action: Equip Button */}
          <div className="mt-6 pt-4 border-t border-amber-500/20">
            {isSelectedUnlocked ? (
              <button
                disabled={isCurrentGuardian}
                onClick={() => {
                  soundManager.playClick();
                  onSelectGuardian(selectedCharacter.id);
                }}
                className={`w-full py-3 rounded-xl font-serif font-bold text-sm tracking-wider uppercase transition-all shadow-lg active:scale-95 ${
                  isCurrentGuardian
                    ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 cursor-default flex items-center justify-center gap-2'
                    : 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-slate-950 border border-amber-200'
                }`}
              >
                {isCurrentGuardian ? (
                  <>
                    <Check size={16} /> Active Guardian Equipped
                  </>
                ) : (
                  'Equip as Guardian'
                )}
              </button>
            ) : (
              <div className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 font-serif text-xs text-center flex items-center justify-center gap-2">
                <Lock size={14} /> Unlocks at Adventure Level {selectedCharacter.unlockLevel}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
