import React from 'react';
import { AtlantisLandscape } from './AtlantisLandscape';

interface GreekLandscapeProps {
  intensity?: 'full' | 'subtle';
  themeGradient?: string;
  theme?: 'olympus' | 'atlantis';
}

export const GreekLandscape: React.FC<GreekLandscapeProps> = ({
  intensity = 'full',
  themeGradient = 'from-[#070D1E] via-[#0D1B2A] to-[#1B263B]',
  theme = 'olympus',
}) => {
  if (theme === 'atlantis') {
    return <AtlantisLandscape intensity={intensity} />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Sky Base Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${themeGradient}`} />

      {/* Celestial Stars */}
      <div className="absolute inset-0 opacity-60">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-100 animate-sparkle"
            style={{
              top: `${(i * 17) % 75}%`,
              left: `${(i * 29) % 98}%`,
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              animationDelay: `${(i * 0.4) % 3}s`,
              animationDuration: `${2 + (i % 3)}s`,
              boxShadow: '0 0 6px #FFF9C4',
            }}
          />
        ))}
      </div>

      {/* Distant Mountain Silhouettes (Mount Olympus) */}
      <svg
        viewBox="0 0 1440 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-16 w-full h-72 opacity-35 preserve-3d"
        preserveAspectRatio="none"
      >
        {/* Far peak */}
        <polygon points="0,400 240,140 480,400" fill="#141E33" />
        <polygon points="180,180 240,140 300,180" fill="#F8FAFC" opacity="0.75" />
        {/* Central Olympus Peak */}
        <polygon points="360,400 720,80 1080,400" fill="#1E293B" />
        <polygon points="660,140 720,80 780,140" fill="#FFFFFF" opacity="0.85" />
        {/* Right Peak */}
        <polygon points="920,400 1200,130 1440,400" fill="#141E33" />
        <polygon points="1140,175 1200,130 1260,175" fill="#F8FAFC" opacity="0.75" />
      </svg>

      {/* Floating Ethereal Clouds */}
      <div className="absolute top-12 left-0 right-0 h-48 opacity-25">
        <div className="absolute w-[600px] h-24 bg-gradient-to-r from-transparent via-amber-100 to-transparent blur-3xl animate-wave" style={{ top: '20px', left: '-100px' }} />
        <div className="absolute w-[700px] h-32 bg-gradient-to-r from-transparent via-sky-200 to-transparent blur-3xl animate-wave" style={{ top: '60px', right: '-150px', animationDelay: '-3s' }} />
      </div>

      {/* Turquoise Sea at the Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0284C7]/40 via-[#0369A1]/20 to-transparent border-t border-cyan-500/20">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent animate-pulse" />
      </div>

      {/* Foreground Classical Greek Pillars on sides (if full intensity) */}
      {intensity === 'full' && (
        <>
          {/* Left Pillar */}
          <div className="hidden lg:block absolute left-4 top-0 bottom-0 w-20 pointer-events-none opacity-40">
            <div className="h-full w-full border-r-2 border-l-2 border-amber-600/30 bg-gradient-to-r from-amber-950/40 via-amber-900/10 to-amber-950/40 shadow-2xl relative">
              <div className="absolute top-8 left-0 right-0 h-10 border-b-2 border-amber-500/40 bg-amber-950/60" />
              <div className="absolute bottom-8 left-0 right-0 h-12 border-t-2 border-amber-500/40 bg-amber-950/60" />
            </div>
          </div>
          {/* Right Pillar */}
          <div className="hidden lg:block absolute right-4 top-0 bottom-0 w-20 pointer-events-none opacity-40">
            <div className="h-full w-full border-r-2 border-l-2 border-amber-600/30 bg-gradient-to-r from-amber-950/40 via-amber-900/10 to-amber-950/40 shadow-2xl relative">
              <div className="absolute top-8 left-0 right-0 h-10 border-b-2 border-amber-500/40 bg-amber-950/60" />
              <div className="absolute bottom-8 left-0 right-0 h-12 border-t-2 border-amber-500/40 bg-amber-950/60" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
