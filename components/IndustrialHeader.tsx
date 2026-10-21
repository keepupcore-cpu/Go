'use client';

import React from 'react';
import { Sliders, Gauge } from 'lucide-react';
import { BrassGear, AnalogGauge } from './Gauges';

interface IndustrialHeaderProps {
  onOpenSettings?: () => void;
  onOpenDiagnostics?: () => void;
  pressure: number;
}

export function IndustrialHeader({
  onOpenSettings,
  onOpenDiagnostics,
  pressure,
}: IndustrialHeaderProps) {
  return (
    <header className="w-full bg-[#181614] border-b-2 border-[#3d3731] shadow-[0_8px_24px_rgba(0,0,0,0.95)] z-40 sticky top-0 relative">
      {/* Amber filament under-strip along app bar bottom edge */}
      <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff8c00] to-transparent opacity-80 filament-glow" />

      <div className="flex justify-between items-center w-full max-w-[420px] mx-auto px-3 py-2 relative">
        {/* Leading Action: Settings + Mini Analog Gauge */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded machined-btn flex items-center justify-center text-[#c4b598] hover:text-[#ffb77d] active:translate-y-0.5 transition-transform cursor-pointer"
            title="Parâmetros Operacionais"
            type="button"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Mini Analog Gauge */}
          <div title={`Pressão de Entrada: ${pressure.toFixed(1)} BAR`}>
            <AnalogGauge value={pressure} max={30} size={28} label="BAR" />
          </div>
        </div>

        {/* Center Brand Headline Anchor */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa22] filament-glow" />
            <span className="text-2xl font-black tracking-widest text-[#e8dec8] heavy-stamped-text font-headline">
              GO
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa22] filament-glow" />
          </div>
          <div className="flex items-center gap-1 -mt-1">
            <div className="w-3 h-[1px] bg-[#63471a]" />
            <span className="text-[8.5px] font-mono text-[#d4a359] uppercase tracking-[0.2em] font-extrabold">
              CALDEIRA PESADA v2.4
            </span>
            <div className="w-3 h-[1px] bg-[#63471a]" />
          </div>
        </div>

        {/* Trailing Action: Brass Gear + Speed/Diagnostics trigger */}
        <div className="flex items-center gap-1.5">
          <BrassGear size={28} spinning={pressure > 20} />
          <button
            onClick={onOpenDiagnostics}
            className="w-8 h-8 rounded machined-btn flex items-center justify-center text-[#c4b598] hover:text-[#ffb77d] active:translate-y-0.5 transition-transform cursor-pointer"
            title="Diagnóstico & Controle da Caldeira"
            type="button"
          >
            <Gauge className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
