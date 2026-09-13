import { useState } from 'react';
import { SCENE_PALETTES } from '../../utils/scenes';

/**
 * Renders a full-bleed destination visual. If a real photo URL is passed
 * via `image`, it's shown with a Ken-Burns zoom and gradient overlay; if
 * it fails to load (offline, rate-limited, dead link) or none is given,
 * this falls back to an original illustrated "scene" in a modern
 * travel-poster style, so the UI never shows a broken-image icon.
 */
export default function Scene({ scene = 'hillstation', image = null, className = '', kenBurns = true, children }) {
  const [from, to] = SCENE_PALETTES[scene] || SCENE_PALETTES.hillstation;
  const [imageFailed, setImageFailed] = useState(false);

  if (image && !imageFailed) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={image}
          alt=""
          loading="lazy"
          onError={() => setImageFailed(true)}
          className={`h-full w-full object-cover ${kenBurns ? 'transition-transform duration-[6s] ease-out group-hover:scale-110' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {children}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: from }}>
      <div
        className={`absolute inset-0 ${kenBurns ? 'animate-float-slow group-hover:scale-110' : ''} transition-transform duration-[4s] ease-out`}
        style={{ transformOrigin: 'center' }}
      >
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
          <defs>
            <linearGradient id={`sky-${scene}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
            <radialGradient id={`sun-${scene}`} cx="50%" cy="25%" r="45%">
              <stop offset="0%" stopColor="#ffd685" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ffd685" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill={`url(#sky-${scene})`} />
          <circle cx="200" cy="80" r="140" fill={`url(#sun-${scene})`} />
          <SceneArt scene={scene} />
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {children}
    </div>
  );
}

