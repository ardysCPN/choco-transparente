import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, MapPin, Users } from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { AlberguePublico } from '../../types/publico.types';

export const PortalAlberguesPage: React.FC = () => {
  const [albergues, setAlbergues] = useState<AlberguePublico[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const cargar = async () => {
    setIsLoading(true);
    try {
      const data = await publicoService.getAlbergues();
      setAlbergues(data || []);
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200 mb-2">
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span>Refugio y Alojamiento Temporal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Albergues y Alojamientos de Emergencia
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Espacios habilitados con servicios básicos, agua potable y atención para familias damnificadas.
          </p>
        </div>

        <button
          onClick={cargar}
          disabled={isLoading}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center gap-2 transition self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          <span>Actualizar Albergues</span>
        </button>
      </div>

      {/* Grid de Albergues */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500 text-sm font-medium">
          Cargando albergues oficiales...
        </div>
      ) : albergues.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
          <Home className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-600 font-medium">No hay albergues registrados actualmente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albergues.map((albergue) => {
            const ocupacionPct =
              albergue.capacidad > 0
                ? Math.min(100, Math.round((albergue.ocupacion / albergue.capacidad) * 100))
                : 0;

            return (
              <div
                key={albergue.id}
                className="bg-white border border-slate-200/90 hover:border-indigo-400 rounded-3xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        albergue.estado === 'DISPONIBLE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : albergue.estado === 'CASI_LLENO'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}
                    >
                      {albergue.estado}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {albergue.municipio?.nombre}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900">
                    {albergue.nombre}
                  </h3>

                  <p className="text-xs text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{albergue.direccion}</span>
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                      <span>Capacidad y Ocupación:</span>
                      <strong className="text-slate-900">
                        {albergue.ocupacion} / {albergue.capacidad} ({ocupacionPct}%)
                      </strong>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          ocupacionPct > 85 ? 'bg-rose-500' : ocupacionPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${ocupacionPct}%` }}
                      />
                    </div>
                  </div>

                  {albergue.servicios && (
                    <div className="pt-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Servicios: </span>
                      <span>{albergue.servicios}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{albergue.capacidad - albergue.ocupacion} cupos libres</span>
                  </span>
                  <span>Monitoreo 24/7</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalAlberguesPage;
