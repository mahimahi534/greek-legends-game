import React from 'react';

interface CharacterArtProps {
  id: string;
  size?: number;
  className?: string;
  isUnlocked?: boolean;
}

export const CharacterArt: React.FC<CharacterArtProps> = ({
  id,
  size = 120,
  className = '',
  isUnlocked = true,
}) => {
  const renderSvg = () => {
    switch (id) {
      case 'zeus':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="zeusBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1E1B4B" />
                <stop offset="100%" stop-color="#312E81" />
              </linearGradient>
              <linearGradient id="goldHelm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFF3B0" />
                <stop offset="50%" stop-color="#FFD700" />
                <stop offset="100%" stop-color="#B45309" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#zeusBg)" stroke="#FFD700" strokeWidth="2.5" />
            {/* Lightning background arcs */}
            <path d="M20 25 L35 45 L28 48 L48 75" stroke="#FDE047" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M80 25 L65 45 L72 48 L52 75" stroke="#FDE047" strokeWidth="1.5" fill="none" opacity="0.6" />
            {/* Head & Beard */}
            <ellipse cx="50" cy="46" rx="16" ry="19" fill="#F8C4A5" />
            {/* Beard & White Hair */}
            <path
              d="M34 40 C30 40, 24 55, 30 75 C36 85, 64 85, 70 75 C76 55, 70 40, 66 40 C62 48, 58 54, 50 56 C42 54, 38 48, 34 40 Z"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            {/* Hair */}
            <path d="M30 38 C28 20, 72 20, 70 38 C64 26, 36 26, 30 38 Z" fill="#F8FAFC" />
            {/* Golden Laurel Crown */}
            <path d="M28 32 C38 24, 62 24, 72 32" stroke="url(#goldHelm)" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Golden Laurel Leaves */}
            <circle cx="36" cy="27" r="3" fill="#FDE047" />
            <circle cx="44" cy="25" r="3.5" fill="#FDE047" />
            <circle cx="56" cy="25" r="3.5" fill="#FDE047" />
            <circle cx="64" cy="27" r="3" fill="#FDE047" />
            {/* Glowing Eyes */}
            <circle cx="43" cy="42" r="2.5" fill="#38BDF8" />
            <circle cx="57" cy="42" r="2.5" fill="#38BDF8" />
            <circle cx="43" cy="42" r="1" fill="#FFF" />
            <circle cx="57" cy="42" r="1" fill="#FFF" />
            {/* Golden Armor Shoulders */}
            <path d="M22 84 C22 70, 78 70, 78 84 L78 96 L22 96 Z" fill="url(#goldHelm)" />
            {/* Center Thunderbolt Sigil */}
            <path d="M52 74 L46 83 L51 83 L47 94 L56 82 L51 82 Z" fill="#FFF" />
          </svg>
        );

      case 'athena':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="athenaBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#082F49" />
                <stop offset="100%" stop-color="#0C4A6E" />
              </linearGradient>
              <linearGradient id="bronzeHelm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FDE68A" />
                <stop offset="50%" stop-color="#D97706" />
                <stop offset="100%" stop-color="#78350F" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#athenaBg)" stroke="#38BDF8" strokeWidth="2.5" />
            {/* Face */}
            <ellipse cx="50" cy="52" rx="15" ry="18" fill="#FBD5BC" />
            {/* Flowing Dark Brown Locks */}
            <path d="M32 50 C28 65, 30 80, 36 86" stroke="#451A03" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M68 50 C72 65, 70 80, 64 86" stroke="#451A03" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Athena Helmet */}
            <path d="M28 42 C28 20, 72 20, 72 42 L66 48 L60 38 L40 38 L34 48 Z" fill="url(#bronzeHelm)" stroke="#FFD700" strokeWidth="1" />
            {/* Helmet Plume Crest */}
            <path d="M46 12 C46 6, 54 6, 54 12 L56 26 L44 26 Z" fill="#0284C7" />
            <path d="M50 4 C40 4, 38 20, 48 24 C58 20, 60 4, 50 4 Z" fill="#38BDF8" opacity="0.8" />
            {/* Wise Eyes */}
            <ellipse cx="44" cy="50" rx="3" ry="2" fill="#0C4A6E" />
            <ellipse cx="56" cy="50" rx="3" ry="2" fill="#0C4A6E" />
            <circle cx="45" cy="49" r="1" fill="#FFF" />
            <circle cx="57" cy="49" r="1" fill="#FFF" />
            {/* Silver Armor Breastplate with Owl medallion */}
            <path d="M26 80 C26 70, 74 70, 74 80 L76 96 L24 96 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="50" cy="84" r="6" fill="#FDE047" stroke="#B45309" strokeWidth="1" />
            <circle cx="48" cy="83" r="1.5" fill="#000" />
            <circle cx="52" cy="83" r="1.5" fill="#000" />
          </svg>
        );

      case 'poseidon':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="poseidonBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#042F2E" />
                <stop offset="100%" stop-color="#0F766E" />
              </linearGradient>
              <linearGradient id="waterHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E0F2FE" />
                <stop offset="50%" stop-color="#38BDF8" />
                <stop offset="100%" stop-color="#0284C7" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#poseidonBg)" stroke="#00CED1" strokeWidth="2.5" />
            {/* Swirling ocean waves background */}
            <path d="M15 75 Q 30 65, 50 75 T 85 75" stroke="#2DD4BF" strokeWidth="2" fill="none" opacity="0.5" />
            {/* Face */}
            <ellipse cx="50" cy="45" rx="15" ry="18" fill="#F5CBA7" />
            {/* Sea Foam Beard */}
            <path
              d="M34 44 C26 62, 34 84, 50 84 C66 84, 74 62, 66 44 C60 52, 56 56, 50 56 C44 56, 40 52, 34 44 Z"
              fill="url(#waterHair)"
            />
            {/* Hair */}
            <path d="M30 38 C26 22, 74 22, 70 38 C62 26, 38 26, 30 38 Z" fill="url(#waterHair)" />
            {/* Coral and Gold Crown */}
            <path d="M34 28 L40 16 L46 24 L50 14 L54 24 L60 16 L66 28 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
            {/* Sea Blue Eyes */}
            <circle cx="44" cy="41" r="2.5" fill="#00CED1" />
            <circle cx="56" cy="41" r="2.5" fill="#00CED1" />
            <circle cx="44" cy="40" r="1" fill="#FFF" />
            <circle cx="56" cy="40" r="1" fill="#FFF" />
            {/* Turquoise Sea Armor */}
            <path d="M22 84 C22 72, 78 72, 78 84 L78 96 L22 96 Z" fill="#0D9488" stroke="#5EEAD4" strokeWidth="1" />
            {/* Mini Trident on chest */}
            <path d="M50 74 L50 92 M46 78 Q 50 84, 54 78" stroke="#FFD700" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'amphitrite':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="amphiBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#042F40" />
                <stop offset="100%" stopColor="#083344" />
              </linearGradient>
              <linearGradient id="sirenHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A7F3D0" />
                <stop offset="50%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#amphiBg)" stroke="#06B6D4" strokeWidth="2.5" />
            {/* Ambient rising bubble */}
            <circle cx="25" cy="30" r="3" fill="#E0F2FE" opacity="0.6" />
            <circle cx="78" cy="45" r="2.5" fill="#E0F2FE" opacity="0.5" />
            {/* Flowing Mermaid Hair Behind */}
            <path d="M26 40 C14 55, 18 85, 30 92" stroke="url(#sirenHair)" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M74 40 C86 55, 82 85, 70 92" stroke="url(#sirenHair)" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Face */}
            <ellipse cx="50" cy="50" rx="14" ry="17" fill="#FDE2D2" />
            {/* Hair bangs */}
            <path d="M34 42 C40 32, 60 32, 66 42 C60 36, 40 36, 34 42 Z" fill="url(#sirenHair)" />
            {/* Shell Tiara / Crown with Pearl */}
            <path d="M36 34 L42 22 L50 26 L58 22 L64 34 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
            <circle cx="50" cy="28" r="4" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1" />
            {/* Ethereal Eyes */}
            <ellipse cx="44" cy="48" rx="3" ry="2" fill="#0891B2" />
            <ellipse cx="56" cy="48" rx="3" ry="2" fill="#0891B2" />
            <circle cx="45" cy="47" r="1" fill="#FFF" />
            <circle cx="57" cy="47" r="1" fill="#FFF" />
            {/* Pearl necklace & Aquamarine armor */}
            <path d="M26 80 C26 70, 74 70, 74 80 L76 96 L24 96 Z" fill="#0891B2" stroke="#67E8F9" strokeWidth="1.5" />
            <circle cx="42" cy="76" r="2" fill="#FFF" />
            <circle cx="50" cy="77" r="2.5" fill="#FFF" />
            <circle cx="58" cy="76" r="2" fill="#FFF" />
          </svg>
        );

      case 'hercules':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="hercBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#431407" />
                <stop offset="100%" stop-color="#7C2D12" />
              </linearGradient>
              <linearGradient id="lionPelt" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FBBF24" />
                <stop offset="50%" stop-color="#B45309" />
                <stop offset="100%" stop-color="#78350F" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#hercBg)" stroke="#EA580C" strokeWidth="2.5" />
            {/* Lion Head Hood / Pelt */}
            <path d="M25 40 C22 18, 78 18, 75 40 C75 52, 68 56, 68 44 C60 30, 40 30, 32 44 C32 56, 25 52, 25 40 Z" fill="url(#lionPelt)" />
            {/* Lion Ears */}
            <circle cx="30" cy="22" r="5" fill="#B45309" />
            <circle cx="70" cy="22" r="5" fill="#B45309" />
            {/* Strong Jaw Face */}
            <polygon points="36,40 64,40 60,68 40,68" fill="#E09F67" />
            {/* Short Hero Hair under lion */}
            <path d="M34 38 Q50 32 66 38" stroke="#451A03" strokeWidth="3" fill="none" />
            {/* Fierce Eyes */}
            <polygon points="40,46 47,46 45,49 41,49" fill="#1C1917" />
            <polygon points="53,46 60,46 59,49 55,49" fill="#1C1917" />
            {/* Lion Teeth framing forehead */}
            <polygon points="37,34 41,40 43,34" fill="#FFF" />
            <polygon points="57,34 59,40 63,34" fill="#FFF" />
            {/* Massive Heroic Shoulders & Bronze Pauldron */}
            <path d="M18 82 C18 68, 82 68, 82 82 L82 96 L18 96 Z" fill="#9A3412" stroke="#EA580C" strokeWidth="1.5" />
            {/* Studded leather straps */}
            <line x1="30" y1="74" x2="70" y2="94" stroke="#FBBF24" strokeWidth="3" />
            <circle cx="48" cy="83" r="3" fill="#FFF" />
          </svg>
        );

      case 'pegasus':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="pegasusBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1E1B4B" />
                <stop offset="100%" stop-color="#3730A3" />
              </linearGradient>
              <linearGradient id="whiteFeather" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" />
                <stop offset="70%" stop-color="#E0E7FF" />
                <stop offset="100%" stop-color="#C7D2FE" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#pegasusBg)" stroke="#818CF8" strokeWidth="2.5" />
            {/* Celestial stars background */}
            <circle cx="25" cy="25" r="1.5" fill="#FFF" />
            <circle cx="75" cy="22" r="1.5" fill="#FFF" />
            <circle cx="80" cy="70" r="1" fill="#FFF" />
            {/* Giant Spread Wings */}
            <path
              d="M50 56 C30 36, 12 30, 8 16 C16 28, 26 40, 36 46 C24 34, 20 22, 18 10 C28 26, 38 42, 46 52"
              fill="url(#whiteFeather)"
              stroke="#A5B4FC"
              strokeWidth="0.8"
            />
            <path
              d="M50 56 C70 36, 88 30, 92 16 C84 28, 74 40, 64 46 C76 34, 80 22, 82 10 C72 26, 62 42, 54 52"
              fill="url(#whiteFeather)"
              stroke="#A5B4FC"
              strokeWidth="0.8"
            />
            {/* Noble Horse Profile */}
            <path
              d="M44 32 C40 24, 46 16, 52 16 C58 16, 60 22, 58 32 L62 52 C60 62, 42 66, 40 56 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            {/* Ears */}
            <polygon points="46,16 48,8 52,14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
            <polygon points="54,16 56,8 60,14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
            {/* Blue Star Eye */}
            <circle cx="52" cy="26" r="2.5" fill="#6366F1" />
            <circle cx="53" cy="25" r="1" fill="#FFF" />
            {/* Luminescent Flowing Mane */}
            <path d="M44 26 C38 34, 38 46, 44 54" stroke="#818CF8" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Golden Star medallion on chest */}
            <circle cx="50" cy="74" r="7" fill="#FFD700" stroke="#B45309" strokeWidth="1" />
            <polygon points="50,69 52,73 56,74 53,77 54,81 50,78 46,81 47,77 44,74 48,73" fill="#FFF" />
          </svg>
        );

      case 'helios':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="heliosBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#451A03" />
                <stop offset="100%" stop-color="#78350F" />
              </linearGradient>
              <linearGradient id="sunGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FEF08A" />
                <stop offset="50%" stop-color="#F59E0B" />
                <stop offset="100%" stop-color="#B45309" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#heliosBg)" stroke="#F59E0B" strokeWidth="2.5" />
            {/* Solar Corona Aureole (12 Rays) */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <polygon
                key={deg}
                points="50,14 47,24 53,24"
                fill="url(#sunGold)"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
            {/* Radiant Face */}
            <circle cx="50" cy="50" r="24" fill="url(#sunGold)" stroke="#FEF3C7" strokeWidth="1.5" />
            {/* Sun Features */}
            {/* Fiery Eyes */}
            <ellipse cx="43" cy="46" rx="3.5" ry="2.5" fill="#78350F" />
            <ellipse cx="57" cy="46" rx="3.5" ry="2.5" fill="#78350F" />
            <circle cx="43" cy="46" r="1.5" fill="#FFF" />
            <circle cx="57" cy="46" r="1.5" fill="#FFF" />
            {/* Golden Nose & Serene Smile */}
            <path d="M50 48 L48 54 L52 54" stroke="#92400E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M44 58 Q 50 63 56 58" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Solar Chariot Collar */}
            <path d="M26 82 C26 72, 74 72, 74 82 L76 96 L24 96 Z" fill="#D97706" stroke="#FEF08A" strokeWidth="1.5" />
            <circle cx="50" cy="85" r="5" fill="#FFF" />
          </svg>
        );

      case 'hades':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="hadesBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0F051D" />
                <stop offset="100%" stop-color="#2E1065" />
              </linearGradient>
              <linearGradient id="obsidian" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4C1D95" />
                <stop offset="50%" stop-color="#1E1B4B" />
                <stop offset="100%" stop-color="#090514" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#hadesBg)" stroke="#A855F7" strokeWidth="2.5" />
            {/* Underworld violet embers */}
            <circle cx="22" cy="35" r="2" fill="#C084FC" opacity="0.7" />
            <circle cx="78" cy="40" r="2" fill="#C084FC" opacity="0.7" />
            <circle cx="28" cy="65" r="1.5" fill="#C084FC" opacity="0.7" />
            {/* Dark Hood and Cloak */}
            <path d="M20 90 C20 40, 32 18, 50 18 C68 18, 80 40, 80 90 Z" fill="url(#obsidian)" stroke="#7C3AED" strokeWidth="1" />
            {/* Shadow Face */}
            <ellipse cx="50" cy="52" rx="14" ry="17" fill="#1E1B4B" />
            {/* Piercing Violet Eyes */}
            <circle cx="44" cy="48" r="2.5" fill="#D8B4FE" />
            <circle cx="56" cy="48" r="2.5" fill="#D8B4FE" />
            <circle cx="44" cy="48" r="1" fill="#FFF" />
            <circle cx="56" cy="48" r="1" fill="#FFF" />
            {/* Helm of Darkness Spikes */}
            <polygon points="34,22 30,10 40,18" fill="#C084FC" />
            <polygon points="50,18 50,6 54,16" fill="#C084FC" />
            <polygon points="66,22 70,10 60,18" fill="#C084FC" />
            {/* Underworld Ruby Medallion */}
            <circle cx="50" cy="82" r="6" fill="#DC2626" stroke="#FFD700" strokeWidth="1.5" />
            <circle cx="49" cy="80" r="1.5" fill="#FFF" />
          </svg>
        );

      case 'medusa':
        return (
          <svg viewBox="0 0 100 100" width={size} height={size}>
            <defs>
              <linearGradient id="medusaBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#022C22" />
                <stop offset="100%" stop-color="#064E3B" />
              </linearGradient>
              <linearGradient id="snakeSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6EE7B7" />
                <stop offset="50%" stop-color="#10B981" />
                <stop offset="100%" stop-color="#047857" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#medusaBg)" stroke="#10B981" strokeWidth="2.5" />
            {/* Writhing Serpent Hair */}
            {/* Left Snakes */}
            <path d="M35 35 C20 20, 14 36, 12 28 C10 20, 22 14, 32 24" stroke="url(#snakeSkin)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="12" cy="28" r="2" fill="#FBBF24" />
            <path d="M30 45 C15 45, 12 60, 8 55 C6 50, 16 40, 28 38" stroke="url(#snakeSkin)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="8" cy="55" r="2" fill="#FBBF24" />
            {/* Right Snakes */}
            <path d="M65 35 C80 20, 86 36, 88 28 C90 20, 78 14, 68 24" stroke="url(#snakeSkin)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="88" cy="28" r="2" fill="#FBBF24" />
            <path d="M70 45 C85 45, 88 60, 92 55 C94 50, 84 40, 72 38" stroke="url(#snakeSkin)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="92" cy="55" r="2" fill="#FBBF24" />
            {/* Top Crown Snakes */}
            <path d="M44 26 C40 10, 50 8, 48 4" stroke="url(#snakeSkin)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M56 26 C60 10, 50 8, 52 4" stroke="url(#snakeSkin)" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Pale Noble Face */}
            <ellipse cx="50" cy="52" rx="14" ry="17" fill="#E2E8F0" />
            {/* Petrifying Gold Eyes */}
            <ellipse cx="44" cy="49" rx="3.5" ry="2" fill="#F59E0B" stroke="#047857" strokeWidth="0.8" />
            <ellipse cx="56" cy="49" rx="3.5" ry="2" fill="#F59E0B" stroke="#047857" strokeWidth="0.8" />
            <circle cx="44" cy="49" r="1.2" fill="#000" />
            <circle cx="56" cy="49" r="1.2" fill="#000" />
            {/* Emerald Lips & Choker */}
            <path d="M46 62 Q 50 64 54 62" stroke="#047857" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M26 80 C26 70, 74 70, 74 80 L76 96 L24 96 Z" fill="#064E3B" stroke="#34D399" strokeWidth="1.5" />
            <circle cx="50" cy="84" r="5" fill="#FBBF24" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {renderSvg()}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/75 rounded-full flex flex-col items-center justify-center backdrop-blur-[2px] border-2 border-amber-900/50">
          <span className="text-2xl mb-1">🔒</span>
          <span className="text-[10px] font-bold text-amber-200 uppercase tracking-widest">Locked</span>
        </div>
      )}
    </div>
  );
};
