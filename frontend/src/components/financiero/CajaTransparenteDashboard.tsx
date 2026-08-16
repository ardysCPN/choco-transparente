import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Scale,
  Package,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Receipt,
} from 'lucide-react';
import { Donacion, Gasto } from '../../types/financiero.types';

interface CajaTransparenteDashboardProps {
  donaciones: Donacion[];
  gastos: Gasto[];
}

export const CajaTransparenteDashboard: React.FC<CajaTransparenteDashboardProps> = ({
  donaciones,
  gastos,
}) => {
  // Cálculos de Donaciones en Dinero
  const donacionesDinero = donaciones.filter((d) => d.tipo === 'DINERO');
  const totalDineroRecaudado = donacionesDinero.reduce(
    (acc, d) => acc + (Number(d.monto) || Number(d.dinero?.monto) || 0),
    0
  );

  // Cálculos de Donaciones en Especie
  const donacionesEspecie = donaciones.filter((d) => d.tipo === 'ESPECIE');
  const totalItemsEspecie = donacionesEspecie.reduce(
    (acc, d) => acc + (Number(d.especie?.cantidad) || 0),
    0
  );
  const totalPesoEspecieKg = donacionesEspecie.reduce(
    (acc, d) => acc + (Number(d.especie?.peso) || 0),
    0
  );

  // Cálculos de Gastos
  const gastosAprobados = gastos.filter((g) => g.estado === 'APROBADO');
  const totalGastosAprobados = gastosAprobados.reduce((acc, g) => acc + (Number(g.monto) || 0), 0);

  const gastosBorrador = gastos.filter((g) => g.estado === 'BORRADOR');
  const totalGastosPendientes = gastosBorrador.reduce((acc, g) => acc + (Number(g.monto) || 0), 0);

  const totalGastosRechazados = gastos
    .filter((g) => g.estado === 'RECHAZADO')
    .reduce((acc, g) => acc + (Number(g.monto) || 0), 0);

  // Saldo Neto Disponible en Caja
  const saldoNeto = totalDineroRecaudado - totalGastosAprobados;
  const porcentajeEjecutado =
    totalDineroRecaudado > 0 ? Math.round((totalGastosAprobados / totalDineroRecaudado) * 100) : 0;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Caja Transparente Abierta */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200 text-emerald-950 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-emerald-900">
              Caja Transparente Departamental — Control y Rendición de Cuentas
            </h4>
            <p className="text-[11px] text-emerald-700">
              Cada peso recibido y ejecutado cuenta con registro auditable y soporte digital verificado.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Auditado
        </span>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Ingresos Dinero */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Donaciones Dinero
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {formatCOP(totalDineroRecaudado)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {donacionesDinero.length} aportes monetarios registrados
          </p>
        </div>

        {/* Card 2: Gastos Ejecutados */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Gastos Aprobados
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {formatCOP(totalGastosAprobados)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {gastosAprobados.length} facturas aprobadas por auditoría
          </p>
        </div>

        {/* Card 3: Saldo Neto Disponible */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Saldo Disponible en Caja
            </span>
            <div
              className={`p-2.5 rounded-xl ${
                saldoNeto >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
              }`}
            >
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-extrabold ${
                saldoNeto >= 0 ? 'text-slate-900' : 'text-rose-600'
              }`}
            >
              {formatCOP(saldoNeto)}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {porcentajeEjecutado}% del presupuesto donado ejecutado
          </p>
        </div>

        {/* Card 4: Ayudas en Especie */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ayuda en Especie
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalItemsEspecie.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-purple-600">unidades</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {totalPesoEspecieKg.toLocaleString()} kg aprox. en víveres y menajes
          </p>
        </div>
      </div>

      {/* Sección Comparativa: Flujo de Fondos y Estado de Facturas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance y Ejecución Presupuestal */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Ejecución Presupuestal de Caja
            </h3>
            <span className="text-xs font-semibold text-slate-500">Ingresos vs Gastos</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Total Recaudado (Donaciones Dinero)
                </span>
                <span className="font-bold text-slate-900">{formatCOP(totalDineroRecaudado)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500 w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Gastos Ejecutados y Aprobados ({porcentajeEjecutado}%)
                </span>
                <span className="font-bold text-slate-900">{formatCOP(totalGastosAprobados)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, porcentajeEjecutado)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Gastos en Trámite / Pendientes de Aprobación
                </span>
                <span className="font-bold text-slate-900">{formatCOP(totalGastosPendientes)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      totalDineroRecaudado > 0
                        ? Math.min(100, (totalGastosPendientes / totalDineroRecaudado) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <p>
              El saldo neto disponible de <span className="font-bold text-slate-800">{formatCOP(saldoNeto)}</span> se
              encuentra depositado en las cuentas matrices autorizadas por la Gobernación del Chocó para la emergencia.
            </p>
          </div>
        </div>

        {/* Estado de Facturación y Veeduría Financiera */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              Estado de Facturas y Egresos
            </h3>
            <span className="text-xs font-semibold text-slate-500">Doble Aprobación</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="inline-flex p-2 rounded-lg bg-emerald-100 text-emerald-700 mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-lg font-extrabold text-slate-900">
                {gastosAprobados.length} facturas
              </div>
              <div className="text-[11px] font-semibold text-emerald-700">
                {formatCOP(totalGastosAprobados)}
              </div>
              <div className="text-[10px] text-slate-500">Aprobadas con Soporte</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="inline-flex p-2 rounded-lg bg-amber-100 text-amber-700 mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-lg font-extrabold text-slate-900">
                {gastosBorrador.length} facturas
              </div>
              <div className="text-[11px] font-semibold text-amber-700">
                {formatCOP(totalGastosPendientes)}
              </div>
              <div className="text-[10px] text-slate-500">En Revisión de Auditoría</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <div className="inline-flex p-2 rounded-lg bg-rose-100 text-rose-700 mb-1">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="text-lg font-extrabold text-slate-900">
                {gastos.filter((g) => g.estado === 'RECHAZADO').length} facturas
              </div>
              <div className="text-[11px] font-semibold text-rose-700">
                {formatCOP(totalGastosRechazados)}
              </div>
              <div className="text-[10px] text-slate-500">Rechazadas / Con Reparos</div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 text-center flex flex-col justify-center">
              <div className="text-2xl font-black text-blue-900">
                {gastos.length > 0
                  ? `${Math.round((gastosAprobados.length / gastos.length) * 100)}%`
                  : '100%'}
              </div>
              <div className="text-[11px] font-semibold text-blue-800">
                Tasa de Validación de Facturas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
