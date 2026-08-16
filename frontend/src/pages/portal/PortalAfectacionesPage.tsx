import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Calendar, MapPin } from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { AfectacionPublica } from '../../types/publico.types';

export const PortalAfectacionesPage: React.FC = () => {
  const [afectaciones, setAfectaciones] = useState<AfectacionPublica[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cargar = async () => {
    setIsLoading(true);
    try {
      const data = await publicoService.getAfectaciones();
      setAfectaciones(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="space-y-6 w-full">
      {/* Header en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Monitoreo de Eventos en Territorio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Afectaciones y Reportes de Emergencia
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Inundaciones, deslizamientos, crecientes súbitas y vendavales en atención por los comités de gestión del riesgo.
          </p>
        </div>

        <button
          onClick={cargar}
          disabled={isLoading}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center gap-2 transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
          <span>Actualizar Eventos</span>
        </button>
      </div>

      {/* Grid de Afectaciones */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500 text-sm font-medium">
          Cargando eventos de emergencia...
        </div>
      ) : afectaciones.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
          <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-medium">No hay eventos de afectación activos registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {afectaciones.map((afectacion) => (
            <div
              key={afectacion.id}
              className="bg-white border border-slate-200/90 hover:border-rose-400 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      afectacion.severidad === 'CRITICA' || afectacion.severidad === 'ALTA'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    Severidad {afectacion.severidad}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {afectacion.municipio?.nombre}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  {afectacion.tipo}
                </h3>

                {afectacion.descripcion && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {afectacion.descripcion}
                  </p>
                )}

                {afectacion.direccion && (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{afectacion.direccion}</span>
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(afectacion.fechaInicio).toLocaleDateString('es-CO')}</span>
                </span>
                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {afectacion.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalAfectacionesPage;
