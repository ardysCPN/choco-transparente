import { Router } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { FiltroReporteSchema, ExportarReporteSchema } from '../dto/reporte.dto.js';
import { ReportesServicio } from '../servicio/reporte.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new ReportesServicio();

router.use(autenticarToken);

// Reporte de donaciones
router.get('/donaciones', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const filtros = FiltroReporteSchema.parse(req.query);
    const reporte = await servicio.reporteDonaciones(filtros);
    return responderExito(res, 'Reporte de donaciones generado correctamente', reporte);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al generar reporte';
    return responderError(res, mensaje, 'ERROR_REPORTE', 400);
  }
});

// Reporte de gastos
router.get('/gastos', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const filtros = FiltroReporteSchema.parse(req.query);
    const reporte = await servicio.reporteGastos(filtros);
    return responderExito(res, 'Reporte de gastos generado correctamente', reporte);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al generar reporte';
    return responderError(res, mensaje, 'ERROR_REPORTE', 400);
  }
});

// Reporte de beneficiarios
router.get('/beneficiarios', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const filtros = FiltroReporteSchema.parse(req.query);
    const reporte = await servicio.reporteBeneficiarios(filtros);
    return responderExito(res, 'Reporte de beneficiarios generado correctamente', reporte);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al generar reporte';
    return responderError(res, mensaje, 'ERROR_REPORTE', 400);
  }
});

// Reporte de afectaciones
router.get('/afectaciones', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const filtros = FiltroReporteSchema.parse(req.query);
    const reporte = await servicio.reporteAfectaciones(filtros);
    return responderExito(res, 'Reporte de afectaciones generado correctamente', reporte);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al generar reporte';
    return responderError(res, mensaje, 'ERROR_REPORTE', 400);
  }
});

// Reporte de inventario
router.get('/inventario', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const reporte = await servicio.reporteInventario();
    return responderExito(res, 'Reporte de inventario generado correctamente', reporte);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al generar reporte';
    return responderError(res, mensaje, 'ERROR_REPORTE', 400);
  }
});

// Exportar reporte en CSV/JSON
router.post('/exportar', requerirPermiso('SISTEMA_GLOBAL'), async (req, res) => {
  try {
    const config = ExportarReporteSchema.parse(req.body);
    
    let datos: any = {};
    if (config.filtros?.tipo === 'donaciones' || !config.filtros?.tipo) {
      datos.donaciones = await servicio.reporteDonaciones(config.filtros);
    }
    if (config.filtros?.tipo === 'gastos' || !config.filtros?.tipo) {
      datos.gastos = await servicio.reporteGastos(config.filtros);
    }

    if (config.formato === 'CSV') {
      // Convertir a CSV simple
      const csv = JSON.stringify(datos, null, 2);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="reporte.csv"');
      res.send(csv);
    } else {
      return responderExito(res, 'Reporte exportado correctamente', datos);
    }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al exportar reporte';
    return responderError(res, mensaje, 'ERROR_EXPORTAR', 400);
  }
});

export default router;
