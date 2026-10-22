import React from 'react';

interface AtlantisLandscapeProps {
  intensity?: 'full' | 'subtle';
}

export const AtlantisLandscape: React.FC<AtlantisLandscapeProps> = ({
  intensity = 'full',
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep Ocean Water Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#022F40] via-[#041D30] to-[#010D18]" />

      {/* Sunbeams / God Rays Piercing from Surface */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <svg
          viewBox="0 0 1000 800"
          className="w-full h-full"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ray1" x1="20%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#00CED1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ray2" x1="60%" y1="0%" x2="30%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#083344" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="ray3" x1="85%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Angled Light Beams */}
          <polygon points="120,0 260,0 480,800 280,800" fill="url(#ray1)" className="animate-pulse" style={{ animationDuration: '7s' }} />
          <polygon points="450,0 600,0 750,800 520,800" fill="url(#ray2)" className="animate-pulse" style={{ animationDuration: '9s', animationDelay: '1.5s' }} />
          <polygon points="780,0 900,0 980,800 820,800" fill="url(#ray3)" className="animate-pulse" style={{ animationDuration: '6s', animationDelay: '3s' }} />
        </svg>
      </div>

      {/* Floating Animated Rising Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(28)].map((_, i) => {
          const size = 6 + (i % 5) * 4;
          const left = 5 + (i * 13) % 90;
          const duration = 7 + (i % 6) * 2;
          const delay = (i * 0.7) % 8;

          return (
            <div
              key={i}
              className="absolute rounded-full border border-cyan-200/60 bg-gradient-to-tr from-cyan-400/20 via-sky-300/30 to-white/60 shadow-[0_0_8px_rgba(0,206,209,0.5)]"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                bottom: '-40px',
                animation: `floatUp ${duration}s ease-in infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              {/* Highlight shine */}
              <div className="w-1.5 h-1.5 rounded-full bg-white/80 absolute top-0.5 left-0.5" />
            </div>
          );
        })}
      </div>

      {/* Distant Sunken City of Atlantis Silhouettes */}
      <svg
        viewBox="0 0 1440 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-12 w-full h-80 opacity-30 pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="atlantisCity" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#083344" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#031622" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Central Spire Palace */}
        <polygon points="660,450 720,110 780,450" fill="url(#atlantisCity)" />
        <circle cx="720" cy="95" r="14" fill="#00CED1" opacity="0.6" />
        <rect x="680" y="240" width="80" height="150" fill="url(#atlantisCity)" />

        {/* Aqueduct arches and underwater colonnade */}
        <path
          d="M200 450 L200 260 Q 250 210, 300 260 L300 450 M300 260 Q 350 210, 400 260 L400 450 M400 260 Q 450 210, 500 260 L500 450"
          stroke="#00CED1"
          strokeWidth="6"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Right Dome Palace */}
        <path
          d="M960 450 L960 280 C960 180, 1140 180, 1140 280 L1140 450 Z"
          fill="url(#atlantisCity)"
        />
        <circle cx="1050" cy="180" r="16" fill="#00CED1" opacity="0.6" />
      </svg>

      {/* Bioluminescent Sea Floor & Corals */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#010C17] via-[#042033]/90 to-transparent border-t border-cyan-500/30">
        {/* Glowing seabed caustics */}
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-400/25 via-emerald-500/10 to-transparent animate-pulse" />

        {/* Floating Bioluminescent Plankton */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-300 animate-sparkle"
            style={{
              bottom: `${10 + (i * 7) % 80}px`,
              left: `${(i * 17) % 98}%`,
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              boxShadow: '0 0 8px #00CED1',
              animationDelay: `${(i * 0.3) % 4}s`,
            }}
          />
        ))}
      </div>

      {/* Majestic Atlantean Coral Columns (Left and Right Foreground) */}
      {intensity === 'full' && (
        <>
          {/* Left Atlantean Pillar with Coral */}
          <div className="hidden lg:block absolute left-4 top-0 bottom-0 w-24 pointer-events-none opacity-50">
            <div className="h-full w-full border-r-2 border-l-2 border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-blue-900/20 to-cyan-950/60 shadow-[0_0_20px_rgba(0,206,209,0.3)] relative">
              {/* Trident emblem on column top */}
              <div className="absolute top-10 left-0 right-0 h-12 bg-cyan-950/80 border-b border-cyan-400/50 flex items-center justify-center text-cyan-300 text-lg">
                🔱
              </div>
              {/* Coral Growth accents */}
              <div className="absolute bottom-20 -right-2 w-8 h-12 bg-rose-500/40 rounded-full blur-sm" />
              <div className="absolute bottom-8 left-0 right-0 h-14 bg-cyan-950/80 border-t border-cyan-400/50" />
            </div>
          </div>

          {/* Right Atlantean Pillar with Coral */}
          <div className="hidden lg:block absolute right-4 top-0 bottom-0 w-24 pointer-events-none opacity-50">
            <div className="h-full w-full border-r-2 border-l-2 border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-blue-900/20 to-cyan-950/60 shadow-[0_0_20px_rgba(0,206,209,0.3)] relative">
              <div className="absolute top-10 left-0 right-0 h-12 bg-cyan-950/80 border-b border-cyan-400/50 flex items-center justify-center text-cyan-300 text-lg">
                🔱
              </div>
              <div className="absolute bottom-28 -left-2 w-8 h-12 bg-emerald-500/40 rounded-full blur-sm" />
              <div className="absolute bottom-8 left-0 right-0 h-14 bg-cyan-950/80 border-t border-cyan-400/50" />
            </div>
          </div>
        </>
      )}

      {/* Bubble rise keyframe styles */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(-50vh) translateX(15px);
          }
          75% {
            transform: translateY(-75vh) translateX(-15px);
          }
          95% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-110vh) translateX(8px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
