import React, { useState } from 'react';
import {
  Search,
  Truck,
  Image,
  MapPin,
  PlusCircle,
} from 'lucide-react';
import { EntregaAyuda } from '../../types/beneficiario.types';

interface EntregasListProps {
  entregas: EntregaAyuda[];
  isLoading: boolean;
  onCrear: () => void;
}

export const EntregasList: React.FC<EntregasListProps> = ({
  entregas,
  isLoading,
  onCrear,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = entregas.filter((e) => {
    const matchSearch =
      (e.beneficiario?.codigoFamilia &&
        e.beneficiario.codigoFamilia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.observaciones && e.observaciones.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchSearch;
  });

  const totalEntregado = filtered.reduce((s, e) => s + Number(e.cantidad), 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por familia, observaciones..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            Total entregado: <strong className="text-violet-700">{totalEntregado.toLocaleString()} kits</strong>
          </span>

          <button
            onClick={onCrear}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Entrega</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-violet-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Registro de Entregas de Ayuda Humanitaria
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filtered.length} entregas registradas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Familia</th>
                <th className="px-5 py-3.5 text-center">Cantidad</th>
                <th className="px-5 py-3.5">Observaciones</th>
                <th className="px-5 py-3.5">Evidencia</th>
                <th className="px-5 py-3.5">Geolocalización</th>
                <th className="px-5 py-3.5 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Cargando entregas de ayuda...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Sin entregas registradas.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {e.beneficiario?.codigoFamilia || `#${e.beneficiarioId}`}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="font-mono font-bold text-sm text-violet-700 bg-violet-50 px-2 py-0.5 rounded-lg">
                        {Number(e.cantidad).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-[200px] truncate">
                      {e.observaciones || '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      {e.evidencia ? (
                        <a
                          href={e.evidencia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 font-semibold"
                        >
                          <Image className="w-3.5 h-3.5" />
                          Ver foto
                        </a>
                      ) : (
                        <span className="text-slate-300">Sin evidencia</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {e.latitud && e.longitud ? (
                        <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-mono">
                          <MapPin className="w-3 h-3" />
                          {Number(e.latitud).toFixed(4)}, {Number(e.longitud).toFixed(4)}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(e.fecha).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
