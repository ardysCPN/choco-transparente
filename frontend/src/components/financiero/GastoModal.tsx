import React from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  Receipt,
  DollarSign,
  Building2,
  FileText,
  Calendar,
  FileCheck,
  Loader2,
  Link2,
} from 'lucide-react';
import { CrearGastoInput } from '../../types/financiero.types';

interface GastoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearGastoInput) => Promise<void>;
}

interface FormData {
  organizacionId: number;
  concepto: string;
  monto: number;
  proveedor: string;
  numeroFactura: string;
  fecha: string;
  soporte: string;
}

export const GastoModal: React.FC<GastoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      organizacionId: 1,
      concepto: '',
      monto: 2500000,
      proveedor: '',
      numeroFactura: '',
      fecha: new Date().toISOString().split('T')[0],
      soporte: 'https://ejemplo.com/factura_electronica_soporte.pdf',
    },
  });

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      organizacionId: Number(data.organizacionId),
      concepto: data.concepto,
      monto: Number(data.monto),
      proveedor: data.proveedor,
      numeroFactura: data.numeroFactura,
      fecha: data.fecha,
      soporte: data.soporte,
    });
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-rose-950 via-slate-900 to-blue-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-rose-300">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Radicar Gasto / Factura de Ayuda
              </h2>
              <p className="text-xs text-rose-200">
                Registro de egreso auditado para aprobación en Caja Transparente
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

        {/* Formulario */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Concepto del Gasto */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Concepto / Objeto del Gasto *
              </label>
              <input
                type="text"
                placeholder="Ej. Compra de 800 kits de aseo familiar y frazadas para Bojayá"
                {...register('concepto', {
                  required: 'El concepto es obligatorio',
                  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              {errors.concepto && (
                <p className="text-xs text-rose-500 mt-1">{errors.concepto.message}</p>
              )}
            </div>

            {/* Monto del Gasto */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-rose-600" />
                Monto Facturado ($ COP) *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="Ej. 15000000"
                {...register('monto', {
                  required: 'El monto es obligatorio',
                  min: { value: 1, message: 'El monto debe ser mayor a 0' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-semibold text-slate-900"
              />
              {errors.monto && (
                <p className="text-xs text-rose-500 mt-1">{errors.monto.message}</p>
              )}
            </div>

            {/* Fecha de la Factura */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Fecha de Emisión de Factura *
              </label>
              <input
                type="date"
                {...register('fecha', { required: 'La fecha es obligatoria' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
              />
              {errors.fecha && (
                <p className="text-xs text-rose-500 mt-1">{errors.fecha.message}</p>
              )}
            </div>

            {/* Proveedor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Proveedor / Razón Social y NIT *
              </label>
              <input
                type="text"
                placeholder="Ej. Distribuidora Central del Atrato S.A.S."
                {...register('proveedor', { required: 'El proveedor es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              {errors.proveedor && (
                <p className="text-xs text-rose-500 mt-1">{errors.proveedor.message}</p>
              )}
            </div>

            {/* Número de Factura */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-slate-500" />
                Número de Factura Electrónica (DIAN) *
              </label>
              <input
                type="text"
                placeholder="Ej. FE-2026-00458"
                {...register('numeroFactura', { required: 'El número de factura es obligatorio' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-mono"
              />
              {errors.numeroFactura && (
                <p className="text-xs text-rose-500 mt-1">{errors.numeroFactura.message}</p>
              )}
            </div>

            {/* URL del Soporte Digital */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-slate-500" />
                URL del Soporte Digital (Factura PDF / Comprobante de Pago) *
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/factura_electronica.pdf"
                {...register('soporte', {
                  required: 'El soporte es obligatorio para auditoría',
                  pattern: {
                    value: /^(http|https):\/\/[^ "]+$/,
                    message: 'Debe ser una URL válida (http:// o https://)',
                  },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              {errors.soporte && (
                <p className="text-xs text-rose-500 mt-1">{errors.soporte.message}</p>
              )}
              <p className="text-[11px] text-slate-400 mt-1">
                La factura digital quedará vinculada permanentemente al registro para verificación de veedurías y entes de control.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-900/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileCheck className="w-4 h-4" />
              )}
              Radicar Gasto en Borrador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
