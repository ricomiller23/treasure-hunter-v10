import React from 'react';
import { Card, Suit, BoonId } from '../engine/types.ts';

export const SUIT_COLORS: Record<Suit, { primary: string; light: string; dark: string; border: string }> = {
  skull: {
    primary: '#64748b',
    light: '#94a3b8',
    dark: '#334155',
    border: '#475569',
  },
  gem: {
    primary: '#dc2626',
    light: '#ef4444',
    dark: '#991b1b',
    border: '#b91c1c',
  },
  dagger: {
    primary: '#2563eb',
    light: '#3b82f6',
    dark: '#1e40af',
    border: '#1d4ed8',
  },
  coin: {
    primary: '#d97706',
    light: '#f59e0b',
    dark: '#92400e',
    border: '#b45309',
  },
};

export const SuitIcon: React.FC<{ suit: Suit; className?: string }> = ({ suit, className = 'w-5 h-5' }) => {
  switch (suit) {
    case 'skull':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2C7.58 2 4 5.58 4 10c0 2.5 1.15 4.73 2.94 6.22l.56.46V19c0 .55.45 1 1 1h7c.55 0 1-.45 1-1v-2.32l.56-.46C18.85 14.73 20 12.5 20 10c0-4.42-3.58-8-8-8zm-3 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM10 17h1v2h-1v-2zm3 0h1v2h-1v-2z" />
        </svg>
      );
    case 'gem':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M16 2H8L2 8l10 14L22 8l-6-6zm-4 17.5L5.1 8h13.8L12 19.5zM7.2 4h9.6l3 3H4.2l3-3z" />
        </svg>
      );
    case 'dagger':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M19.7 4.3a1 1 0 0 0-1.4 0l-7.6 7.6-1.4-1.4a1 1 0 0 0-1.4 1.4l1.4 1.4-3.6 3.6-2.4-.7a1 1 0 0 0-1.2 1.2l.7 2.4-2.5 2.5a1 1 0 1 0 1.4 1.4l2.5-2.5 2.4.7a1 1 0 0 0 1.2-1.2l-.7-2.4 3.6-3.6 1.4 1.4a1 1 0 0 0 1.4-1.4l-1.4-1.4 7.6-7.6a1 1 0 0 0 0-1.4z" />
        </svg>
      );
    case 'coin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 6v12M9 9h6M9 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
};

/**
 * Mid-century stylized ink illustration for Skull Cave cards (odd values).
 */
export const SkullCaveScene: React.FC<{ suit: Suit; className?: string }> = ({ suit, className = 'w-full h-full' }) => {
  return (
    <svg viewBox="0 0 160 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`caveGlow-${suit}`} cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
          <stop offset="1" stopColor="#09130d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Jungle foliage backdrop */}
      <path d="M0 120 L0 50 Q30 30 80 40 Q130 30 160 50 L160 120 Z" fill="#142a1d" />

      {/* Cave rock formation */}
      <path
        d="M30 120 Q35 40 80 35 Q125 40 130 120 Z"
        fill="#1e293b"
        stroke="#334155"
        strokeWidth="2"
      />

      {/* Ominous Cave Mouth shaped like skull */}
      <circle cx="80" cy="75" r="30" fill="#090d16" />
      <circle cx="80" cy="75" r="28" fill={`url(#caveGlow-${suit})`} />

      {/* Skull eye sockets in rock */}
      <ellipse cx="68" cy="70" rx="7" ry="9" fill="#090d16" />
      <ellipse cx="92" cy="70" rx="7" ry="9" fill="#090d16" />

      {/* Skull nose cavity */}
      <polygon points="80,78 75,86 85,86" fill="#090d16" />

      {/* Stalactite teeth */}
      <polygon points="70,95 73,88 76,95" fill="#334155" />
      <polygon points="77,95 80,87 83,95" fill="#334155" />
      <polygon points="84,95 87,88 90,95" fill="#334155" />

      {/* Hanging vines */}
      <path d="M45 45 Q50 70 45 90" stroke="#2c5d41" strokeWidth="2" fill="none" />
      <path d="M115 45 Q110 70 115 85" stroke="#2c5d41" strokeWidth="2" fill="none" />
      <path d="M80 35 Q85 55 80 65" stroke="#2c5d41" strokeWidth="1.5" fill="none" />

      {/* Warning banner */}
      <rect x="40" y="102" width="80" height="14" rx="2" fill="#7f1d1d" stroke="#ef4444" strokeWidth="0.8" />
      <text x="80" y="112" fill="#fecaca" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="serif">
        SKULL CAVE
      </text>
    </svg>
  );
};

