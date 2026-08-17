import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Calendar,
  Lock,
  Loader2,
  ArrowRight,
  PlusCircle,
  FileCheck2,
} from 'lucide-react';
import { validacionAyudaService } from '../../services/validacion-ayuda.service';
import { ResultadoConsultaAyuda } from '../../types/validacion-ayuda.types';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';

interface ValidacionAyudaModalProps {
  isOpen: boolean;
  onClose: () => void;
  numeroIdentificacion: string;
  onLimpiarBusqueda: () => void;
}

type ModalView = 'CONSULTANDO' | 'REGISTRADO' | 'NO_REGISTRADO' | 'FORMULARIO_REGISTRO';

export const ValidacionAyudaModal: React.FC<ValidacionAyudaModalProps> = ({
  isOpen,
  onClose,
  numeroIdentificacion,
  onLimpiarBusqueda,
}) => {
  const [view, setView] = useState<ModalView>('CONSULTANDO');
  const [resultado, setResultado] = useState<ResultadoConsultaAyuda | null>(null);

  // Campos del formulario de registro
  const [organizacionEntregante, setOrganizacionEntregante] = useState('');
  const [consentimiento, setConsentimiento] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ejecutar consulta cada vez que se abre el modal con una identificación
  useEffect(() => {
    if (isOpen && numeroIdentificacion) {
      ejecutarConsulta(numeroIdentificacion);
    }
  }, [isOpen, numeroIdentificacion]);

  const ejecutarConsulta = async (doc: string) => {
    setView('CONSULTANDO');
    setResultado(null);
    setOrganizacionEntregante('');
    setConsentimiento(false);

    try {
      const response = await validacionAyudaService.consultar(doc);
      if (response.exito && response.datos) {
        setResultado(response.datos);
        if (response.datos.existe) {
          setView('REGISTRADO');
        } else {
          setView('NO_REGISTRADO');
        }
      } else {
        setView('NO_REGISTRADO');
      }
    } catch (error) {
      handleApiError(error, 'No fue posible verificar el registro de ayuda');
      onClose();
    }
  };

  const handleCerrarModal = () => {
    setView('CONSULTANDO');
    setResultado(null);
    setOrganizacionEntregante('');
    setConsentimiento(false);
    onClose();
  };

  const handleGuardarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizacionEntregante.trim()) {
      toast.error('Por favor ingresa el nombre de la organización o persona que entrega');
      return;
    }

    if (!consentimiento) {
      toast.error('Debes confirmar que la persona fue informada y autoriza el registro de estos datos');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await validacionAyudaService.registrar({
        numeroIdentificacion: numeroIdentificacion.trim(),
        organizacionEntregante: organizacionEntregante.trim(),
        consentimientoDatos: true,
      });

      if (response.exito && response.datos) {
        if (response.datos.yaRegistrado) {
          // Caso duplicado detectado en el backend
          setResultado({
            existe: true,
            estado: response.datos.estado,
            fechaRegistro: response.datos.fechaRegistro,
            organizacionEntregante: response.datos.organizacionEntregante,
            numeroIdentificacion,
          });
          setView('REGISTRADO');
          toast(() => (
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-xs text-amber-300">Registro Duplicado Evitado</span>
              <span className="text-xs text-white">Esta persona ya registraba una ayuda previa en el sistema.</span>
            </div>
          ), { icon: '⚠️', duration: 5000 });
        } else {
          // Caso registro exitoso
          toast.success('✅ Ayuda registrada correctamente.', {
            duration: 4000,
            style: {
              borderRadius: '14px',
              background: '#064e3b',
              color: '#fff',
              fontWeight: 'bold',
            },
          });
          handleCerrarModal();
          onLimpiarBusqueda();
        }
      }
    } catch (error) {
      handleApiError(error, 'Error al registrar la entrega de ayuda');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatearFecha = (fechaStr?: string) => {
    if (!fechaStr) return 'Fecha no disponible';
    try {
      const fecha = new Date(fechaStr);
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(fecha);
    } catch {
      return fechaStr;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Encabezado del Modal */}
        <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Validación de Ayuda Recibida
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Doc: <span className="text-emerald-300 font-bold">{numeroIdentificacion}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleCerrarModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* ESTADO 1: CARGANDO / CONSULTANDO */}
          {view === 'CONSULTANDO' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Consultando base de datos departamental...
              </h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Verificando en tiempo real si el documento registra entregas previas.
              </p>
            </div>
          )}

          {/* ESTADO 2: CASO 1 — PERSONA YA REGISTRADA */}
          {view === 'REGISTRADO' && resultado && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                    <span>🟢 {resultado.estado || 'RECIBIDA'}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-emerald-950 leading-snug">
                    Esta persona ya registra una ayuda recibida.
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Existe un registro oficial previo de entrega humanitaria para esta identificación.
                  </p>
                </div>
              </div>

              {/* Tarjeta con los detalles esenciales */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-200/70">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Fecha y Hora de Registro
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {formatearFecha(resultado.fechaRegistro)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Building className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Entregado por (Organización / Persona)
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {resultado.organizacionEntregante || 'Organización no especificada'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mensaje de Privacidad */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100/80 text-[11px] text-slate-600 border border-slate-200">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>
                  Por protección de datos personales de la población vulnerable, no se exhibe información privada adicional.
                </span>
              </div>

              {/* Botón de Cierre */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleCerrarModal}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                >
                  Entendido / Cerrar
                </button>
              </div>
            </div>
          )}

          {/* ESTADO 3: CASO 2 — PERSONA NO REGISTRADA */}
          {view === 'NO_REGISTRADO' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3.5">
                <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                    <span>🟡 NO REGISTRA AYUDA</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-amber-950 leading-snug">
                    No encontramos un registro
                  </h4>
                  <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                    No existe actualmente un registro de ayuda entregada para el número de identificación{' '}
                    <strong className="text-slate-900 font-bold">{numeroIdentificacion}</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">
                  ¿Estás realizando una entrega a esta persona en este momento?
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Puedes registrar la entrega ahora mismo para que otras organizaciones, fundaciones o donantes sepan que ya fue atendida y evitar duplicidades.
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCerrarModal}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => setView('FORMULARIO_REGISTRO')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Registrar Ayuda</span>
                </button>
              </div>
            </div>
          )}

          {/* ESTADO 4: FORMULARIO DE REGISTRO DE AYUDA */}
          {view === 'FORMULARIO_REGISTRO' && (
            <form onSubmit={handleGuardarRegistro} className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Formulario Rápido de Entrega de Ayuda</span>
              </div>

              {/* Campo: Número de Identificación (Prellenado) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Número de Identificación
                </label>
                <input
                  type="text"
                  disabled
                  value={numeroIdentificacion}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-800 font-mono font-bold text-xs cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400">
                  Conservado automáticamente desde tu consulta anterior.
                </p>
              </div>

              {/* Campo: Organización / Persona que entrega */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Organización / Persona que entrega *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={organizacionEntregante}
                    onChange={(e) => setOrganizacionEntregante(e.target.value)}
                    placeholder="Ej. Cruz Roja Chocó, Fundación Solidaria, Donante Particular..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              {/* Campo: Consentimiento de datos informado */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consentimiento}
                    onChange={(e) => setConsentimiento(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-slate-800 leading-snug font-medium">
                    La persona fue informada y autoriza el registro de estos datos en el sistema para control y transparencia humanitaria. *
                  </span>
                </label>
              </div>

              {/* Botones de Cancelar / Registrar */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setView('NO_REGISTRADO')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <>
                      <span>Registrar Ayuda</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
