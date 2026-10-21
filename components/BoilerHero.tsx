'use client';

import React, { useState } from 'react';
import { BrassBolt, AnalogGauge } from './Gauges';
import { Wind } from 'lucide-react';

interface BoilerHeroProps {
  pressure: number;
  onPurgeSteam: () => void;
  isPurging: boolean;
}

export function BoilerHero({
  pressure,
  onPurgeSteam,
  isPurging,
}: BoilerHeroProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative chassis-box rounded-lg p-2 overflow-hidden border-2 border-[#544c41]">
      {/* Welded 3D Corner Screws */}
      <div className="absolute top-1.5 left-1.5 z-20">
        <BrassBolt />
      </div>
      <div className="absolute top-1.5 right-1.5 z-20">
        <BrassBolt />
      </div>
      <div className="absolute bottom-1.5 left-1.5 z-20">
        <BrassBolt />
      </div>
      <div className="absolute bottom-1.5 right-1.5 z-20">
        <BrassBolt />
      </div>

      {/* Heavy Caldeira Banner Header with Real Graphic or High-Precision Vector */}
      <div className="relative w-full rounded-md overflow-hidden border border-[#3d3731] shadow-[0_6px_16px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(0,0,0,0.9)] bg-[#0d0b09] flex flex-col items-center justify-center p-2 min-h-[195px]">
        {/* Realistic Steam & Mist Emission Emitters (Steampunk Caldeira Vapor) */}
        <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
          {/* Steam plume 1: Top-Left Valve */}
          <div className={`absolute top-6 left-10 w-28 h-28 rounded-full bg-gradient-to-tr from-white/25 via-amber-100/15 to-transparent ${isPurging ? 'scale-150 opacity-80 duration-300' : 'steam-puff-a'}`} />
          {/* Steam plume 2: Top-Right Manometer Exhaust */}
          <div className={`absolute top-4 right-8 w-32 h-32 rounded-full bg-gradient-to-tl from-white/30 via-slate-200/15 to-transparent ${isPurging ? 'scale-150 opacity-90 duration-300' : 'steam-puff-b'}`} />
          {/* Steam plume 3: Bottom Boiler Flue Exhaust */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-gradient-to-t from-white/20 via-orange-100/10 to-transparent steam-puff-c" />
          {/* General ambient industrial steam mist behind machinery */}
          <div className="absolute inset-x-4 top-10 bottom-6 rounded-full bg-radial from-amber-500/15 via-white/8 to-transparent steam-exhaust-vent" />
        </div>

        {/* Backlighting Incandescent Boiler Core Flame & Filament Glow */}
        <div className="absolute inset-4 rounded-full bg-radial from-[#ff8c00]/35 via-[#ff5500]/15 to-transparent boiler-backlight-glow pointer-events-none z-0" />

        {/* Boiler Graphic: Official image with rich vector fallback */}
        {!imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            alt="GO — Emblema Industrial Steampunk Oficial"
            className="w-full max-h-[175px] object-contain object-center transform hover:scale-[1.02] transition-transform duration-500 drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)] relative z-10"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Wt8PB2E80T05_sH7fOT5GXBREkmJG_yzzxc5oRJpSUbwwIEUSOPwi0h6GghRoqFk_KwXZuOgsKzeJfl5J-UjilnKQqi6EySiMdZS_tLap7pFiexGVWhrHtgsX3NSF3QZE3x57XtcgPgY0kaFksBdGYt9fSjh-xYlNI5R0W0O3QMwJW0vpQMVYp9HbV_Rc5U84KhcuxazYL3r9J4u10cI2wWWxwITdgCTF_v99cxuF79d7SY7BK97oUJ4M"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="relative z-10 w-full h-[160px] flex flex-col items-center justify-center p-4">
            <div className="w-20 h-20 rounded-full border-4 border-[#ffaa22] bg-gradient-to-br from-[#2a1705] via-[#4d2806] to-[#120800] shadow-[0_0_25px_rgba(255,140,0,0.6)] flex items-center justify-center relative">
              <span className="text-3xl font-black text-[#ffea9f] font-headline tracking-widest heavy-stamped-text">
                GO
              </span>
              <div className="absolute -inset-2 border border-[#d4a359]/60 rounded-full border-dashed animate-[spin_40s_linear_infinite]" />
            </div>
            <p className="text-[10px] font-mono font-bold text-[#d4a359] mt-3 tracking-widest uppercase">
              CALDEIRA INDUSTRIAL DE SOBREPRESSÃO
            </p>
          </div>
        )}

        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151312] via-transparent to-black/30 pointer-events-none z-10" />

        {/* Top Badges */}
        <div className="absolute top-2 left-3 flex items-center gap-1.5 bg-[#0e0c0a]/90 backdrop-blur-xs px-2.5 py-1 rounded border border-[#ffaa22]/50 shadow-[0_2px_8px_rgba(0,0,0,0.9)] z-20">
          <span className="w-2 h-2 rounded-full bg-[#ffaa22] filament-glow" />
          <span className="text-[9px] font-mono font-black text-[#ffb77d] tracking-wider uppercase tabular-nums">
            PRESSÃO: {pressure.toFixed(1)} BAR
          </span>
        </div>

        <div className="absolute top-2 right-3 flex items-center gap-1 bg-[#0e0c0a]/90 px-2 py-0.5 rounded border border-[#63471a] z-20">
          <AnalogGauge value={pressure} max={30} size={16} label="" />
          <span className="text-[8.5px] font-mono text-[#d4a359] font-bold">
            CALDEIRA 02
          </span>
        </div>

        {/* Bottom Banner Strip with Interactive Purge Trigger */}
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between px-2.5 py-1 bg-[#000000]/80 rounded border border-[#3b342b] z-20">
          <span className="font-mono text-[8.5px] text-[#d4a359] uppercase tracking-[0.16em] font-extrabold truncate">
            GO INDUSTRIAL // MÓDULO DE PRESSÃO
          </span>

          <button
            onClick={onPurgeSteam}
            className="flex items-center gap-1 text-[8px] font-mono text-[#ffb77d] hover:text-white bg-[#2e1d0e] hover:bg-[#4d2f16] px-2 py-0.5 rounded border border-[#7a481c] transition-colors cursor-pointer shrink-0"
            title="Purgar vapor emergencialmente"
            type="button"
          >
            <Wind className="w-2.5 h-2.5" />
            <span>{isPurging ? 'PURGANDO...' : 'ALÍVIO'}</span>
          </button>
        </div>
      </div>

      {/* Glowing Amber Vacuum Filament Understrip */}
      <div className="mt-2 h-2.5 w-full bg-[#1a0e05] rounded-full border border-[#7a3500] flex items-center justify-around px-3 shadow-[0_0_12px_rgba(255,140,0,0.4)] relative overflow-hidden vacuum-filament-tube">
        <span className="w-8 h-1 bg-[#ffaa22] rounded-full filament-glow" />
        <span className="w-16 h-1 bg-[#ff6b00] rounded-full filament-glow" />
        <span className="w-8 h-1 bg-[#ffaa22] rounded-full filament-glow" />
      </div>
    </section>
  );
}