/**
 * Majestic Golden Idol in Jungle light shaft scene (for 10s).
 */
export const IdolScene: React.FC<{ suit?: Suit; className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg viewBox="0 0 160 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="idolSun" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#c9a227" stopOpacity="0.3" />
          <stop offset="1" stopColor="#142a1d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Celestial light shaft */}
      <polygon points="40,0 120,0 145,120 15,120" fill="url(#idolSun)" />

      {/* Stepped stone temple pedestal */}
      <rect x="25" y="100" width="110" height="20" fill="#334155" stroke="#475569" strokeWidth="1.5" />
      <rect x="40" y="86" width="80" height="14" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
      <rect x="55" y="74" width="50" height="12" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />

      {/* Golden Idol Relic */}
      <g transform="translate(80, 52)">
        {/* Glow aura */}
        <circle cx="0" cy="0" r="24" fill="#fbbf24" opacity="0.3" filter="blur(2px)" />

        {/* Golden head */}
        <ellipse cx="0" cy="-6" rx="14" ry="16" fill="#c9a227" stroke="#fef08a" strokeWidth="1.5" />
        {/* Ornate headdress */}
        <path d="M-18 -12 L-10 -24 L0 -28 L10 -24 L18 -12 Z" fill="#937418" stroke="#fef08a" strokeWidth="1" />
        <circle cx="0" cy="-20" r="3" fill="#dc2626" />

        {/* Idol face features */}
        <rect x="-8" y="-9" width="5" height="4" rx="1" fill="#451a03" />
        <rect x="3" y="-9" width="5" height="4" rx="1" fill="#451a03" />
        <polygon points="0,-4 -3,1 3,1" fill="#78350f" />
        <rect x="-6" y="3" width="12" height="3" rx="1" fill="#451a03" />

        {/* Golden torso and arms holding suit gem */}
        <path d="M-12 10 Q-15 22 -6 22 L6 22 Q15 22 12 10 Z" fill="#b45309" stroke="#fef08a" strokeWidth="1" />
      </g>

      {/* Golden banner */}
      <rect x="45" y="104" width="70" height="12" rx="2" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
      <text x="80" y="113" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="serif">
        SACRED IDOL
      </text>
    </svg>
  );
};

/**
 * Standard card center art (values 2, 4, 6, 8).
 */
export const StandardCardScene: React.FC<{ card: Card; className?: string }> = ({ card, className = 'w-full h-full' }) => {
  const col = SUIT_COLORS[card.suit];
  return (
    <div className={`flex flex-col items-center justify-center relative ${className}`}>
      {/* Background compass rose / geometric pattern */}
      <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-15 text-stone-800 absolute">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" fill="none" />
        <polygon points="50,10 54,46 90,50 54,54 50,90 46,54 10,50 46,46" fill="currentColor" />
      </svg>

      {/* Main Suit Icon */}
      <div className="z-10 p-3 rounded-full bg-stone-900/10 border border-stone-800/20 shadow-inner">
        <SuitIcon suit={card.suit} className="w-12 h-12" />
      </div>

      <div className="z-10 mt-1 flex items-center gap-1 opacity-70">
        {Array.from({ length: Math.min(4, Math.floor(card.value / 2)) }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.primary }} />
        ))}
      </div>
    </div>
  );
};

/**
 * Boon Card Artwork generator.
 */
