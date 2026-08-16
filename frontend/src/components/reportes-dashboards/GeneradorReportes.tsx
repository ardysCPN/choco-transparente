import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  DollarSign,
  Receipt,
  Users,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { reporteService } from '../../services/reporte.service';
import { Municipio } from '../../types/territorial.types';
import toast from 'react-hot-toast';

interface GeneradorReportesProps {
  municipios: Municipio[];
}

type TipoReporte = 'donaciones' | 'gastos' | 'beneficiarios' | 'afectaciones' | 'inventario';

export const GeneradorReportes: React.FC<GeneradorReportesProps> = ({ municipios }) => {
  const [tipoReporte, setTipoReporte] = useState<TipoReporte>('donaciones');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('todos');
  const [_selectedEstado] = useState<string>('todos');

  const [reporteData, setReporteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const generarReporte = useCallback(async () => {
    setIsLoading(true);
    try {
      const filtros: any = {};
      if (fechaInicio) filtros.fechaInicio = fechaInicio;
      if (fechaFin) filtros.fechaFin = fechaFin;
      if (selectedMunicipio !== 'todos') filtros.municipioId = Number(selectedMunicipio);

      let res: any;
      switch (tipoReporte) {
        case 'donaciones':
          res = await reporteService.getReporteDonaciones(filtros);
          break;
        case 'gastos':
          res = await reporteService.getReporteGastos(filtros);
          break;
        case 'beneficiarios':
          res = await reporteService.getReporteBeneficiarios(filtros);
          break;
        case 'afectaciones':
          res = await reporteService.getReporteAfectaciones(filtros);
          break;
        case 'inventario':
          res = await reporteService.getReporteInventario();
          break;
      }
      setReporteData(res);
    } catch (error) {
      toast.error('Error al generar reporte');
    } finally {
      setIsLoading(false);
    }
  }, [tipoReporte, fechaInicio, fechaFin, selectedMunicipio]);

  useEffect(() => {
    generarReporte();
  }, [generarReporte]);

  const handleExportar = async (formato: 'JSON' | 'CSV') => {
    setIsExporting(true);
    try {
      const filtros: any = { tipo: tipoReporte };
      if (fechaInicio) filtros.fechaInicio = fechaInicio;
      if (fechaFin) filtros.fechaFin = fechaFin;
      if (selectedMunicipio !== 'todos') filtros.municipioId = Number(selectedMunicipio);

      const data = await reporteService.exportarReporte(filtros, formato);
      const filename = `reporte_${tipoReporte}_${new Date().toISOString().split('T')[0]}.${formato.toLowerCase()}`;

      if (formato === 'CSV') {
        const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], {
          type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const blob = new Blob([JSON.stringify(data || reporteData, null, 2)], {
          type: 'application/json;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success(`Reporte de ${tipoReporte} exportado exitosamente en formato ${formato}`);
    } catch (error) {
      toast.error('Error al exportar reporte');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Selector de Tipo de Reporte */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setTipoReporte('donaciones')}
          className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
            tipoReporte === 'donaciones'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <DollarSign className="w-5 h-5 text-emerald-600 mb-1.5" />
          <span className="text-xs font-bold">Donaciones</span>
          <span className="text-[10px] text-slate-400">Dinero y Especie</span>
        </button>

        <button
          onClick={() => setTipoReporte('gastos')}
          className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
            tipoReporte === 'gastos'
              ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-md shadow-rose-500/10 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-5 h-5 text-rose-600 mb-1.5" />
          <span className="text-xs font-bold">Gastos</span>
          <span className="text-[10px] text-slate-400">Facturación Auditada</span>
        </button>

        <button
          onClick={() => setTipoReporte('beneficiarios')}
          className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
            tipoReporte === 'beneficiarios'
              ? 'bg-blue-50 border-blue-500 text-blue-950 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-5 h-5 text-blue-600 mb-1.5" />
          <span className="text-xs font-bold">Beneficiarios</span>
          <span className="text-[10px] text-slate-400">Familias Asistidas</span>
        </button>

        <button
          onClick={() => setTipoReporte('afectaciones')}
          className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
            tipoReporte === 'afectaciones'
              ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-md shadow-amber-500/10 ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 mb-1.5" />
          <span className="text-xs font-bold">Afectaciones</span>
          <span className="text-[10px] text-slate-400">Zonas de Emergencia</span>
        </button>

        <button
          onClick={() => setTipoReporte('inventario')}
          className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
            tipoReporte === 'inventario'
              ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-md shadow-purple-500/10 ring-2 ring-purple-500/20'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Package className="w-5 h-5 text-purple-600 mb-1.5" />
          <span className="text-xs font-bold">Inventario</span>
          <span className="text-[10px] text-slate-400">Stock en Centros</span>
        </button>
      </div>

      {/* Barra de Filtros y Botones de Exportación */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600">Desde:</span>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600">Hasta:</span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedMunicipio}
            onChange={(e) => setSelectedMunicipio(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos los Municipios</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => handleExportar('CSV')}
            disabled={isExporting || isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors disabled:opacity-50"
            title="Exportar archivo CSV para Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            CSV / Excel
          </button>

          <button
            onClick={() => handleExportar('JSON')}
            disabled={isExporting || isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors disabled:opacity-50"
            title="Exportar archivo JSON"
          >
            <Download className="w-4 h-4 text-blue-600" />
            JSON
          </button>

          <button
            onClick={handleImprimir}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            title="Imprimir o guardar en PDF"
          >
            <Printer className="w-4 h-4 text-purple-600" />
            Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Resultados del Reporte */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-bold text-slate-700">Generando reporte filtrado...</p>
        </div>
      ) : reporteData ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          {/* Métricas Resumen del Reporte */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Total Registros
              </span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                {reporteData.total || 0}
              </div>
            </div>

            {reporteData.totalDinero !== undefined && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Total Recaudado
                </span>
                <div className="text-xl font-black text-emerald-700 mt-0.5">
                  {formatCOP(reporteData.totalDinero)}
                </div>
              </div>
            )}

            {reporteData.totalGastos !== undefined && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Total Gastos
                </span>
                <div className="text-xl font-black text-rose-700 mt-0.5">
                  {formatCOP(reporteData.totalGastos)}
                </div>
              </div>
            )}

            {reporteData.totalPersonas !== undefined && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Personas Asistidas
                </span>
                <div className="text-xl font-black text-blue-700 mt-0.5">
                  {reporteData.totalPersonas.toLocaleString()}
                </div>
              </div>
            )}

            {reporteData.totalCantidad !== undefined && (
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Stock Total
                </span>
                <div className="text-xl font-black text-purple-700 mt-0.5">
                  {reporteData.totalCantidad.toLocaleString()} unidades
                </div>
              </div>
            )}
          </div>

          {/* Tabla de Registros del Reporte */}
          <div className="overflow-x-auto">
            {tipoReporte === 'donaciones' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Donante</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Monto / Ayuda</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reporteData.donaciones?.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{d.donante}</td>
                      <td className="px-4 py-3">{d.tipo}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-800">
                        {d.tipo === 'DINERO'
                          ? formatCOP(Number(d.monto || d.dinero?.monto || 0))
                          : `${d.especie?.cantidad || 0} ${d.especie?.unidadMedida || 'Kits'}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100">
                          {d.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {d.fecha ? new Date(d.fecha).toLocaleDateString('es-CO') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tipoReporte === 'gastos' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Factura</th>
                    <th className="px-4 py-3">Concepto</th>
                    <th className="px-4 py-3">Proveedor</th>
                    <th className="px-4 py-3">Monto</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reporteData.gastos?.map((g: any) => (
                    <tr key={g.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {g.numeroFactura}
                      </td>
                      <td className="px-4 py-3">{g.concepto}</td>
                      <td className="px-4 py-3">{g.proveedor}</td>
                      <td className="px-4 py-3 font-bold text-rose-700">
                        {formatCOP(Number(g.monto))}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100">
                          {g.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tipoReporte === 'beneficiarios' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Código Familia</th>
                    <th className="px-4 py-3">Municipio</th>
                    <th className="px-4 py-3">Personas en Hogar</th>
                    <th className="px-4 py-3">Contacto</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reporteData.beneficiarios?.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{b.codigoFamilia}</td>
                      <td className="px-4 py-3">{b.municipio?.nombre || 'Chocó'}</td>
                      <td className="px-4 py-3 font-bold text-blue-700">{b.cantidadPersonas}</td>
                      <td className="px-4 py-3">{b.contacto || '-'}</td>
                      <td className="px-4 py-3">{b.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tipoReporte === 'afectaciones' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Emergencia</th>
                    <th className="px-4 py-3">Municipio</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Severidad</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reporteData.afectaciones?.map((a: any) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{a.nombre}</td>
                      <td className="px-4 py-3">{a.municipio?.nombre || 'Chocó'}</td>
                      <td className="px-4 py-3">{a.tipo}</td>
                      <td className="px-4 py-3 font-bold text-amber-700">{a.severidad}</td>
                      <td className="px-4 py-3">{a.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tipoReporte === 'inventario' && (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Tipo de Ayuda</th>
                    <th className="px-4 py-3">Centro de Acopio</th>
                    <th className="px-4 py-3">Cantidad Actual</th>
                    <th className="px-4 py-3">Peso (kg)</th>
                    <th className="px-4 py-3">Unidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reporteData.inventarios?.map((i: any) => (
                    <tr key={i.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{i.tipoAyuda}</td>
                      <td className="px-4 py-3">{i.centroAcopio?.nombre || 'Centro Central'}</td>
                      <td className="px-4 py-3 font-bold text-purple-700">
                        {Number(i.cantidadActual).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{Number(i.pesoActual).toLocaleString()} kg</td>
                      <td className="px-4 py-3">{i.unidadMedida}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
