'use client';

import React, { useState } from 'react';
import { BrassBolt, IronRivet, BrassGear } from './Gauges';
import { Plus, Play, Check } from 'lucide-react';

export interface CommandItem {
  id: string;
  name: string;
  desc: string;
  payload?: string;
}

const DEFAULT_COMMANDS: CommandItem[] = [
  {
    id: 'cmd-1',
    name: 'EXEC // CARREGAR_DIRETRIZ',
    desc: 'Inicia varredura e compilação de rotinas',
    payload: 'EXEC --target=boiler_core --mode=deep_scan --strict',
  },
  {
    id: 'cmd-2',
    name: 'DISPATCH // PURGAR_DADOS',
    desc: 'Limpeza de memória temporária do motor',
    payload: 'DISPATCH --flush-buffer --purge-telemetry --level=0',
  },
  {
    id: 'cmd-3',
    name: 'SYNCHRONIZE // VALVULA_FLUXO',
    desc: 'Calibração e balanceamento de carga',
    payload: 'SYNCHRONIZE --valve=primary_flue --flow-rate=88% --sync-clock',
  },
  {
    id: 'cmd-4',
    name: 'BOOTSTRAP // NUCLEO_ATOMICO',
    desc: 'Inicialização de protocolos de sobrepressão',
    payload: 'BOOTSTRAP --core=atomic_v8 --pressure-target=24.0 --engage',
  },
];

interface CommandsPanelProps {
  onCopy: (text: string) => void;
  onExecute: (cmd: CommandItem) => void;
}

