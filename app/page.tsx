'use client';

import React, { useState, useEffect } from 'react';
import { IndustrialHeader } from '@/components/IndustrialHeader';
import { BoilerHero } from '@/components/BoilerHero';
import { CommandsPanel, CommandItem } from '@/components/CommandsPanel';
import { CapsulesPanel } from '@/components/CapsulesPanel';
import { SystemDiagnosticsPanel } from '@/components/SystemDiagnosticsPanel';
import { BrassBolt } from '@/components/Gauges';
import { Terminal, Package, Sliders, CheckCircle2, X } from 'lucide-react';

type TabType = 'comandos' | 'capsulas' | 'sistema';

export default function SteampunkTerminalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('comandos');
  const [pressure, setPressure] = useState<number>(18.4);
  const [flowRate, setFlowRate] = useState<number>(88);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>('');
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [boilerId, setBoilerId] = useState<string>('CALDEIRA_02');

  // Telemetry log history
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString('pt-BR')}] KERNEL BOOT: Caldeira Pesada v2.4 inicializada`,
    `[${new Date().toLocaleTimeString('pt-BR')}] SENSORES: Pressão de barramento fixada em 18.4 BAR`,
    `[${new Date().toLocaleTimeString('pt-BR')}] VALVULA_FLUXO: Nominal engajada em 88%`,
  ]);

  // Derived temperature from pressure
  const temperature = Math.round(180 + pressure * 9.2);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('pt-BR');
    setTerminalLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 40)]);
  };

  const showToast = (message: string) => {
    setToastText(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 2000);
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    const preview = text.length > 24 ? text.substring(0, 24) + '...' : text;
    showToast(`BUFFER: ${preview}`);
    addLog(`CLIPBOARD // Copiado: "${preview}"`);
  };

  const handleExecuteCommand = (cmd: CommandItem) => {
    addLog(`EXEC // ${cmd.name}`);
    showToast(`EXECUTANDO: ${cmd.name}`);

    // Dynamic reaction based on command
    if (cmd.name.includes('PURGAR')) {
      triggerSteamPurge();
    } else if (cmd.name.includes('BOOTSTRAP') || cmd.name.includes('NUCLEO')) {
      setPressure((p) => Math.min(29.4, p + 4.2));
      addLog(`SOBREPRESSÃO // Injeção de vapor no núcleo (+4.2 BAR)`);
    } else if (cmd.name.includes('SYNCHRONIZE')) {
      setFlowRate(88);
      setPressure(18.4);
      addLog(`SINCRONIZADO // Valores retornados para o padrão nominal`);
    } else {
      setPressure((p) => Math.min(28, p + 1.2));
    }
  };

  const triggerSteamPurge = () => {
    setIsPurging(true);
    addLog(`VAPOR // Válvula de escape de sobrepressão aberta`);
    showToast(`VAPOR EXPURGADO (-4.5 BAR)`);
    setPressure((prev) => Math.max(3.0, prev - 4.5));

    setTimeout(() => {
      setIsPurging(false);
      addLog(`VAPOR // Válvula de alívio restabelecida`);
    }, 1200);
  };

  // Subtle natural pressure variation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPressure((current) => {
        const delta = (Math.random() - 0.5) * 0.2;
        return parseFloat(Math.max(1.0, Math.min(29.8, current + delta)).toFixed(1));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0a09] text-[#e7e1df] flex flex-col items-center pb-24 overflow-x-hidden relative selection:bg-[#ff8c00] selection:text-black">
      {/* Decorative vertical industrial copper pipes on sides (desktop/wide screens) */}
      <div className="fixed left-0 top-0 bottom-0 w-3 copper-pipe-vert z-20 hidden md:block border-r border-[#1a0b04]" />
      <div className="fixed right-0 top-0 bottom-0 w-3 copper-pipe-vert z-20 hidden md:block border-l border-[#1a0b04]" />

      {/* TOP APP BAR */}
      <IndustrialHeader
        pressure={pressure}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDiagnostics={() => setActiveTab('sistema')}
      />

      {/* MAIN CHASSIS CONTAINER */}
      <main className="w-full max-w-[420px] px-3 pt-3 flex flex-col gap-3 relative z-10">
        {/* SECTION 1: BOILER HERO BANNER */}
        <BoilerHero
          pressure={pressure}
          onPurgeSteam={triggerSteamPurge}
          isPurging={isPurging}
        />

        {/* SECTION 2: ACTIVE TAB CONTENT */}
        {activeTab === 'comandos' && (
          <CommandsPanel onCopy={handleCopy} onExecute={handleExecuteCommand} />
        )}

        {activeTab === 'capsulas' && (
          <CapsulesPanel onCopy={handleCopy} onToast={showToast} />
        )}

        {activeTab === 'sistema' && (
          <SystemDiagnosticsPanel
            pressure={pressure}
            setPressure={(val) => {
              setPressure(val);
              addLog(`MANUAL // Pressão ajustada para ${val.toFixed(1)} BAR`);
            }}
            flowRate={flowRate}
            setFlowRate={(val) => {
              setFlowRate(val);
              addLog(`MANUAL // Válvula de fluxo regulada para ${val}%`);
            }}
            temperature={temperature}
            onPurgeSteam={triggerSteamPurge}
            isPurging={isPurging}
            terminalLogs={terminalLogs}
            onClearLogs={() => setTerminalLogs([])}
          />
        )}

        {/* STRUCTURAL MECHANICAL STATUS FOOTER UNIT */}
        <div className="w-full bg-[#1b1816] border-2 border-[#453c33] rounded p-2 flex items-center justify-between shadow-[0_6px_16px_rgba(0,0,0,0.9)] relative">
          <div className="flex items-center gap-2">
            <BrassBolt />
            <span className="font-mono text-[9px] text-[#c4b598] font-bold tracking-wider truncate">
              {boilerId}: {pressure > 24 ? 'SOBREPRESSÃO' : 'ESTÁVEL'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                pressure > 24 ? 'bg-[#ff3333]' : 'bg-[#50fa7b]'
              } filament-glow`}
            />
            <span className="font-mono text-[9px] text-[#ffb77d] font-bold">
              FLUXO {flowRate}%
            </span>
            <BrassBolt />
          </div>
        </div>
      </main>

      {/* BOTTOM NAVIGATION DOCK */}
      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-[420px] mx-auto z-50 flex justify-around items-center px-3 py-2 bg-gradient-to-t from-[#0e0c0b] via-[#1a1714] to-[#24201c] border-t-2 border-[#4a4036] shadow-[0_-8px_20px_rgba(0,0,0,0.95)]">
        {/* TAB 1: COMANDOS */}
        <button
          type="button"
          onClick={() => setActiveTab('comandos')}
          className={`flex flex-col items-center justify-center p-1.5 rounded min-w-[92px] transition-all cursor-pointer ${
            activeTab === 'comandos'
              ? 'bg-gradient-to-b from-[#3a2815] to-[#1f1508] text-[#ffaa22] border border-[#ffaa22] shadow-[0_0_14px_rgba(255,140,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]'
              : 'text-[#a48c7a] hover:text-[#ffb77d] hover:bg-[#2c2824]'
          }`}
        >
          <Terminal className="w-5 h-5" />
          <span className="font-mono text-[9px] font-black uppercase mt-0.5 tracking-wider">
            COMANDOS
          </span>
        </button>

        {/* TAB 2: CÁPSULAS */}
        <button
          type="button"
          onClick={() => setActiveTab('capsulas')}
          className={`flex flex-col items-center justify-center p-1.5 rounded min-w-[92px] transition-all cursor-pointer ${
            activeTab === 'capsulas'
              ? 'bg-gradient-to-b from-[#3a2815] to-[#1f1508] text-[#ffaa22] border border-[#ffaa22] shadow-[0_0_14px_rgba(255,140,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]'
              : 'text-[#a48c7a] hover:text-[#ffb77d] hover:bg-[#2c2824]'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="font-mono text-[9px] font-bold uppercase mt-0.5 tracking-wider">
            CÁPSULAS
          </span>
        </button>

        {/* TAB 3: SISTEMA */}
        <button
          type="button"
          onClick={() => setActiveTab('sistema')}
          className={`flex flex-col items-center justify-center p-1.5 rounded min-w-[92px] transition-all cursor-pointer ${
            activeTab === 'sistema'
              ? 'bg-gradient-to-b from-[#3a2815] to-[#1f1508] text-[#ffaa22] border border-[#ffaa22] shadow-[0_0_14px_rgba(255,140,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]'
              : 'text-[#a48c7a] hover:text-[#ffb77d] hover:bg-[#2c2824]'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="font-mono text-[9px] font-bold uppercase mt-0.5 tracking-wider">
            SISTEMA
          </span>
        </button>
      </nav>

      {/* INTERACTION TOAST / NOTIFICATION */}
      <div
        className={`fixed top-14 left-1/2 -translate-x-1/2 bg-[#0e0c0a] border-2 border-[#ff8c00] text-[#ffaa22] px-3.5 py-1.5 rounded shadow-[0_0_20px_rgba(255,140,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.2)] font-mono text-[9.5px] font-black transition-opacity duration-300 pointer-events-none z-50 flex items-center gap-2 uppercase tracking-wide max-w-[90vw] truncate ${
          isToastVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 text-[#50fa7b] shrink-0" />
        <span className="truncate">{toastText}</span>
      </div>

      {/* SETTINGS / PARAMETERS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-[360px] chassis-box rounded-lg border-2 border-[#544c41] p-4 flex flex-col gap-3 relative shadow-[0_12px_32px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between border-b border-[#453c33] pb-2">
              <span className="font-headline text-[13px] font-bold text-[#e8dec8] uppercase tracking-wider">
                PARÂMETROS DA UNIDADE
              </span>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-[#a48c7a] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 font-mono text-[10px]">
              <label className="text-[#d4a359] font-bold">
                IDENTIFICADOR DA CALDEIRA:
              </label>
              <input
                type="text"
                value={boilerId}
                onChange={(e) => setBoilerId(e.target.value)}
                className="w-full h-8 bg-[#0a0807] border border-[#473e35] rounded px-2 text-[#ffaa22] focus:border-[#ff8c00] focus:outline-none"
              />

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#3b342b]">
                <span className="text-[#c4b598]">Status do Manômetro:</span>
                <span className="text-[#50fa7b] font-bold">CALIBRADO</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#c4b598]">Segurança Térmica:</span>
                <span className="text-[#ffaa22] font-bold">INTERTRAVADA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#c4b598]">Versão do Firmware:</span>
                <span className="text-[#e8dec8]">REV_2.4-STP</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="mt-2 h-8 incandescent-cta text-black font-bold font-mono text-[10px] rounded flex items-center justify-center uppercase cursor-pointer"
            >
              CONFIRMAR DIRETRIZES
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