export const BoonGraphic: React.FC<{ boonId: BoonId; className?: string }> = ({ boonId, className = 'w-full h-full' }) => {
  switch (boonId) {
    case 'base_camp':
      return (
        <svg viewBox="0 0 140 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Expedition tent */}
          <polygon points="70,15 25,80 115,80" fill="#a16207" stroke="#fef08a" strokeWidth="1.5" />
          <polygon points="70,15 70,80 115,80" fill="#713f12" />
          <polygon points="70,35 50,80 90,80" fill="#292524" />
          {/* Campfire */}
          <circle cx="30" cy="85" r="6" fill="#f97316" />
          <polygon points="26,86 30,76 34,86" fill="#ef4444" />
          <polygon points="28,87 30,80 32,87" fill="#fef08a" />
        </svg>
      );
    case 'machete':
      return (
        <svg viewBox="0 0 140 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Sliced emerald vine */}
          <path d="M20,20 Q60,40 120,30" stroke="#15803d" strokeWidth="6" fill="none" />
          <path d="M30,80 Q70,70 120,80" stroke="#15803d" strokeWidth="5" fill="none" />
          {/* Tempered steel machete blade */}
          <path
            d="M25,75 L85,25 Q115,10 125,20 Q120,35 95,45 L40,85 Z"
            fill="#e2e8f0"
            stroke="#475569"
            strokeWidth="1.5"
          />
          {/* Brass hilt */}
          <rect x="20" y="75" width="15" height="18" rx="2" transform="rotate(-40 20 75)" fill="#c9a227" />
        </svg>
      );
    case 'rope_bridge':
      return (
        <svg viewBox="0 0 140 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Deep canyon cliffs */}
          <polygon points="0,0 25,0 35,100 0,100" fill="#1e293b" />
          <polygon points="115,0 140,0 140,100 105,100" fill="#1e293b" />
          {/* Swagging rope rails */}
          <path d="M25,25 Q70,60 115,25" stroke="#a16207" strokeWidth="2.5" fill="none" />
          <path d="M25,40 Q70,75 115,40" stroke="#713f12" strokeWidth="2" fill="none" />
          {/* Vertical rope stays */}
          <line x1="45" y1="36" x2="45" y2="52" stroke="#a16207" strokeWidth="1" />
          <line x1="70" y1="42" x2="70" y2="58" stroke="#a16207" strokeWidth="1" />
          <line x1="95" y1="36" x2="95" y2="52" stroke="#a16207" strokeWidth="1" />
        </svg>
      );
    case 'map':
      return (
        <svg viewBox="0 0 140 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Curled parchment map */}
          <rect x="25" y="15" width="90" height="70" rx="3" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
          {/* Dotted path */}
          <path d="M35,30 Q60,25 70,50 T100,70" stroke="#dc2626" strokeWidth="2" strokeDasharray="3 3" fill="none" />
          {/* Red X */}
          <line x1="95" y1="65" x2="105" y2="75" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" />
          <line x1="105" y1="65" x2="95" y2="75" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round" />
          {/* Compass rose */}
          <circle cx="45" cy="65" r="10" stroke="#78350f" strokeWidth="1" fill="none" />
          <polygon points="45,58 47,65 45,72 43,65" fill="#78350f" />
        </svg>
      );
    case 'lantern':
      return (
        <svg viewBox="0 0 140 100" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Warm light glow */}
          <circle cx="70" cy="55" r="32" fill="#fbbf24" opacity="0.35" />
          {/* Brass storm lantern */}
          <rect x="52" y="35" width="36" height="42" rx="4" fill="#0284c7" fillOpacity="0.2" stroke="#c9a227" strokeWidth="2" />
          {/* Top cap and loop */}
          <path d="M50,35 Q70,22 90,35 Z" fill="#937418" stroke="#c9a227" strokeWidth="1" />
          <path d="M60,24 A10,10 0 0,1 80,24" stroke="#c9a227" strokeWidth="2" fill="none" />
          {/* Base */}
          <rect x="48" y="77" width="44" height="10" rx="2" fill="#937418" stroke="#c9a227" strokeWidth="1.5" />
          {/* Flame */}
          <ellipse cx="70" cy="55" rx="5" ry="9" fill="#f59e0b" />
          <ellipse cx="70" cy="56" rx="2.5" ry="5" fill="#fef08a" />
        </svg>
      );
  }
};
