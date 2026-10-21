'use client';

import React, { useState, useMemo } from 'react';
import { BrassBolt } from './Gauges';
import {
  FileText,
  Save,
  Download,
  Upload,
  Zap,
  Check,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';

export interface CapsuleRecord {
  id: string;
  name: string;
  json: string;
  createdAt: string;
}

const DEFAULT_CAPSULES: CapsuleRecord[] = [
  {
    id: 'cap-1',
    name: 'Capsula_Alfa_Vapor_01.json',
    json: JSON.stringify(
      {
        capsula_id: 'ST-900',
        valvula: 'aberta_70',
        fluxo: 'hiper_nominal',
        pressao_limite: 22.5,
        temperatura_alvo: 380,
      },
      null,
      2
    ),
    createdAt: '2026-10-18T10:00:00Z',
  },
  {
    id: 'cap-2',
    name: 'Protocolo_Pressao_V8.json',
    json: JSON.stringify(
      {
        protocolo: 'V8_EMERGENCIA',
        bloqueio_valvula: false,
        alivio_automatico_bar: 26.0,
        sensores: ['tubo_norte', 'caldeira_02', 'trocador_sec'],
      },
      null,
      2
    ),
    createdAt: '2026-10-18T11:15:00Z',
  },
];

interface CapsulesPanelProps {
  onCopy: (text: string) => void;
  onToast: (msg: string) => void;
}

export function CapsulesPanel({ onCopy, onToast }: CapsulesPanelProps) {
  const [capsules, setCapsules] = useState<CapsuleRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sublai_steampunk_capsules');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return DEFAULT_CAPSULES;
  });

  const [projectName, setProjectName] = useState('Matriz_Controle_Tubulacao_09');
  const [jsonBuffer, setJsonBuffer] = useState(
    '{\n  "capsula_id": "ST-900",\n  "valvula": "aberta_70",\n  "fluxo": "hiper_nominal"\n}'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Derive json validation directly via useMemo without cascading setState
  const jsonError = useMemo(() => {
    if (!jsonBuffer.trim()) {
      return 'Buffer vazio';
    }
    try {
      JSON.parse(jsonBuffer);
      return null;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return err.message.replace(/^JSON\.parse: /, '');
      }
      return 'Sintaxe JSON inválida';
    }
  }, [jsonBuffer]);

  // Save to localStorage helper
  const saveToStorage = (updated: CapsuleRecord[]) => {
    setCapsules(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sublai_steampunk_capsules', JSON.stringify(updated));
      } catch {
        // storage overflow
      }
    }
  };

  const handleSaveCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (jsonError) {
      onToast('ERRO: CORRIJA A SINTAXE JSON ANTES DE SALVAR');
      return;
    }

    const cleanName = projectName.trim() || `Capsula_${Date.now()}`;
    const filename = cleanName.endsWith('.json') ? cleanName : `${cleanName}.json`;

    // Formata o JSON antes de armazenar
    let formattedJson = jsonBuffer;
    try {
      formattedJson = JSON.stringify(JSON.parse(jsonBuffer), null, 2);
    } catch {
      // fallback
    }

    const newRecord: CapsuleRecord = {
      id: `cap-${Date.now()}`,
      name: filename,
      json: formattedJson,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...capsules];
    saveToStorage(updated);
    onToast(`CÁPSULA [${filename}] REGISTRADA COM SUCESSO`);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = capsules.filter((c) => c.id !== id);
    saveToStorage(updated);
    onToast(`CÁPSULA [${name}] EXPURGADA`);
  };

  const handleCopyCapsule = (cap: CapsuleRecord) => {
    onCopy(cap.json);
    setCopiedId(cap.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  const handleLoadCapsule = (cap: CapsuleRecord) => {
    setProjectName(cap.name.replace(/\.json$/, ''));
    setJsonBuffer(cap.json);
    onToast(`CÁPSULA [${cap.name}] CARREGADA NO BUFFER`);
  };

  const applyTemplate = (type: 'nominal' | 'alta_pressao' | 'purga') => {
    if (type === 'nominal') {
      setProjectName('Diretriz_Caldeira_Nominal');
      setJsonBuffer(
        JSON.stringify(
          {
            modo: 'CALDEIRA_NOMINAL',
            pressao_bar: 18.4,
            temperatura_c: 240,
            valvula_principal: 65,
            resfriamento: 'ATIVO',
          },
          null,
          2
        )
      );
    } else if (type === 'alta_pressao') {
      setProjectName('Protocolo_Sobrepressao_Atomo');
      setJsonBuffer(
        JSON.stringify(
          {
            modo: 'SOBREPRESSAO_CRITICA',
            pressao_bar: 27.8,
            aviso_alarme: true,
            acionamento_turbina: 94,
            bloqueio_seguranca: 'MANUAL',
          },
          null,
          2
        )
      );
    } else {
      setProjectName('Sequencia_Expurgo_Geral');
      setJsonBuffer(
        JSON.stringify(
          {
            modo: 'PURGA_TOTAL_VAPOR',
            valvula_alivio: 100,
            pressao_desejada: 0.0,
            corta_fogo: true,
          },
          null,
          2
        )
      );
    }
  };

  // Export all capsules as JSON file
  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(capsules, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `banco_capsulas_steampunk_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('ARQUIVO DE CÁPSULAS EXPORTADO');
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          saveToStorage([...parsed, ...capsules]);
          onToast(`${parsed.length} CÁPSULAS IMPORTADAS`);
        } else {
          // single capsule
          const newRec: CapsuleRecord = {
            id: `cap-${Date.now()}`,
            name: file.name,
            json: JSON.stringify(parsed, null, 2),
            createdAt: new Date().toISOString(),
          };
          saveToStorage([newRec, ...capsules]);
          onToast(`CÁPSULA [${file.name}] IMPORTADA`);
        }
      } catch {
        onToast('ERRO AO IMPORTAR ARQUIVO JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
          <span className="w-2.5 h-2.5 rounded-full amber-pilot-lamp shrink-0" />
          <span className="font-headline text-[12px] font-extrabold text-[#e8dec8] tracking-wider uppercase drop-shadow-sm">
            CÁPSULAS ARMAZENADAS // BANCO
          </span>
        </div>
        <div className="flex items-center gap-2 pr-2">
          <span className="text-[9px] font-mono font-bold text-[#50fa7b] tracking-tighter drop-shadow-[0_0_6px_rgba(80,250,123,0.5)]">
            [REG: {capsules.length.toString().padStart(2, '0')}]
          </span>
        </div>
      </div>

      {/* Copper Conduit Separator */}
      <div className="h-1 copper-pipe-3d w-full" />

      {/* Injection Form & List Container */}
      <form onSubmit={handleSaveCapsule} className="p-2.5 flex flex-col gap-3">
        {/* Input 1: Nome do Projeto */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-1">
            <label className="font-mono text-[9px] text-[#d4a359] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full amber-pilot-lamp" />
              <span>NOME DO PROJETO // DIRETÓRIO</span>
            </label>
            <span className="text-[#8c7b6c] text-[8.5px] font-mono">
              SLOT_{capsules.length + 1}
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="ex: Sequencia_Caldeira_Norte_v1"
              className="w-full h-[38px] bg-[#0c0b0a] border-2 border-[#473e35] focus:border-[#ff8c00] focus:ring-1 focus:ring-[#ff8c00] rounded px-3 font-mono text-[11px] text-[#ffaa22] placeholder:text-[#6e6357] shadow-[inset_0_3px_6px_#000000,0_1px_0_rgba(255,255,255,0.06)]"
              required
            />
            <div className="absolute right-2.5 top-3.5">
              <BrassBolt />
            </div>
          </div>
        </div>

        {/* Input 2: JSON Textarea Display de Vidro Escurecido */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-1">
            <label className="font-mono text-[9px] text-[#d4a359] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  jsonError ? 'bg-[#ff5555]' : 'bg-[#50fa7b] filament-glow'
                }`}
              />
              <span>COLAR JSON DA CÁPSULA // RAW BUFFER</span>
            </label>

            <div className="flex items-center gap-1.5">
              {jsonError ? (
                <span className="text-[#ff5555] text-[8.5px] font-mono flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> SINTAXE INVÁLIDA
                </span>
              ) : (
                <span className="text-[#50fa7b] text-[8.5px] font-mono flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-[#50fa7b] rounded-full animate-ping" />{' '}
                  PRONTO
                </span>
              )}
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 px-0.5">
            <span className="text-[8px] font-mono text-[#8c7b6c] uppercase">PRESETS:</span>
            <button
              type="button"
              onClick={() => applyTemplate('nominal')}
              className="text-[8px] font-mono text-[#ffb77d] hover:text-white bg-[#1f1a16] hover:bg-[#332920] px-1.5 py-0.5 rounded border border-[#4a3b2c] cursor-pointer"
            >
              NOMINAL
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('alta_pressao')}
              className="text-[8px] font-mono text-[#ffaa22] hover:text-white bg-[#1f1a16] hover:bg-[#332920] px-1.5 py-0.5 rounded border border-[#4a3b2c] cursor-pointer"
            >
              SOBREPRESSÃO
            </button>
            <button
              type="button"
              onClick={() => applyTemplate('purga')}
              className="text-[8px] font-mono text-[#50fa7b] hover:text-white bg-[#1f1a16] hover:bg-[#332920] px-1.5 py-0.5 rounded border border-[#4a3b2c] cursor-pointer"
            >
              PURGA
            </button>
          </div>

          {/* Dark Glass Panel */}
          <div className="relative dark-glass-display-panel rounded p-2.5 overflow-hidden">
            {/* Glass Reflection Highlights */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            <textarea
              rows={4}
              value={jsonBuffer}
              onChange={(e) => setJsonBuffer(e.target.value)}
              placeholder='{ "diretriz": "VAPOR_03", "pressao_max": 24.5, "status": "ENGAGED" }'
              className={`w-full bg-transparent border-0 focus:outline-none p-0 font-mono text-[10.5px] leading-tight resize-none drop-shadow-[0_0_5px_rgba(80,250,123,0.4)] relative z-10 ${
                jsonError ? 'text-[#ff7777]' : 'text-[#50fa7b]'
              }`}
            />

            {/* Error banner if malformed */}
            {jsonError && (
              <div className="text-[8.5px] text-[#ff8888] font-mono bg-black/60 p-1 rounded mt-1 border border-[#ff4444]/40">
                {jsonError}
              </div>
            )}

            {/* Terminal Blinking Amber Cursor */}
            <span className="absolute bottom-2 right-3 text-[#ffaa22] text-[11px] animate-pulse font-mono z-10 pointer-events-none">
              █
            </span>
          </div>
        </div>

        {/* Primary Action CTA: + SALVAR CÁPSULA */}
        <button
          type="submit"
          className="w-full h-[40px] incandescent-cta rounded flex items-center justify-center gap-2 font-headline text-[13px] font-black uppercase tracking-widest text-[#fff4e0] cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>+ SALVAR CÁPSULA</span>
          <Save className="w-4 h-4" />
        </button>
      </form>

      {/* Pipe Divider Texture with Center Amber Pilot */}
      <div className="flex items-center gap-2 my-1 px-3">
        <div className="h-1 flex-1 copper-pipe-3d rounded-full" />
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full amber-pilot-lamp" />
          <span className="font-mono text-[9px] text-[#d4a359] uppercase tracking-widest font-extrabold">
            CÁPSULAS ATIVAS ({capsules.length})
          </span>
          <span className="w-1.5 h-1.5 rounded-full amber-pilot-lamp" />
        </div>
        <div className="h-1 flex-1 copper-pipe-3d rounded-full" />
      </div>

      {/* Secondary Import/Export Bar */}
      <div className="flex items-center justify-between px-3 pb-1">
        <label className="text-[8.5px] font-mono text-[#a48c7a] hover:text-[#ffb77d] flex items-center gap-1 cursor-pointer">
          <Upload className="w-3 h-3" />
          <span>IMPORTAR .JSON</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={handleExportAll}
          className="text-[8.5px] font-mono text-[#a48c7a] hover:text-[#ffb77d] flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>EXPORTAR BANCO</span>
        </button>
      </div>

      {/* Saved Items List */}
      <div className="p-2.5 flex flex-col gap-2">
        {capsules.length === 0 ? (
          <div className="text-center py-4 text-[10px] font-mono text-[#8c7b6c] border border-dashed border-[#473e35] rounded">
            NENHUMA CÁPSULA ARMAZENADA NO BANCO
          </div>
        ) : (
          capsules.map((cap) => {
            const isCopied = copiedId === cap.id;

            return (
              <div
                key={cap.id}
                className="plate-riveted-cartridge border-2 border-[#453c33] rounded px-2.5 py-2 flex items-center justify-between shadow-[inset_0_2px_4px_rgba(0,0,0,0.85),0_2px_4px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-center gap-2 max-w-[190px]">
                  <FileText className="w-4 h-4 text-[#ffaa22] filament-glow shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="font-mono text-[10.5px] text-[#e8dec8] font-bold tracking-wide truncate">
                      {cap.name}
                    </span>
                    <span className="text-[8px] font-mono text-[#8c7b6c] truncate">
                      {new Date(cap.createdAt).toLocaleDateString('pt-BR')}
                      {' // '}
                      {cap.json.length} bytes
                    </span>
                  </div>
                </div>

                {/* Triple Action Triggers: LOAD, COP, DEL */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleLoadCapsule(cap)}
                    className="w-[28px] h-[26px] rounded machined-btn flex items-center justify-center text-[#c4b598] hover:text-white font-mono text-[8.5px] font-bold cursor-pointer"
                    title="Carregar no Editor"
                  >
                    <FolderOpen className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyCapsule(cap)}
                    className="w-[32px] h-[26px] rounded machined-btn flex items-center justify-center text-[#ffb77d] hover:text-white font-mono text-[8.5px] font-extrabold cursor-pointer"
                    title="Copiar JSON"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-[#50fa7b]" /> : 'COP'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(cap.id, cap.name)}
                    className="w-[32px] h-[26px] rounded bg-gradient-to-b from-[#3a1a1a] to-[#200e0e] border border-[#7a2222] flex items-center justify-center text-[#ffb4ab] hover:text-white font-mono text-[8.5px] font-extrabold shadow-[0_2px_0_#0d0c0b,inset_0_1px_0_rgba(255,255,255,0.15)] active:translate-y-0.5 cursor-pointer"
                    title="Expurgar Registro"
                  >
                    DEL
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Faixa Zebrada */}
      <div className="w-full hazard-stripe-bar border-t border-black" />
    </section>
  );
}
