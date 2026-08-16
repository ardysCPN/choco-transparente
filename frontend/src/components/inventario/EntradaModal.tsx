import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, PackagePlus, QrCode, Loader2, Save } from 'lucide-react';
import { CentroAcopio } from '../../types/territorial.types';
import { RegistrarEntradaInput } from '../../types/inventario.types';
import { useAuthStore } from '../../store/authStore';
import { inventarioService } from '../../services/inventario.service';
import { handleApiError } from '../../utils/errorHandler';
import { QRScannerModal } from './QRScannerModal';
import toast from 'react-hot-toast';

interface EntradaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  centros: CentroAcopio[];
}

export const EntradaModal: React.FC<EntradaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  centros,
}) => {
  const usuario = useAuthStore((state) => state.usuario);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegistrarEntradaInput>({
    defaultValues: {
      centroAcopioId: centros[0]?.id ? String(centros[0].id) : '1',
      tipoAyuda: 'KIT_ALIMENTOS',
      cantidad: 100,
      peso: 1500,
      origen: 'UNGRD - Bodega Nacional',
      numeroDocumento: 'REM-2026-001',
      fotoCamion: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
      usuarioId: usuario?.id ? String(usuario.id) : '1',
    },
  });

  if (!isOpen) return null;

  const handleQRResult = (data: {
    tipoAyuda: string;
    cantidad: number;
    peso: number;
    origen: string;
    numeroDocumento: string;
  }) => {
    setValue('tipoAyuda', data.tipoAyuda, { shouldValidate: true });
    setValue('cantidad', data.cantidad, { shouldValidate: true });
    setValue('peso', data.peso, { shouldValidate: true });
    setValue('origen', data.origen, { shouldValidate: true });
    setValue('numeroDocumento', data.numeroDocumento, { shouldValidate: true });
    toast.success('¡Datos de remisión QR cargados con éxito!', { icon: '📦' });
  };

  const onSubmit = async (data: RegistrarEntradaInput) => {
    try {
      const payload: RegistrarEntradaInput = {
        ...data,
        centroAcopioId: String(data.centroAcopioId),
        cantidad: Number(data.cantidad),
        peso: data.peso ? Number(data.peso) : undefined,
        usuarioId: usuario?.id ? String(usuario.id) : '1',
      };

      await inventarioService.registrarEntrada(payload);
      toast.success('¡Ingreso de inventario registrado correctamente!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      handleApiError(error, 'Error al registrar entrada de inventario');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <PackagePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Registrar Entrada de Ayudas Humanitarias</h3>
                <p className="text-xs text-slate-400">
                  Ingreso de remesas y donaciones a Centro de Acopio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsQRModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors"
                title="Escanear Código QR de Remisión"
              >
                <QrCode className="w-4 h-4" />
                <span>Escanear QR</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Centro de Acopio Destino *
                </label>
                <select
                  {...register('centroAcopioId', { required: 'Seleccione un centro de acopio' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  {centros.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.municipio?.nombre || 'Chocó'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Tipo de Ayuda / Kit *
                </label>
                <select
                  {...register('tipoAyuda', { required: 'Seleccione el tipo de ayuda' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="KIT_ALIMENTOS">Kits de Alimentos (No perecederos)</option>
                  <option value="KIT_ASEO">Kits de Aseo Familiar</option>
                  <option value="KIT_COCINA">Kits de Cocina y Menaje</option>
                  <option value="FRAZADAS_COLCHONETAS">Frazadas / Colchonetas / Sábanas</option>
                  <option value="AGUA_POTABLE">Agua Potable (Garrafas / Bidones)</option>
                  <option value="MEDICAMENTOS_PRIMEROS_AUXILIOS">Medicamentos y Primeros Auxilios</option>
                  <option value="HERRAMIENTAS_REPARACION">Herramientas y Tejas de Reparación</option>
                  <option value="CARPAS_REFUGIO">Carpas y Elementos de Refugio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Cantidad (Unidades / Paquetes) *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej. 150"
                  {...register('cantidad', {
                    required: 'La cantidad es obligatoria',
                    min: { value: 1, message: 'Debe ser al menos 1' },
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.cantidad && (
                  <p className="text-xs text-rose-500 mt-1">{errors.cantidad.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Peso Estimado Total (Kg)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ej. 2250"
                  {...register('peso')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Origen / Proveedor / Donante *
                </label>
                <input
                  type="text"
                  placeholder="Ej. UNGRD Nacional, Cruz Roja, Donación Privada"
                  {...register('origen', { required: 'El origen es obligatorio' })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {errors.origen && (
                  <p className="text-xs text-rose-500 mt-1">{errors.origen.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Número de Remisión / Manifiesto
                </label>
                <input
                  type="text"
                  placeholder="Ej. REM-2026-8942"
                  {...register('numeroDocumento')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  URL Foto del Camión / Soporte de Carga
                </label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/foto-camion.jpg"
                  {...register('fotoCamion')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Registrar Entrada
              </button>
            </div>
          </form>
        </div>
      </div>

      <QRScannerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onScanResult={handleQRResult}
      />
    </>
  );
};
