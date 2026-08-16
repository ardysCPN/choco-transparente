import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  AlertTriangle,
  Home,
  DollarSign,
  TrendingUp,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Package,
  Globe,
  Lock,
} from 'lucide-react';
import {
  DashboardAdministrativoData,
  DashboardPublicoData,
} from '../../types/reporte-dashboard.types';

interface DashboardConsolidadoProps {
  adminData: DashboardAdministrativoData | null;
  publicData: DashboardPublicoData | null;
}

export const DashboardConsolidado: React.FC<DashboardConsolidadoProps> = ({
  adminData,
  publicData,
}) => {
  const [tipoVista, setTipoVista] = useState<'admin' | 'publico'>('admin');

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Switch de Perspectiva: Administrativo vs Público */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {tipoVista === 'admin'
                ? 'Vista Administrativa y Operacional Departamental'
                : 'Vista Pública de Transparencia e Impacto Social'}
            </h3>
            <p className="text-xs text-slate-500">
              {tipoVista === 'admin'
                ? 'Consolidado financiero, logístico y de ejecución para autoridades y auditores'
                : 'Acceso abierto para veeduría ciudadana, cooperantes y medios'}
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            onClick={() => setTipoVista('admin')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tipoVista === 'admin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Administrativo
          </button>
          <button
            onClick={() => setTipoVista('publico')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tipoVista === 'publico'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            Público / Veeduría
          </button>
        </div>
      </div>

      {/* Vista ADMINISTRATIVA */}
      {tipoVista === 'admin' && adminData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Grid de KPIs Administrativos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Familias Censadas
                </span>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {adminData.resumen.totalBeneficiarios.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {adminData.pendientes.solicitudesActivas} solicitudes en trámite
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Fondos Recaudados
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {formatCOP(adminData.resumen.totalMonetario)}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {adminData.resumen.totalDonaciones} donaciones recibidas
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ayudas Entregadas
                </span>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {adminData.resumen.totalEntregado.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-purple-600">kits</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Con verificación biométrica y fotográfica
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Albergues Disponibles
                </span>
                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                  <Home className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {adminData.capacidad.alberguesDisponibles}
                </span>
                <span className="text-xs font-semibold text-teal-600">operativos</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {adminData.resumen.totalAfectaciones} zonas de emergencia atendidas
              </p>
            </div>
          </div>

          {/* Desglose de Pendientes Operativos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-amber-950">
                  {adminData.pendientes.donacionesPendientes}
                </div>
                <div className="text-xs font-semibold text-amber-800">
                  Donaciones por Conciliar
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500 text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-rose-950">
                  {adminData.pendientes.gastosPendientes}
                </div>
                <div className="text-xs font-semibold text-rose-800">
                  Facturas Pendientes de Auditoría
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500 text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-blue-950">
                  {adminData.pendientes.solicitudesActivas}
                </div>
                <div className="text-xs font-semibold text-blue-800">
                  Solicitudes en Proceso de Despacho
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista PÚBLICA DE TRANSPARENCIA */}
      {tipoVista === 'publico' && publicData && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {publicData.impacto.personasAsistidas.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-slate-600 uppercase mt-1">
                Familias Damnificadas Asistidas
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {publicData.impacto.zonasAfectadas}
              </div>
              <div className="text-xs font-bold text-slate-600 uppercase mt-1">
                Zonas de Afectación Activas
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {publicData.denuncias.reportesPendientes}
              </div>
              <div className="text-xs font-bold text-slate-600 uppercase mt-1">
                Alertas Ciudadanas en Veeduría
              </div>
            </div>
          </div>

          {/* Tabla de Cobertura Territorial por Municipio */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Cobertura e Impacto Humanitario por Municipio del Chocó
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {publicData.cobertura_territorial?.length || 0} municipios registrados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Municipio</th>
                    <th className="px-4 py-3">Emergencias / Afectaciones</th>
                    <th className="px-4 py-3">Familias Atendidas</th>
                    <th className="px-4 py-3 text-right">Estado de Atención</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {publicData.cobertura_territorial?.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{m.nombre}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                          {m._count?.afectaciones || 0} emergencias
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          {m._count?.beneficiarios || 0} familias
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Cobertura Activa
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
