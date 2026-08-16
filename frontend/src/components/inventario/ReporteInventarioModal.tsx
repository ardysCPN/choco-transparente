import React from 'react';
import { X, FileSpreadsheet, Download, Printer } from 'lucide-react';
import { ItemInventario } from '../../types/inventario.types';
import toast from 'react-hot-toast';

interface ReporteInventarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ItemInventario[];
}

export const ReporteInventarioModal: React.FC<ReporteInventarioModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  if (!isOpen) return null;

  const totalUnidades = items.reduce((sum, i) => sum + Number(i.cantidadActual), 0);
  const totalKilos = items.reduce((sum, i) => sum + Number(i.pesoActual), 0);

  const exportCSV = () => {
    const headers = ['Centro de Acopio', 'Tipo de Ayuda', 'Cantidad (Unidades)', 'Peso (Kg)', 'Ultima Actualizacion'];
    const rows = items.map((i) => [
      `"${i.centroAcopio?.nombre || `Centro #${i.centroAcopioId}`}"`,
      `"${i.tipoAyuda}"`,
      i.cantidadActual,
      i.pesoActual,
      `"${i.fechaActualizacion ? new Date(i.fechaActualizacion).toISOString() : ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_Inventario_Choco_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Reporte CSV descargado exitosamente');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Reporte Oficial de Inventario Departamental</h3>
              <p className="text-xs text-slate-400">
                Chocó Transparente • Auditoría de Ayuda Humanitaria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Imprimir reporte"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido del Reporte */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Registros</span>
              <p className="text-xl font-bold text-slate-900 mt-1">{items.length}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Kits</span>
              <p className="text-xl font-bold text-emerald-700 mt-1">{totalUnidades.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Peso Total</span>
              <p className="text-xl font-bold text-blue-700 mt-1">{totalKilos.toLocaleString()} Kg</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Centro de Acopio</th>
                  <th className="px-4 py-2.5">Tipo de Ayuda</th>
                  <th className="px-4 py-2.5 text-right">Cantidad</th>
                  <th className="px-4 py-2.5 text-right">Peso (Kg)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-400">
                      Sin datos disponibles para el reporte.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        {item.centroAcopio?.nombre || `Centro #${item.centroAcopioId}`}
                      </td>
                      <td className="px-4 py-2.5">{item.tipoAyuda}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-800">
                        {Number(item.cantidadActual).toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-600">
                        {Number(item.pesoActual).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer con Exportación */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <p className="text-xs text-slate-500 font-mono">
            Generado: {new Date().toLocaleString()}
          </p>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar como CSV (Excel)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
