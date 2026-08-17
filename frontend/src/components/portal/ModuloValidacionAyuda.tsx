import React, { useState } from 'react';
import { Search, ShieldCheck, UserCheck } from 'lucide-react';
import { ValidacionAyudaModal } from './ValidacionAyudaModal';
import toast from 'react-hot-toast';

export const ModuloValidacionAyuda: React.FC = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [identificacionConsultada, setIdentificacionConsultada] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();

    const docLimpio = identificacion.trim();
    if (!docLimpio) {
      toast.error('Por favor ingresa un número de identificación para consultar');
      return;
    }

    if (docLimpio.length < 3) {
      toast.error('El número de identificación debe tener al menos 3 caracteres');
      return;
    }

    setIdentificacionConsultada(docLimpio);
    setIsModalOpen(true);
  };

  const handleLimpiarBusqueda = () => {
    setIdentificacion('');
    setIdentificacionConsultada('');
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 lg:p-10 text-white shadow-xl">
        {/* Luces sutiles de fondo */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center sm:text-left flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Textos y Contexto */}
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold tracking-wide uppercase border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Validación de Entregas en Tiempo Real</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              ¿Esta persona ya recibió ayuda?
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Consulta al instante si existe un registro de ayuda humanitaria para este número de identificación y evita duplicidades en las entregas en el Chocó.
            </p>
          </div>

          {/* Formulario Rápido de Consulta */}
          <form
            onSubmit={handleConsultar}
            className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-2.5 bg-white/10 p-2 sm:p-2.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-lg"
          >
            <div className="relative w-full sm:w-64 lg:w-72">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                placeholder="Número de identificación..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/20 whitespace-nowrap"
            >
              <UserCheck className="w-4 h-4" />
              <span>Consultar</span>
            </button>
          </form>
        </div>
      </section>

      {/* Modal Interactivo de Validación y Registro */}
      <ValidacionAyudaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        numeroIdentificacion={identificacionConsultada}
        onLimpiarBusqueda={handleLimpiarBusqueda}
      />
    </>
  );
};
