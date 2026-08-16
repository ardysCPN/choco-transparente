import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield,
  Home,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  LifeBuoy,
} from 'lucide-react';
import { publicoService } from '../../services/publico.service';

export const PortalMunicipioDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [municipio, setMunicipio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cargarDetalle = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await publicoService.getMunicipio(Number(id));
      setMunicipio(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500 text-sm font-medium flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-700" />
        <span>Cargando información municipal...</span>
      </div>
    );
  }

  if (!municipio) {
    return (
      <div className="text-center py-20 space-y-4 bg-white border border-slate-200 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-slate-900">Municipio no encontrado</h2>
        <Link to="/municipios" className="text-emerald-700 underline text-sm font-bold">
          ← Volver al listado de municipios
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header Municipal en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <Link
          to="/municipios"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a los 31 Municipios</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {municipio.nombre}
              </h1>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  municipio.nivelAlerta === 'ROJO'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : municipio.nivelAlerta === 'AMARILLO'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}
              >
                Alerta {municipio.nivelAlerta}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Código DANE: <strong>{municipio.codigoDane}</strong> • Departamento del Chocó
            </p>
          </div>

          <Link
            to="/solicitar-ayuda"
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs flex items-center gap-2 self-start md:self-auto transition"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Pedir Ayuda en este Municipio</span>
          </Link>
        </div>
      </div>

      {/* Grid de 3 Secciones: Centros de Acopio, Albergues y Emergencias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Centros de Acopio */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-600" />
            <span>Centros de Acopio ({municipio.centrosAcopio?.length || 0})</span>
          </h3>

          <div className="space-y-3">
            {municipio.centrosAcopio?.length === 0 ? (
              <p className="text-xs text-slate-500">No hay centros de acopio activos en este municipio.</p>
            ) : (
              municipio.centrosAcopio?.map((c: any) => (
                <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="font-bold text-xs text-slate-900">{c.nombre}</div>
                  <div className="text-[11px] text-slate-600">{c.direccion}</div>
                  {c.telefono && <div className="text-[11px] text-slate-500 font-mono">Tel: {c.telefono}</div>}
                  <Link
                    to={`/centros-acopio/${c.id}`}
                    className="text-[11px] text-sky-700 hover:underline font-bold block pt-1"
                  >
                    Ver stock disponible →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Albergues */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Home className="w-4 h-4 text-indigo-600" />
            <span>Albergues ({municipio.albergues?.length || 0})</span>
          </h3>

          <div className="space-y-3">
            {municipio.albergues?.length === 0 ? (
              <p className="text-xs text-slate-500">No hay albergues registrados en este municipio.</p>
            ) : (
              municipio.albergues?.map((a: any) => (
                <div key={a.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="font-bold text-xs text-slate-900">{a.nombre}</div>
                  <div className="text-[11px] text-slate-600">{a.direccion}</div>
                  <div className="text-[11px] text-slate-600">
                    Ocupación: <strong>{a.ocupacion} / {a.capacidad}</strong> ({a.estado})
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Afectaciones */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Afectaciones ({municipio.afectaciones?.length || 0})</span>
          </h3>

          <div className="space-y-3">
            {municipio.afectaciones?.length === 0 ? (
              <p className="text-xs text-slate-500">No hay emergencias activas registradas en este municipio.</p>
            ) : (
              municipio.afectaciones?.map((af: any) => (
                <div key={af.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="font-bold text-xs text-slate-900">{af.tipo}</div>
                  <div className="text-[11px] text-slate-600">{af.descripcion}</div>
                  <div className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full inline-block">
                    Severidad: {af.severidad}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalMunicipioDetallePage;