export function CommandsPanel({ onCopy, onExecute }: CommandsPanelProps) {
  const [commands, setCommands] = useState<CommandItem[]>(DEFAULT_COMMANDS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCmdName, setNewCmdName] = useState('');
  const [newCmdDesc, setNewCmdDesc] = useState('');

  const handleCopy = (cmd: CommandItem) => {
    onCopy(cmd.name);
    setCopiedId(cmd.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  const handleExecute = (cmd: CommandItem) => {
    setExecutingId(cmd.id);
    onExecute(cmd);
    setTimeout(() => {
      setExecutingId(null);
    }, 800);
  };

  const handleAddCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCmdName.trim()) return;

    const newCmd: CommandItem = {
      id: `cmd-${Date.now()}`,
      name: newCmdName.toUpperCase().trim(),
      desc: newCmdDesc.trim() || 'Diretriz customizada de operador',
      payload: `CUSTOM --name="${newCmdName}" --timestamp=${Date.now()}`,
    };

    setCommands([newCmd, ...commands]);
    setNewCmdName('');
    setNewCmdDesc('');
    setIsAdding(false);
  };

  return (
    <section className="relative chassis-box rounded-lg overflow-hidden border-2 border-[#473f37]">
      {/* 4 Heavy Machined Brass Screws at Corners */}
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
          <BrassGear size={20} />
          <span className="font-headline text-[12px] font-extrabold text-[#e8dec8] tracking-wider uppercase drop-shadow-sm">
            PAINEL DE OPERAÇÕES // COMANDOS
          </span>
        </div>
        <div className="flex items-center gap-2 pr-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-[9px] font-mono font-bold text-[#ffb77d] hover:text-white bg-[#1a1715] hover:bg-[#332c25] border border-[#594b3d] px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
            title="Adicionar Diretriz"
            type="button"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>NOVA</span>
          </button>
          <span className="w-2 h-2 rounded-full bg-[#ffaa22] filament-glow" />
          <span className="text-[9px] font-mono text-[#ffb77d] font-bold drop-shadow-[0_0_6px_rgba(255,183,125,0.7)]">
            ONLINE
          </span>
        </div>
      </div>

      {/* Copper Conduit Separator */}
      <div className="h-1 copper-pipe-3d w-full" />

      {/* Add Command Accordion */}
      {isAdding && (
        <form
          onSubmit={handleAddCommand}
          className="p-3 bg-[#110e0c] border-b border-[#473e35] flex flex-col gap-2"
        >
          <div className="text-[10px] font-mono text-[#ffaa22] font-bold">
            + INSERIR NOVA DIRETRIZ INDUSTRIAL
          </div>
          <input
            type="text"
            placeholder="NOME (ex: CALIBRAR // VALVULA_SECUNDARIA)"
            value={newCmdName}
            onChange={(e) => setNewCmdName(e.target.value)}
            className="w-full h-8 bg-[#0a0807] border border-[#473e35] rounded px-2.5 text-[11px] font-mono text-[#ffb77d] placeholder:text-[#665a4e] focus:border-[#ff8c00] focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="DESCRIÇÃO (ex: Alívio secundário dos trocadores de calor)"
            value={newCmdDesc}
            onChange={(e) => setNewCmdDesc(e.target.value)}
            className="w-full h-8 bg-[#0a0807] border border-[#473e35] rounded px-2.5 text-[11px] font-mono text-[#e8dec8] placeholder:text-[#665a4e] focus:border-[#ff8c00] focus:outline-none"
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[10px] font-mono px-3 py-1 rounded bg-[#201d1a] text-[#a48c7a] hover:text-white border border-[#3b342b] cursor-pointer"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="text-[10px] font-mono px-3 py-1 rounded bg-[#ff8c00] text-black font-bold hover:bg-[#ffaa22] shadow-[0_0_10px_rgba(255,140,0,0.5)] cursor-pointer"
            >
              CADASTRAR
            </button>
          </div>
        </form>
      )}

      {/* Command List Stack */}
      <div className="p-2 flex flex-col gap-2">
        {commands.map((cmd) => {
          const isCopied = copiedId === cmd.id;
          const isExec = executingId === cmd.id;

          return (
            <div
              key={cmd.id}
              className="plate-riveted-cartridge border-2 border-[#4a4036] rounded p-2 flex items-center justify-between shadow-[inset_0_2px_6px_rgba(0,0,0,0.95),0_3px_6px_rgba(0,0,0,0.7)] group hover:border-[#ffaa22]/80 transition-colors relative overflow-hidden"
            >
              {/* Side Rivet Accents */}
              <div className="absolute left-1 top-2.5">
                <IronRivet />
              </div>
              <div className="absolute left-1 bottom-2.5">
                <IronRivet />
              </div>

              <div className="flex flex-col justify-center max-w-[200px] pl-3">
                <span className="font-headline text-[11.5px] font-bold text-[#e8dec8] group-hover:text-[#ffaa22] transition-colors flex items-center gap-1.5 truncate">
                  <span className="text-[#ff8c00] text-[11px] filament-glow shrink-0">
                    ❯
                  </span>
                  <span className="truncate">{cmd.name}</span>
                </span>
                <span className="font-mono text-[9px] text-[#a48c7a] leading-tight truncate">
                  {cmd.desc}
                </span>
              </div>

              {/* Action Buttons: Copiar & Executar */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleExecute(cmd)}
                  className={`w-7 h-[32px] rounded machined-btn flex items-center justify-center transition-all cursor-pointer ${
                    isExec
                      ? 'bg-[#50fa7b]/20 text-[#50fa7b] border-[#50fa7b]'
                      : 'text-[#ffb77d] hover:text-white'
                  }`}
                  title="Executar no terminal"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isExec ? 'scale-125' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(cmd)}
                  className="w-[62px] h-[32px] rounded machined-btn flex items-center justify-center text-[#ffb77d] hover:text-white font-mono text-[9.5px] font-extrabold uppercase tracking-wider group-hover:border-[#ffaa22] active:translate-y-1 transition-all cursor-pointer"
                >
                  {isCopied ? (
                    <span className="text-[9px] text-[#50fa7b] font-extrabold flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> OK!
                    </span>
                  ) : (
                    'COPIAR'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Faixa Zebrada de Perigo */}
      <div className="w-full hazard-stripe-bar border-t border-black" />
    </section>
  );
}
