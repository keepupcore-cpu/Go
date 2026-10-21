'use client';

import React from 'react';
import { BrassBolt, AnalogGauge } from './Gauges';
import { Flame, Wind, AlertOctagon, RefreshCw, Terminal } from 'lucide-react';

interface SystemDiagnosticsPanelProps {
  pressure: number;
  setPressure: (val: number) => void;
  flowRate: number;
  setFlowRate: (val: number) => void;
  temperature: number;
  onPurgeSteam: () => void;
  isPurging: boolean;
  terminalLogs: string[];
  onClearLogs: () => void;
}

export function SystemDiagnosticsPanel({
  pressure,
  setPressure,
  flowRate,
  setFlowRate,
  temperature,
  onPurgeSteam,
  isPurging,
  terminalLogs,
  onClearLogs,
}: SystemDiagnosticsPanelProps) {
  const isHighPressure = pressure >= 24;

  return (
    <section className="relative chassis-box rounded-lg overflow-hidden border-2 border-[#473f37]">
      {/* 4 Heavy Machined Brass Screws */}
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

      {/* Panel Header Cassette Bar */}
      <div className="h-[38px] bg-gradient-to-r from-[#2c2722] via-[#38332d] to-[#24201c] px-4 flex items-center justify-between border-b-2 border-[#453c33]">
        <div className="flex items-center gap-2 pl-3">
          <Flame className="w-4 h-4 text-[#ff8c00] filament-glow" />
          <span className="font-headline text-[12px] font-extrabold text-[#e8dec8] tracking-wider uppercase drop-shadow-sm">
            CONTROLE DA CALDEIRA // SISTEMA
          </span>
        </div>
        <div className="flex items-center gap-1.5 pr-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isHighPressure ? 'bg-[#ff3333] animate-ping' : 'bg-[#50fa7b] filament-glow'
            }`}
          />
          <span
            className={`text-[9px] font-mono font-bold ${
              isHighPressure ? 'text-[#ff5555]' : 'text-[#50fa7b]'
            }`}
          >
            {isHighPressure ? 'ALERTA SOBREPRESSÃO' : 'ESTÁVEL'}
          </span>
        </div>
      </div>

      {/* Copper Conduit Separator */}
      <div className="h-1 copper-pipe-3d w-full" />

      <div className="p-3 flex flex-col gap-3">
        {/* Dual Analog Gauges display */}
        <div className="grid grid-cols-2 gap-2 bg-[#0c0a09] p-2.5 rounded border border-[#3b342b]">
          <div className="flex flex-col items-center justify-center gap-1">
            <AnalogGauge value={pressure} max={30} size={76} label="PRESSÃO" unit="BAR" />
            <span className="text-[9px] font-mono text-[#d4a359] font-bold">
              LIMITE: 28.0 BAR
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1">
            <AnalogGauge
              value={temperature}
              min={100}
              max={600}
              size={76}
              label="CALOR"
              unit="°C"
            />
            <span className="text-[9px] font-mono text-[#d4a359] font-bold">
              CALOR CALDEIRA
            </span>
          </div>
        </div>

        {/* Regulator 1: Válvula de Pressão (0 a 30 BAR) */}
        <div className="flex flex-col gap-1.5 plate-riveted-cartridge p-2.5 rounded border border-[#4a4036]">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-[#e8dec8] font-bold flex items-center gap-1">
              <span className="text-[#ffaa22]">⚙</span> REGULAGEM DE PRESSÃO
            </span>
            <span className="text-[#ffaa22] font-extrabold tabular-nums">
              {pressure.toFixed(1)} BAR
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="0.2"
            value={pressure}
            onChange={(e) => setPressure(parseFloat(e.target.value))}
            className="w-full accent-[#ff8c00] cursor-pointer"
          />
          <div className="flex justify-between text-[8px] font-mono text-[#8c7b6c]">
            <span>0 BAR (DESLIGADA)</span>
            <span>18 BAR (NOMINAL)</span>
            <span className="text-[#ff5555]">30 BAR (MÁX)</span>
          </div>
        </div>

        {/* Regulator 2: Fluxo da Válvula Principal (0% a 100%) */}
        <div className="flex flex-col gap-1.5 plate-riveted-cartridge p-2.5 rounded border border-[#4a4036]">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-[#e8dec8] font-bold flex items-center gap-1">
              <span className="text-[#50fa7b]">⚡</span> VÁLVULA DE FLUXO NOMINAL
            </span>
            <span className="text-[#50fa7b] font-extrabold tabular-nums">
              {flowRate}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={flowRate}
            onChange={(e) => setFlowRate(parseInt(e.target.value, 10))}
            className="w-full accent-[#50fa7b] cursor-pointer"
          />
          <div className="flex justify-between text-[8px] font-mono text-[#8c7b6c]">
            <span>0% (VEDADA)</span>
            <span>50%</span>
            <span>100% (TOTALMENTE ABERTA)</span>
          </div>
        </div>

        {/* Action Buttons: Purga & Desarme de Emergência */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onPurgeSteam}
            className="h-[36px] machined-btn text-[#ffb77d] hover:text-white rounded flex items-center justify-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{isPurging ? 'PURGANDO...' : 'PURGA MANUAL'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPressure(2.5);
              setFlowRate(10);
            }}
            className="h-[36px] bg-gradient-to-b from-[#4d1616] to-[#260b0b] border border-[#a32929] hover:border-[#ff4444] text-[#ffd6d6] hover:text-white rounded flex items-center justify-center gap-1.5 font-mono text-[9.5px] font-bold uppercase tracking-wider shadow-[0_3px_0_#120404] active:translate-y-0.5 cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-[#ff6666]" />
            <span>DESARME TOTAL</span>
          </button>
        </div>

        {/* Real-time Industrial Serial Log Output */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[9px] font-mono text-[#8c7b6c] px-1">
            <span className="flex items-center gap-1 text-[#d4a359] font-bold">
              <Terminal className="w-3 h-3" /> LOG DE TELEMETRIA
            </span>
            <button
              type="button"
              onClick={onClearLogs}
              className="hover:text-[#ffb77d] flex items-center gap-0.5 cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" /> LIMPAR
            </button>
          </div>

          <div className="h-[90px] dark-glass-display-panel rounded p-2 overflow-y-auto font-mono text-[9px] text-[#50fa7b] flex flex-col gap-1 leading-tight">
            {terminalLogs.length === 0 ? (
              <span className="text-[#50fa7b]/50">
                [SISTEMA EM AGUARDO DE DIRETRIZES OPERACIONAIS...]
              </span>
            ) : (
              terminalLogs.map((log, idx) => (
                <div key={idx} className="truncate">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Faixa zebrada */}
      <div className="w-full hazard-stripe-bar border-t border-black" />
    </section>
  );
}
