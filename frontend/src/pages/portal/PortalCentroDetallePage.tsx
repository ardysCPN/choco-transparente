import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Package,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import { publicoService } from '../../services/publico.service';
import { CentroAcopioPublico } from '../../types/publico.types';

export const PortalCentroDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [centro, setCentro] = useState<CentroAcopioPublico | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cargar = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await publicoService.getCentroAcopio(id);
      setCentro(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-500 text-sm font-medium flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-sky-700" />
        <span>Cargando detalle del centro de acopio...</span>
      </div>
    );
  }

  if (!centro) {
    return (
      <div className="text-center py-20 space-y-4 bg-white border border-slate-200 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-slate-900">Centro de acopio no encontrado</h2>
        <Link to="/centros-acopio" className="text-sky-700 underline text-sm font-bold">
          ← Volver a centros de acopio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header del Centro en Fondo Claro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <Link
          to="/centros-acopio"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Centros de Acopio</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {centro.nombre}
              </h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Auditado</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{centro.direccion} {centro.barrio ? `(${centro.barrio})` : ''} • {centro.municipio?.nombre}</span>
            </p>
            {centro.telefono && (
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>Teléfono: <strong>{centro.telefono}</strong></span>
              </p>
            )}
          </div>

          <Link
            to="/donar"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs flex items-center gap-2 self-start md:self-auto transition"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Donar Insumos a este Centro</span>
          </Link>
        </div>
      </div>

      {/* Stock e Insumos en este Centro */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-700" />
          <span>Insumos y Stock Disponible en Custodia</span>
        </h3>

        {!centro.inventarios || centro.inventarios.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">
            Actualmente este centro no tiene registros de stock en inventario o está en proceso de abastecimiento.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {centro.inventarios.map((inv: any) => (
              <div key={inv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{inv.tipoAyuda}</div>
                <div className="text-2xl font-black text-slate-900">
                  {inv.cantidad.toLocaleString('es-CO')} <span className="text-xs font-normal text-slate-500">{inv.unidadMedida}</span>
                </div>
                {inv.pesoKg && (
                  <div className="text-[11px] text-emerald-800 font-medium pt-1">
                    Peso estimado: {inv.pesoKg.toLocaleString('es-CO')} Kg
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalCentroDetallePage;