function SceneArt({ scene }) {
  switch (scene) {
    case 'waterfall':
      return (
        <g opacity="0.9">
          <path d="M0 220 L60 150 L110 220 Z" fill="#0a1e33" opacity="0.7" />
          <path d="M90 230 L170 130 L230 230 Z" fill="#0a1e33" opacity="0.85" />
          <rect x="176" y="60" width="26" height="180" fill="#e9f4f7" opacity="0.55" />
          <path d="M170 60 L202 60 L214 240 L158 240 Z" fill="#dff0f4" opacity="0.5" />
          <path d="M0 260 Q200 220 400 260 L400 300 L0 300 Z" fill="#0a1e33" />
        </g>
      );
    case 'hillstation':
      return (
        <g opacity="0.9">
          <path d="M-20 240 L100 110 L190 220 L260 140 L420 240 Z" fill="#132a1f" opacity="0.8" />
          <path d="M-20 260 L140 160 L260 250 L340 180 L420 260 Z" fill="#0d1f17" />
          <g opacity="0.5">
            <circle cx="90" cy="180" r="10" fill="#1f9d77" />
            <circle cx="150" cy="200" r="8" fill="#1f9d77" />
            <circle cx="300" cy="190" r="9" fill="#1f9d77" />
          </g>
          <rect x="0" y="270" width="400" height="30" fill="#0d1f17" />
        </g>
      );
    case 'wildlife':
      return (
        <g opacity="0.9">
          <path d="M0 250 Q100 220 200 250 T400 250 L400 300 L0 300 Z" fill="#16321f" />
          <path d="M0 265 Q120 235 240 265 T400 260 L400 300 L0 300 Z" fill="#0f2417" />
          <path
            d="M150 210 q20 -30 45 -8 q10 8 22 4 q14 -5 20 8 q-10 14 -28 12 q6 14 -6 20 q-14 6 -22 -6 q-18 4 -24 -12 q-10 -10 -7 -18Z"
            fill="#0a1a10"
            opacity="0.85"
          />
          <g stroke="#0a1a10" strokeWidth="3" opacity="0.6">
            <line x1="90" y1="240" x2="90" y2="270" />
            <line x1="110" y1="245" x2="110" y2="275" />
            <line x1="70" y1="248" x2="70" y2="272" />
          </g>
        </g>
      );
    case 'heritageTemple':
      return (
        <g opacity="0.92">
          <rect x="140" y="150" width="120" height="90" fill="#1c1005" opacity="0.85" />
          <path d="M140 150 L200 90 L260 150 Z" fill="#1c1005" />
          <rect x="170" y="185" width="18" height="55" fill="#0e0802" />
          <rect x="212" y="185" width="18" height="55" fill="#0e0802" />
          <circle cx="200" cy="78" r="7" fill="#1c1005" />
          <rect x="60" y="200" width="46" height="40" fill="#1c1005" opacity="0.7" />
          <path d="M60 200 L83 178 L106 200 Z" fill="#1c1005" opacity="0.7" />
          <rect x="294" y="200" width="46" height="40" fill="#1c1005" opacity="0.7" />
          <path d="M294 200 L317 178 L340 200 Z" fill="#1c1005" opacity="0.7" />
          <rect x="0" y="240" width="400" height="60" fill="#150c04" />
        </g>
      );
    case 'heritageFort':
      return (
        <g opacity="0.92">
          <rect x="70" y="160" width="260" height="80" fill="#1e1204" />
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={70 + i * 29} y="150" width="16" height="14" fill="#1e1204" />
          ))}
          <rect x="110" y="120" width="34" height="120" fill="#170e03" />
          <rect x="256" y="110" width="34" height="130" fill="#170e03" />
          <circle cx="127" cy="112" r="16" fill="none" stroke="#170e03" strokeWidth="6" />
          <rect x="0" y="240" width="400" height="60" fill="#140b02" />
        </g>
      );
    case 'backwater':
      return (
        <g opacity="0.9">
          <path d="M0 250 Q200 230 400 250 L400 300 L0 300 Z" fill="#062421" />
          <path d="M40 250 q60 -18 110 0 t100 0 t100 0" fill="none" stroke="#0a3530" strokeWidth="6" opacity="0.6" />
          <path d="M150 230 l60 -4 l10 20 l-80 8 Z" fill="#0a1a17" />
          <rect x="175" y="200" width="6" height="34" fill="#0a1a17" />
          <path d="M330 60 q26 40 0 78 q-26 -38 0 -78Z" fill="#0f2e1f" opacity="0.6" />
        </g>
      );
    case 'beach':
      return (
        <g opacity="0.92">
          <path d="M0 250 Q200 235 400 250 L400 300 L0 300 Z" fill="#e7d9b0" opacity="0.9" />
          <path d="M0 246 Q200 232 400 246" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.7" />
          <path d="M60 230 q4 -70 34 -96 q-6 40 -4 96Z" fill="#123a2a" />
          <path d="M94 140 q30 -14 46 4 q-26 4 -46 -4Z" fill="#1a5238" />
          <path d="M94 140 q-30 -6 -40 14 q28 8 40 -14Z" fill="#1a5238" />
          <path d="M94 140 q10 -28 34 -30 q-8 22 -34 30Z" fill="#1a5238" />
        </g>
      );
    case 'ghat':
      return (
        <g opacity="0.92">
          <rect x="0" y="200" width="400" height="20" fill="#241505" />
          <rect x="0" y="220" width="400" height="12" fill="#2c1a08" />
          <rect x="0" y="232" width="400" height="10" fill="#33200b" />
          <path d="M0 250 Q200 232 400 250 L400 300 L0 300 Z" fill="#07201d" />
          {[60, 130, 200, 270, 330].map((x, i) => (
            <rect key={i} x={x} y={140 + (i % 2) * 10} width="14" height={60 - (i % 2) * 10} fill="#1c1005" />
          ))}
        </g>
      );
    case 'desertCity':
      return (
        <g opacity="0.92">
          <path d="M0 260 Q100 220 200 250 T400 240 L400 300 L0 300 Z" fill="#5a3315" opacity="0.9" />
          <rect x="150" y="170" width="100" height="80" fill="#3a2210" />
          <path d="M150 170 q50 -40 100 0Z" fill="#3a2210" />
          <rect x="90" y="200" width="40" height="50" fill="#3a2210" opacity="0.8" />
          <rect x="270" y="200" width="40" height="50" fill="#3a2210" opacity="0.8" />
        </g>
      );
    case 'lakePalace':
      return (
        <g opacity="0.92">
          <path d="M0 250 Q200 236 400 250 L400 300 L0 300 Z" fill="#0b2038" />
          <rect x="140" y="170" width="120" height="70" fill="#15264a" />
          <path d="M140 170 L200 130 L260 170 Z" fill="#15264a" />
          <circle cx="200" cy="122" r="6" fill="#15264a" />
          <rect x="170" y="190" width="14" height="45" fill="#0b1730" />
          <rect x="216" y="190" width="14" height="45" fill="#0b1730" />
        </g>
      );
    case 'cityLakes':
      return (
        <g opacity="0.92">
          <path d="M0 250 Q200 240 400 250 L400 300 L0 300 Z" fill="#0e1a30" />
          {[40, 100, 160, 220, 280, 330].map((x, i) => (
            <rect key={i} x={x} y={190 - (i % 3) * 22} width="30" height={60 + (i % 3) * 22} fill="#132445" />
          ))}
        </g>
      );
    case 'handicraft':
    default:
      return (
        <g opacity="0.9">
          <path d="M-20 240 L100 130 L200 220 L300 140 L420 240 Z" fill="#241505" opacity="0.75" />
          <rect x="0" y="250" width="400" height="50" fill="#1c1005" />
        </g>
      );
  }
}
