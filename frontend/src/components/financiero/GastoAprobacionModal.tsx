import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Building2,
  Calendar,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { Gasto, AprobarGastoInput } from '../../types/financiero.types';

interface GastoAprobacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasto: Gasto | null;
  onAprobar: (id: string | number, data: AprobarGastoInput) => Promise<void>;
}

export const GastoAprobacionModal: React.FC<GastoAprobacionModalProps> = ({
  isOpen,
  onClose,
  gasto,
  onAprobar,
}) => {
  if (!isOpen || !gasto) return null;

  const [accion, setAccion] = useState<'APROBAR' | 'RECHAZAR'>('APROBAR');
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleConfirmar = async () => {
    setIsSubmitting(true);
    try {
      await onAprobar(gasto.id, {
        accion,
        observaciones: observaciones.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-indigo-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Dictamen de Auditoría y Aprobación de Gasto
              </h2>
              <p className="text-xs text-indigo-200">
                Verificación de factura, concepto y orden de pago
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Tarjeta de Resumen del Gasto */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                  Factura N° {gasto.numeroFactura}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                  {gasto.concepto}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-rose-700">
                  {formatCOP(Number(gasto.monto))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Monto Solicitado
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/70 text-xs">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate text-slate-700 font-medium">
                  Proveedor: {gasto.proveedor}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 font-medium">
                  Fecha: {new Date(gasto.fecha).toLocaleDateString('es-CO')}
                </span>
              </div>
            </div>

            {/* Soporte Digital */}
            {gasto.soporte && (
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Soporte / Factura Digital:
                </span>
                <a
                  href={gasto.soporte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-700 text-xs font-bold hover:bg-indigo-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir Comprobante Digital
                </a>
              </div>
            )}
          </div>

          {/* Selector de Decisión */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Decisión del Auditor / Ordenador del Gasto *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccion('APROBAR')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-extrabold transition-all ${
                  accion === 'APROBAR'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Aprobar Gasto (Desembolso Válido)
              </button>

              <button
                type="button"
                onClick={() => setAccion('RECHAZAR')}
                className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-xs font-extrabold transition-all ${
                  accion === 'RECHAZAR'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                Rechazar / Devolver con Reparos
              </button>
            </div>
          </div>

          {/* Observaciones del Dictamen */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              Observaciones / Justificación del Dictamen
            </label>
            <textarea
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Escriba las consideraciones técnicas, validación de RUT/NIT, entrega a satisfacción o razones del rechazo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-semibold shadow-md disabled:opacity-50 transition-colors ${
              accion === 'APROBAR'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : accion === 'APROBAR' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {accion === 'APROBAR' ? 'Confirmar Aprobación de Gasto' : 'Confirmar Rechazo de Gasto'}
          </button>
        </div>
      </div>
    </div>
  );
};
