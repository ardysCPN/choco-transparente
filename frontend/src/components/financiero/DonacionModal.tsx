import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  DollarSign,
  Package,
  FileText,
  User,
  CreditCard,
  Hash,
  Scale,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import {
  CrearDonacionDineroInput,
  CrearDonacionEspecieInput,
  TipoDonacion,
} from '../../types/financiero.types';
import { Municipio } from '../../types/territorial.types';

interface DonacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDinero: (data: CrearDonacionDineroInput) => Promise<void>;
  onSubmitEspecie: (data: CrearDonacionEspecieInput) => Promise<void>;
  municipios: Municipio[];
}

interface DineroFormData {
  donante: string;
  monto: number;
  cuentaDestino: string;
  referencia: string;
  municipioId?: number;
  descripcion?: string;
}

interface EspecieFormData {
  donante: string;
  tipoAyuda: string;
  cantidad: number;
  peso?: number;
  unidadMedida: string;
  municipioId?: number;
  descripcion?: string;
}

export const DonacionModal: React.FC<DonacionModalProps> = ({
  isOpen,
  onClose,
  onSubmitDinero,
  onSubmitEspecie,
  municipios,
}) => {
  const [tipoDonacion, setTipoDonacion] = useState<TipoDonacion>('DINERO');

  const {
    register: registerDinero,
    handleSubmit: handleSubmitDinero,
    reset: resetDinero,
    formState: { errors: errorsDinero, isSubmitting: isSubmittingDinero },
  } = useForm<DineroFormData>({
    defaultValues: {
      donante: '',
      monto: 1000000,
      cuentaDestino: 'Banco Agrario - Cta Corriente #4120-998877',
      referencia: '',
      descripcion: '',
    },
  });

  const {
    register: registerEspecie,
    handleSubmit: handleSubmitEspecie,
    reset: resetEspecie,
    formState: { errors: errorsEspecie, isSubmitting: isSubmittingEspecie },
  } = useForm<EspecieFormData>({
    defaultValues: {
      donante: '',
      tipoAyuda: 'Kits de Alimentos No Perecederos',
      cantidad: 100,
      peso: 1500,
      unidadMedida: 'Kits / Cajas',
      descripcion: '',
    },
  });

  const onFormSubmitDinero = async (data: DineroFormData) => {
    await onSubmitDinero({
      donante: data.donante,
      monto: Number(data.monto),
      cuentaDestino: data.cuentaDestino,
      referencia: data.referencia,
      municipioId: data.municipioId ? Number(data.municipioId) : undefined,
      descripcion: data.descripcion || undefined,
    });
    resetDinero();
  };

  const onFormSubmitEspecie = async (data: EspecieFormData) => {
    await onSubmitEspecie({
      donante: data.donante,
      tipoAyuda: data.tipoAyuda,
      cantidad: Number(data.cantidad),
      peso: data.peso ? Number(data.peso) : undefined,
      unidadMedida: data.unidadMedida,
      municipioId: data.municipioId ? Number(data.municipioId) : undefined,
      descripcion: data.descripcion || undefined,
    });
    resetEspecie();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Registrar Donación Humanitaria
              </h2>
              <p className="text-xs text-emerald-200">
                Aporte monetario o en especie con trazabilidad en Caja Transparente
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

        {/* Selector de Tipo de Donación (Pestañas) */}
        <div className="p-6 pb-0">
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setTipoDonacion('DINERO')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tipoDonacion === 'DINERO'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Donación en Dinero
            </button>

            <button
              type="button"
              onClick={() => setTipoDonacion('ESPECIE')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tipoDonacion === 'ESPECIE'
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 text-purple-600" />
              Donación en Especie
            </button>
          </div>
        </div>

        {/* Formulario de Donación en Dinero */}
        {tipoDonacion === 'DINERO' && (
          <form onSubmit={handleSubmitDinero(onFormSubmitDinero)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Donante */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Nombre del Donante o Empresa / Entidad *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Fundación Solidaria del Pacífico / Juan Pérez"
                  {...registerDinero('donante', { required: 'El donante es obligatorio' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errorsDinero.donante && (
                  <p className="text-xs text-rose-500 mt-1">{errorsDinero.donante.message}</p>
                )}
              </div>

              {/* Monto en COP */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Monto Donado ($ COP) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  placeholder="Ej. 5000000"
                  {...registerDinero('monto', {
                    required: 'El monto es obligatorio',
                    min: { value: 1, message: 'El monto debe ser mayor a 0' },
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-slate-900"
                />
                {errorsDinero.monto && (
                  <p className="text-xs text-rose-500 mt-1">{errorsDinero.monto.message}</p>
                )}
              </div>

              {/* Municipio Destino */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Municipio Destino (Opcional)
                </label>
                <select
                  {...registerDinero('municipioId')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="">Fondo Departamental General (Chocó)</option>
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cuenta Bancaria de Destino */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  Cuenta Bancaria Receptora *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Banco Agrario Cta #4120-998877"
                  {...registerDinero('cuentaDestino', { required: 'La cuenta es obligatoria' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errorsDinero.cuentaDestino && (
                  <p className="text-xs text-rose-500 mt-1">{errorsDinero.cuentaDestino.message}</p>
                )}
              </div>

              {/* Referencia de Transferencia */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  Referencia / N° de Comprobante *
                </label>
                <input
                  type="text"
                  placeholder="Ej. TX-2026-88992"
                  {...registerDinero('referencia', { required: 'La referencia es obligatoria' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                />
                {errorsDinero.referencia && (
                  <p className="text-xs text-rose-500 mt-1">{errorsDinero.referencia.message}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Destinación Específica / Observaciones
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Donación destinada a la compra de agua potable y medicamentos para comunidades del Atrato..."
                  {...registerDinero('descripcion')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
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
                disabled={isSubmittingDinero}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 disabled:opacity-50"
              >
                {isSubmittingDinero ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Registrar Donación en Dinero
              </button>
            </div>
          </form>
        )}

        {/* Formulario de Donación en Especie */}
        {tipoDonacion === 'ESPECIE' && (
          <form onSubmit={handleSubmitEspecie(onFormSubmitEspecie)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Donante */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Nombre del Donante o Empresa / Entidad *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Supertiendas del Chocó / Cruz Roja"
                  {...registerEspecie('donante', { required: 'El donante es obligatorio' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                {errorsEspecie.donante && (
                  <p className="text-xs text-rose-500 mt-1">{errorsEspecie.donante.message}</p>
                )}
              </div>

              {/* Tipo de Ayuda */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-purple-600" />
                  Tipo de Ayuda Humanitaria *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Kits de Alimentos No Perecederos"
                  {...registerEspecie('tipoAyuda', { required: 'Tipo de ayuda obligatorio' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                {errorsEspecie.tipoAyuda && (
                  <p className="text-xs text-rose-500 mt-1">{errorsEspecie.tipoAyuda.message}</p>
                )}
              </div>

              {/* Municipio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Municipio de Destino (Opcional)
                </label>
                <select
                  {...registerEspecie('municipioId')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option value="">Centro de Acopio Central (Quibdó)</option>
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-purple-600" />
                  Cantidad Donada *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej. 250"
                  {...registerEspecie('cantidad', {
                    required: 'Cantidad obligatoria',
                    min: { value: 1, message: 'Mínimo 1 unidad' },
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                {errorsEspecie.cantidad && (
                  <p className="text-xs text-rose-500 mt-1">{errorsEspecie.cantidad.message}</p>
                )}
              </div>

              {/* Unidad de Medida */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Unidad de Medida *
                </label>
                <select
                  {...registerEspecie('unidadMedida', { required: 'Unidad de medida obligatoria' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option value="Kits / Cajas">Kits / Cajas Familiares</option>
                  <option value="Bultos / Sacos">Bultos / Sacos (50 kg)</option>
                  <option value="Unidades">Unidades / Piezas</option>
                  <option value="Litros / Galones">Litros / Galones (Líquidos)</option>
                  <option value="Paquetes">Paquetes / Bolsas</option>
                </select>
              </div>

              {/* Peso en KG */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-600" />
                  Peso Total Estimado (Kilogramos)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Ej. 1250"
                  {...registerEspecie('peso')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Descripción */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Detalle del Contenido / Observaciones
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Contiene arroz, frijol, lenteja, aceite vegetal, atún y panela..."
                  {...registerEspecie('descripcion')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                />
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
                disabled={isSubmittingEspecie}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-900/20 disabled:opacity-50"
              >
                {isSubmittingEspecie ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Registrar Donación en Especie
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
