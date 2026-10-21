'use client';

import React from 'react';

export function BrassBolt({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#fff1b8] via-[#d4a359] to-[#3d2705] shadow-[0_2px_4px_rgba(0,0,0,0.9),inset_0_1px_1.5px_rgba(255,255,255,0.7)] border-[0.5px] border-[#4a3407] relative shrink-0 ${className}`}
    >
      <div className="absolute top-1/2 left-[20%] right-[20%] h-[1.5px] bg-[#2b1c03] -translate-y-1/2 rotate-35 shadow-[0_0.5px_0.5px_rgba(255,255,255,0.2)]" />
    </div>
  );
}

export function IronRivet({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-2 h-2 rounded-full bg-gradient-to-br from-[#8e867d] via-[#46413a] to-[#0b0a09] shadow-[0_1px_2px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.35)] border-[0.5px] border-[#23201d] shrink-0 ${className}`}
    />
  );
}

export function BrassGear({ size = 28, spinning = false }: { size?: number; spinning?: boolean }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.9)] border border-[#7d5e23] ${
        spinning ? 'animate-spin' : ''
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.8))' }}
      >
        <defs>
          <radialGradient id="gearMetal" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffea9f" />
            <stop offset="35%" stopColor="#d4a359" />
            <stop offset="70%" stopColor="#7d5718" />
            <stop offset="100%" stopColor="#301f05" />
          </radialGradient>
          <radialGradient id="hubMetal" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e8dec8" />
            <stop offset="50%" stopColor="#63471a" />
            <stop offset="100%" stopColor="#1a1205" />
          </radialGradient>
        </defs>
        {/* Gear Teeth (12 cogs) */}
        <g fill="url(#gearMetal)" stroke="#3d2705" strokeWidth="1.5">
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x="44"
              y="2"
              width="12"
              height="18"
              rx="2"
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="40" />
        </g>
        {/* Inner Cutouts */}
        <circle cx="50" cy="50" r="28" fill="#151312" stroke="#4a3407" strokeWidth="2" />
        {[...Array(4)].map((_, i) => (
          <circle
            key={i}
            cx={50 + 17 * Math.cos((i * Math.PI) / 2)}
            cy={50 + 17 * Math.sin((i * Math.PI) / 2)}
            r="6"
            fill="url(#gearMetal)"
            stroke="#261904"
            strokeWidth="1"
          />
        ))}
        {/* Center Shaft Hub */}
        <circle cx="50" cy="50" r="14" fill="url(#hubMetal)" stroke="#ffdcc3" strokeWidth="1" />
        <circle cx="50" cy="50" r="5" fill="#0b0a09" />
      </svg>
    </div>
  );
}

export function AnalogGauge({
  value = 18.4,
  min = 0,
  max = 30,
  unit = 'BAR',
  size = 64,
  label = 'PRESSÃO',
}: {
  value?: number;
  min?: number;
  max?: number;
  unit?: string;
  size?: number;
  label?: string;
}) {
  const clamped = Math.min(Math.max(value, min), max);
  const ratio = (clamped - min) / (max - min);
  // -130deg to +130deg span
  const angle = -130 + ratio * 260;

  return (
    <div
      style={{ width: size, height: size }}
      className="relative shrink-0 rounded-full border-2 border-[#5e4200] shadow-[0_4px_10px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.2)] bg-[#141210] flex items-center justify-center overflow-hidden"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="dialFace" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#faf5e8" />
            <stop offset="70%" stopColor="#e8dec8" />
            <stop offset="90%" stopColor="#c7b99c" />
            <stop offset="100%" stopColor="#7a6c52" />
          </radialGradient>
          <linearGradient id="brassBezel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd77a" />
            <stop offset="50%" stopColor="#a37626" />
            <stop offset="100%" stopColor="#47310a" />
          </linearGradient>
        </defs>

        {/* Outer Brass Ring */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="url(#brassBezel)" strokeWidth="3" />
        {/* Dial Face */}
        <circle cx="50" cy="50" r="45" fill="url(#dialFace)" />

        {/* Danger Arc (> 24 bar) */}
        <path
          d="M 50 10 A 40 40 0 0 1 85 50"
          fill="none"
          stroke="#d62828"
          strokeWidth="4"
          strokeDasharray="2 3"
        />

        {/* Dial Ticks */}
        {[...Array(11)].map((_, i) => {
          const a = -130 + (i / 10) * 260;
          const rad = (a * Math.PI) / 180;
          const x1 = 50 + 36 * Math.sin(rad);
          const y1 = 50 - 36 * Math.cos(rad);
          const x2 = 50 + 42 * Math.sin(rad);
          const y2 = 50 - 42 * Math.cos(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#2e271c"
              strokeWidth={i % 2 === 0 ? '2' : '1'}
            />
          );
        })}

        {/* Label & Unit text */}
        <text
          x="50"
          y="35"
          textAnchor="middle"
          fontSize="7"
          fontFamily="Space Grotesk, sans-serif"
          fontWeight="bold"
          fill="#543a00"
          letterSpacing="0.5"
        >
          {label}
        </text>
        <text
          x="50"
          y="68"
          textAnchor="middle"
          fontSize="8"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="bold"
          fill="#8f2000"
        >
          {clamped.toFixed(1)} {unit}
        </text>

        {/* Needle */}
        <g transform={`rotate(${angle} 50 50)`}>
          <line x1="50" y1="50" x2="50" y2="14" stroke="#d62828" strokeWidth="2" strokeLinecap="round" />
          <polygon points="50,11 48,18 52,18" fill="#d62828" />
          <circle cx="50" cy="50" r="5" fill="#24190e" stroke="#ffd77a" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}
