import React, { useState } from 'react';
import { X, QrCode, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (data: {
    tipoAyuda: string;
    cantidad: number;
    peso: number;
    origen: string;
    numeroDocumento: string;
  }) => void;
}

const PRESET_QR_CODES = [
  {
    titulo: 'Remisión #RM-2026-081 (Kits de Alimentos - UNGRD)',
    data: {
      tipoAyuda: 'KIT_ALIMENTOS',
      cantidad: 250,
      peso: 3750,
      origen: 'UNGRD - Bodega Nacional Bogotá',
      numeroDocumento: 'RM-2026-081',
    },
  },
  {
    titulo: 'Remisión #RM-2026-094 (Kits de Aseo Familiar - Cruz Roja)',
    data: {
      tipoAyuda: 'KIT_ASEO',
      cantidad: 180,
      peso: 1440,
      origen: 'Cruz Roja Colombiana Seccional Chocó',
      numeroDocumento: 'RM-2026-094',
    },
  },
  {
    titulo: 'Remisión #RM-2026-112 (Agua Potable Bidones 20L - Defensa Civil)',
    data: {
      tipoAyuda: 'AGUA_POTABLE',
      cantidad: 500,
      peso: 10000,
      origen: 'Defensa Civil Colombiana',
      numeroDocumento: 'RM-2026-112',
    },
  },
  {
    titulo: 'Remisión #RM-2026-140 (Frazadas y Colchonetas - Gobernación)',
    data: {
      tipoAyuda: 'FRAZADAS_COLCHONETAS',
      cantidad: 300,
      peso: 1200,
      origen: 'Gobernación del Chocó - Gestión del Riesgo',
      numeroDocumento: 'RM-2026-140',
    },
  },
];

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult,
}) => {
  const [scanning, setScanning] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = (item: (typeof PRESET_QR_CODES)[0]) => {
    setScanning(true);
    setActiveCode(item.data.numeroDocumento);
    setTimeout(() => {
      setScanning(false);
      onScanResult(item.data);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Lector de Códigos QR / Remisiones</h3>
              <p className="text-xs text-slate-400">Carga rápida automatizada de manifiestos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Animación del Escáner */}
          <div className="relative h-44 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center text-center p-4">
            <div className="w-28 h-28 border-2 border-dashed border-emerald-500/60 rounded-xl relative flex items-center justify-center">
              <QrCode className="w-16 h-16 text-emerald-400/40" />
              {scanning && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce shadow-lg shadow-emerald-400" />
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              {scanning ? 'Decodificando manifiesto digital...' : 'Apunta el lector o selecciona una remisión'}
            </p>
          </div>

          {/* Remisiones / Manifiestos Digitales de Prueba */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Manifiestos precargados para demostración:
              </span>
            </div>

            <div className="space-y-2">
              {PRESET_QR_CODES.map((preset) => (
                <button
                  key={preset.data.numeroDocumento}
                  onClick={() => handleSimulateScan(preset)}
                  disabled={scanning}
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 text-left transition-all flex items-center justify-between group disabled:opacity-50"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                      {preset.titulo}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {preset.data.cantidad} Unidades • {preset.data.peso} Kg
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-400 text-slate-400 group-hover:text-emerald-600 transition-colors">
                    {scanning && activeCode === preset.data.numeroDocumento ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
