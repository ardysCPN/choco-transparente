import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  ShieldAlert,
  MapPin,
  Camera,
  FileText,
  Navigation,
  Loader2,
  Send,
  AlertOctagon,
} from 'lucide-react';
import {
  CrearDenunciaInput,
  TipoDenuncia,
} from '../../types/albergue-denuncia.types';
import { Municipio } from '../../types/territorial.types';
import toast from 'react-hot-toast';

interface DenunciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearDenunciaInput) => Promise<void>;
  municipios: Municipio[];
}

interface FormData {
  tipo: TipoDenuncia | string;
  descripcion: string;
  municipioId: number;
  barrio?: string;
  latitud?: number;
  longitud?: number;
  evidencia?: string;
}

const TIPOS_DENUNCIA: { value: TipoDenuncia; label: string; desc: string }[] = [
  {
    value: 'DESVIO_AYUDAS',
    label: 'Desvío o Pérdida de Ayudas',
    desc: 'Donaciones o kits entregados a personas no damnificadas o retenidos sin causa.',
  },
  {
    value: 'COBRO_INDEBIDO',
    label: 'Cobro o Exigencia Indebida',
    desc: 'Solicitud de dinero o favores para acceder a censos, albergues o kits humanitarios.',
  },
  {
    value: 'EXCLUSION_DISCRIMINATORIA',
    label: 'Exclusión o Discriminación',
    desc: 'Familias afectadas no censadas por motivos políticos, étnicos o personales.',
  },
  {
    value: 'ENTREGA_INCOMPLETA',
    label: 'Kits / Entregas Incompletas o Deterioradas',
    desc: 'Alimentos vencidos, paquetes abiertos o falta de insumos prometidos.',
  },
  {
    value: 'PROSELITISMO_POLITICO',
    label: 'Proselitismo Político',
    desc: 'Uso de la emergencia y de las ayudas humanitarias para fines electorales o partidistas.',
  },
  {
    value: 'MAL_ESTADO_ALBERGUE',
    label: 'Malas Condiciones de Albergue',
    desc: 'Falta de agua, salubridad crítica, hacinamiento o inseguridad en el refugio.',
  },
  {
    value: 'OTRO',
    label: 'Otra Irregularidad',
    desc: 'Cualquier otro hecho contrario a la transparencia y la dignidad de las víctimas.',
  },
];

export const DenunciaModal: React.FC<DenunciaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  municipios,
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      tipo: 'DESVIO_AYUDAS',
      municipioId: municipios[0]?.id || 1,
      descripcion: '',
      barrio: '',
      evidencia: '',
    },
  });

  const selectedTipo = watch('tipo');

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitud', Number(position.coords.latitude.toFixed(6)));
        setValue('longitud', Number(position.coords.longitude.toFixed(6)));
        setIsGettingLocation(false);
        toast.success('Ubicación GPS registrada correctamente.');
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error(`Error al obtener ubicación: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onFormSubmit = async (data: FormData) => {
    const payload: CrearDenunciaInput = {
      tipo: data.tipo,
      descripcion: data.descripcion,
      municipioId: Number(data.municipioId),
      barrio: data.barrio || undefined,
      latitud: data.latitud ? Number(data.latitud) : undefined,
      longitud: data.longitud ? Number(data.longitud) : undefined,
      evidencia: data.evidencia || undefined,
      estado: 'RECIBIDA',
    };

    await onSubmit(payload);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-rose-950 via-slate-900 to-violet-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Radicar Denuncia o Alerta Ciudadana
              </h2>
              <p className="text-xs text-rose-200">
                Canal de Veeduría, Transparencia y Control Social del Chocó
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
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {/* Tipo de Irregularidad */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                Tipo de Irregularidad o Hecho *
              </label>
              <select
                {...register('tipo', { required: 'Seleccione el tipo de denuncia' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white font-medium"
              >
                {TIPOS_DENUNCIA.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              {/* Descripción breve del tipo seleccionado */}
              {selectedTipo && (
                <p className="mt-1.5 text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  ℹ️ {TIPOS_DENUNCIA.find((t) => t.value === selectedTipo)?.desc}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Municipio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Municipio donde ocurrió el hecho *
                </label>
                <select
                  {...register('municipioId', { required: 'Seleccione un municipio' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white"
                >
                  {municipios.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Barrio o Corregimiento */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Barrio, Vereda o Sector
                </label>
                <input
                  type="text"
                  placeholder="Ej. Sector Playita / Barrio Medrano"
                  {...register('barrio')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            {/* Descripción Detallada */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Descripción Detallada de los Hechos *
              </label>
              <textarea
                rows={4}
                placeholder="Describa con la mayor claridad posible: qué sucedió, quiénes estuvieron involucrados, fechas y lugares específicos..."
                {...register('descripcion', {
                  required: 'La descripción es obligatoria para iniciar investigación',
                  minLength: { value: 10, message: 'Por favor proporcione más detalles (mínimo 10 caracteres)' },
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
              />
              {errors.descripcion && (
                <p className="text-xs text-rose-500 mt-1">{errors.descripcion.message}</p>
              )}
            </div>

            {/* Evidencia Fotográfica o Documental */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                URL de Evidencia Fotográfica / Video / Soporte
              </label>
              <input
                type="url"
                placeholder="https://ejemplo.com/foto_evidencia_denuncia.jpg"
                {...register('evidencia')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Puede adjuntar un enlace seguro a una imagen, video o acta que respalde los hechos denunciados.
              </p>
            </div>

            {/* Geolocalización GPS Opcional */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  Georreferenciación del Lugar de los Hechos (Opcional)
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {isGettingLocation ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  Capturar GPS
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="5.6947"
                    {...register('latitud')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="-76.6611"
                    {...register('longitud')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-900/20 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Radicar Denuncia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
