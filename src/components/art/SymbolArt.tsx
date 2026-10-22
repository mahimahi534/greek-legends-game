import React from 'react';
import { SymbolType, SpecialTileType } from '../../types/game';

interface SymbolArtProps {
  symbol: SymbolType;
  special?: SpecialTileType;
  size?: number;
  className?: string;
}

export const SymbolArt: React.FC<SymbolArtProps> = ({
  symbol,
  special = 'none',
  size = 48,
  className = '',
}) => {
  const renderSymbolSvg = () => {
    switch (symbol) {
      case 'zeus':
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_2px_8px_rgba(255,215,0,0.6)]">
            <defs>
              <linearGradient id="zeusGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFF9C4" />
                <stop offset="40%" stop-color="#FFD700" />
                <stop offset="100%" stop-color="#B8860B" />
              </linearGradient>
              <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Background Halo */}
            <circle cx="32" cy="32" r="26" fill="#1C1805" stroke="#FFD700" strokeWidth="1.5" strokeOpacity="0.4" />
            <circle cx="32" cy="32" r="22" fill="#2E2308" fillOpacity="0.8" />
            {/* Double Lightning Bolt */}
            <path
              d="M34 6 L20 30 L31 30 L25 58 L45 28 L33 28 L41 6 Z"
              fill="url(#zeusGold)"
              stroke="#FFF"
              strokeWidth="0.75"
              filter="url(#glowGold)"
            />
            {/* Spark highlights */}
            <circle cx="28" cy="20" r="1.5" fill="#FFF" />
            <circle cx="38" cy="40" r="1.2" fill="#FFF" />
          </svg>
        );

      case 'poseidon':
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_2px_8px_rgba(0,206,209,0.6)]">
            <defs>
              <linearGradient id="seaBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E0F7FA" />
                <stop offset="50%" stop-color="#00CED1" />
                <stop offset="100%" stop-color="#006699" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="#041B26" stroke="#00CED1" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="32" cy="32" r="22" fill="#072C3D" />
            {/* Trident */}
            {/* Shaft */}
            <line x1="32" y1="20" x2="32" y2="56" stroke="url(#seaBlue)" strokeWidth="3" strokeLinecap="round" />
            {/* Center Spear */}
            <path d="M32 8 L29 20 L35 20 Z" fill="url(#seaBlue)" />
            {/* Left Prong */}
            <path d="M22 14 C22 28, 28 32, 32 32" stroke="url(#seaBlue)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M22 12 L19 18 L24 18 Z" fill="url(#seaBlue)" />
            {/* Right Prong */}
            <path d="M42 14 C42 28, 36 32, 32 32" stroke="url(#seaBlue)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M42 12 L39 18 L44 18 Z" fill="url(#seaBlue)" />
            {/* Wave arcs */}
            <path d="M16 46 Q 24 40, 32 46 T 48 46" stroke="#80DEEA" strokeWidth="1.5" fill="none" strokeOpacity="0.7" />
          </svg>
        );

      case 'athena':
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_2px_8px_rgba(56,189,248,0.6)]">
            <defs>
              <linearGradient id="athenaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E0F2FE" />
                <stop offset="50%" stop-color="#38BDF8" />
                <stop offset="100%" stop-color="#0369A1" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="#0A1826" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="32" cy="32" r="22" fill="#0F2538" />
            {/* Owl of Athena */}
            <ellipse cx="32" cy="35" rx="14" ry="16" fill="url(#athenaGrad)" />
            {/* Owl Ears / Tuft */}
            <polygon points="20,16 26,24 20,26" fill="url(#athenaGrad)" />
            <polygon points="44,16 38,24 44,26" fill="url(#athenaGrad)" />
            {/* Big Eyes */}
            <circle cx="26" cy="30" r="6" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="26" cy="30" r="3" fill="#0F172A" />
            <circle cx="27" cy="29" r="1" fill="#FFF" />
            <circle cx="38" cy="30" r="6" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="38" cy="30" r="3" fill="#0F172A" />
            <circle cx="39" cy="29" r="1" fill="#FFF" />
            {/* Beak */}
            <polygon points="32,32 30,38 34,38" fill="#FBBF24" />
            {/* Olive branch under */}
            <path d="M22 52 Q32 48 42 52" stroke="#4ADE80" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'sun':
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_2px_8px_rgba(245,158,11,0.6)]">
            <defs>
              <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFBEB" />
                <stop offset="30%" stop-color="#FCD34D" />
                <stop offset="70%" stop-color="#F59E0B" />
                <stop offset="100%" stop-color="#D97706" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="#261A05" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="32" cy="32" r="22" fill="#3D2605" />
            {/* 12 Radiant Rays */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <polygon
                key={deg}
                points="32,10 30,19 34,19"
                fill="url(#sunGrad)"
                transform={`rotate(${deg} 32 32)`}
              />
            ))}
            {/* Inner Glowing Disc */}
            <circle cx="32" cy="32" r="12" fill="url(#sunGrad)" stroke="#FEF3C7" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="7" fill="#FFF" fillOpacity="0.4" />
          </svg>
        );

      case 'amphora':
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_2px_8px_rgba(205,127,50,0.6)]">
            <defs>
              <linearGradient id="amphoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FDE68A" />
                <stop offset="40%" stop-color="#CD7F32" />
                <stop offset="100%" stop-color="#7C2D12" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="#24130A" stroke="#CD7F32" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="32" cy="32" r="22" fill="#3B1C0B" />
            {/* Amphora Body */}
            <path
              d="M28 16 L36 16 L36 20 C44 26, 44 42, 34 50 L30 50 C20 42, 20 26, 28 20 Z"
              fill="url(#amphoraGrad)"
              stroke="#FDE68A"
              strokeWidth="1"
            />
            {/* Handles */}
            <path d="M26 22 C18 24, 18 36, 24 38" stroke="#FDE68A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M38 22 C46 24, 46 36, 40 38" stroke="#FDE68A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Greek Key Motif Band */}
            <rect x="25" y="30" width="14" height="3" fill="#FEF08A" />
            {/* Foot base */}
            <rect x="28" y="50" width="8" height="4" fill="#CD7F32" rx="1" />
          </svg>
        );

      case 'pandora':
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_2px_8px_rgba(168,85,247,0.7)]">
            <defs>
              <linearGradient id="pandoraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F3E8FF" />
                <stop offset="40%" stop-color="#A855F7" />
                <stop offset="100%" stop-color="#4C1D95" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="#1B0E2B" stroke="#A855F7" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="32" cy="32" r="22" fill="#2E104A" />
            {/* Mythical Box Chest */}
            {/* Chest base */}
            <rect x="18" y="28" width="28" height="22" rx="3" fill="url(#pandoraGrad)" stroke="#E9D5FF" strokeWidth="1" />
            {/* Lid */}
            <path d="M16 28 Q32 18 48 28 Z" fill="#C084FC" stroke="#E9D5FF" strokeWidth="1" />
            {/* Golden Lock & Bands */}
            <line x1="24" y1="28" x2="24" y2="50" stroke="#FFD700" strokeWidth="2" />
            <line x1="40" y1="28" x2="40" y2="50" stroke="#FFD700" strokeWidth="2" />
            <circle cx="32" cy="34" r="3.5" fill="#FFD700" stroke="#92400E" strokeWidth="1" />
            {/* Mystical purple glow vapor */}
            <path d="M26 18 Q28 10 32 12 Q36 8 38 16" stroke="#D8B4FE" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        );

      case 'temple':
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_2px_8px_rgba(245,230,202,0.6)]">
            <defs>
              <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="50%" stop-color="#F5E6CA" />
                <stop offset="100%" stop-color="#D4AF37" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="#211E16" stroke="#F5E6CA" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="32" cy="32" r="22" fill="#363124" />
            {/* Pediment (Triangle Roof) */}
            <polygon points="32,14 16,24 48,24" fill="url(#marbleGrad)" stroke="#D4AF37" strokeWidth="1" />
            {/* Architrave Beam */}
            <rect x="18" y="24" width="28" height="3" fill="#FFFBEB" />
            {/* Doric Columns */}
            <rect x="20" y="27" width="4" height="18" fill="url(#marbleGrad)" />
            <rect x="27" y="27" width="4" height="18" fill="url(#marbleGrad)" />
            <rect x="33" y="27" width="4" height="18" fill="url(#marbleGrad)" />
            <rect x="40" y="27" width="4" height="18" fill="url(#marbleGrad)" />
            {/* Base Steps (Crepidoma) */}
            <rect x="17" y="45" width="30" height="3" fill="#F5E6CA" />
            <rect x="15" y="48" width="34" height="4" fill="#D4AF37" rx="1" />
          </svg>
        );

      case 'pegasus':
        return (
          <svg viewBox="0 0 64 64" width={size} height={size} className="drop-shadow-[0_2px_8px_rgba(224,231,255,0.7)]">
            <defs>
              <linearGradient id="pegasusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="50%" stop-color="#E0E7FF" />
                <stop offset="100%" stop-color="#818CF8" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="#141829" stroke="#A5B4FC" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="32" cy="32" r="22" fill="#1E2342" />
            {/* Majestic Wing Pair */}
            {/* Left Wing */}
            <path
              d="M32 38 C26 30, 16 22, 14 12 C18 18, 22 28, 26 30 C20 22, 22 16, 20 10 C24 18, 28 26, 30 32"
              fill="url(#pegasusGrad)"
              stroke="#FFF"
              strokeWidth="0.8"
            />
            {/* Right Wing */}
            <path
              d="M32 38 C38 30, 48 22, 50 12 C46 18, 42 28, 38 30 C44 22, 42 16, 44 10 C40 18, 36 26, 34 32"
              fill="url(#pegasusGrad)"
              stroke="#FFF"
              strokeWidth="0.8"
            />
            {/* Center Heart Emblem / Star */}
            <circle cx="32" cy="38" r="4" fill="#FFD700" />
            <polygon points="32,46 30,52 34,52" fill="#E0E7FF" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {renderSymbolSvg()}

      {/* Special Powerup Overlays */}
      {special === 'lightning_h' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse">
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-yellow-300 to-transparent shadow-[0_0_10px_#FFD700]" />
          <span className="absolute -top-1 text-[10px] font-black text-amber-300 tracking-tighter">⚡ROW</span>
        </div>
      )}

      {special === 'lightning_v' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse">
          <div className="h-full w-2 bg-gradient-to-b from-transparent via-yellow-300 to-transparent shadow-[0_0_10px_#FFD700]" />
          <span className="absolute -right-1 text-[10px] font-black text-amber-300 tracking-tighter">⚡COL</span>
        </div>
      )}

      {special === 'pandora_blast' && (
        <div className="absolute inset-0 rounded-full border-2 border-purple-400 border-dashed animate-spin pointer-events-none shadow-[0_0_12px_#A855F7]">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-purple-900/90 text-purple-200 px-1 rounded font-bold">
            BLAST
          </span>
        </div>
      )}

      {special === 'sun_supernova' && (
        <div className="absolute inset-0 rounded-full border-2 border-amber-300 animate-ping pointer-events-none opacity-75 shadow-[0_0_15px_#F59E0B]" />
      )}
    </div>
  );
};
