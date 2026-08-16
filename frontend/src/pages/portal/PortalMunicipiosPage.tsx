import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Search,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { MunicipioPublico } from '../../types/publico.types';

export const PortalMunicipiosPage: React.FC = () => {
  const [municipios, setMunicipios] = useState<MunicipioPublico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroAlerta, setFiltroAlerta] = useState<string>('TODOS');

  const cargar = async () => {
    setIsLoading(true);
    try {
      const data = await publicoService.getMunicipios();
      setMunicipios(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const filtrados = municipios.filter((m) => {
    const coincideTexto =
      m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.codigoDane.includes(busqueda);
    const coincideAlerta =
      filtroAlerta === 'TODOS' || m.nivelAlerta === filtroAlerta;
    return coincideTexto && coincideAlerta;
  });

  return (
    <div className="space-y-6 w-full">
      {/* Encabezado en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>División Político-Administrativa Oficial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Los 31 Municipios del Departamento del Chocó
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Consulte la situación de emergencia, centros de acopio autorizados y albergues habilitados por localidad.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre o DANE..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={filtroAlerta}
            onChange={(e) => setFiltroAlerta(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="TODOS">Todas las alertas</option>
            <option value="ROJO">Alerta Roja</option>
            <option value="AMARILLO">Alerta Amarilla</option>
            <option value="VERDE">Alerta Verde</option>
          </select>

          <button
            onClick={cargar}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            title="Refrescar municipios"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-700' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid de Municipios */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-500 text-sm font-medium">
          Cargando directorio oficial de los 31 municipios...
        </div>
      ) : filtrados.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <p className="text-slate-600 font-medium">No se encontraron municipios con ese criterio de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtrados.map((m) => {
            const badgeColor =
              m.nivelAlerta === 'ROJO'
                ? 'bg-rose-100 text-rose-800 border-rose-200'
                : m.nivelAlerta === 'AMARILLO'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border-emerald-200';

            return (
              <Link
                key={m.id}
                to={`/municipios/${m.id}`}
                className="bg-white border border-slate-200/90 hover:border-emerald-500/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                      DANE: {m.codigoDane}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      Alerta {m.nivelAlerta}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
                    {m.nombre}
                  </h3>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Emergencias activas:</span>
                      <strong className="text-rose-600">{m.afectacionesActivas}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Centros de acopio:</span>
                      <strong className="text-sky-600">{m.centrosAprobados}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Albergues disponibles:</span>
                      <strong className="text-indigo-600">{m.alberguesDisponibles}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Ver Ficha Territorial</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalMunicipiosPage;
