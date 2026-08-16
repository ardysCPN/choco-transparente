import { Router } from 'express';
import { autenticarToken, requerirPermiso } from '../../autenticacion/middleware/auth.middleware.js';
import { DashboardServicio } from '../servicio/dashboard.servicio.js';
import { responderError, responderExito } from '../../comun/utilidades/respuestas.js';

const router = Router();
const servicio = new DashboardServicio();

// Dashboard administrativo (solo usuarios autenticados)
router.get('/administrativo', autenticarToken, requerirPermiso('SISTEMA_GLOBAL'), async (_req, res) => {
  try {
    const dashboard = await servicio.dashboardAdministrativo();
    return responderExito(res, 'Dashboard administrativo cargado correctamente', dashboard);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al cargar dashboard';
    return responderError(res, mensaje, 'ERROR_DASHBOARD', 500);
  }
});

// Dashboard público (sin autenticación requerida para datos públicos)
router.get('/publico', async (_req, res) => {
  try {
    const dashboard = await servicio.dashboardPublico();
    return responderExito(res, 'Dashboard público cargado correctamente', dashboard);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al cargar dashboard';
    return responderError(res, mensaje, 'ERROR_DASHBOARD', 500);
  }
});

// Estadísticas de inventario
router.get('/inventario', autenticarToken, async (_req, res) => {
  try {
    const estadisticas = await servicio.estadisticasInventario();
    return responderExito(res, 'Estadísticas de inventario cargadas correctamente', estadisticas);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al cargar estadísticas';
    return responderError(res, mensaje, 'ERROR_ESTADISTICAS', 500);
  }
});

// Estadísticas de entregas
router.get('/entregas/:municipioId?', autenticarToken, async (req, res) => {
  try {
    const municipioId = req.params.municipioId ? Number(req.params.municipioId) : undefined;
    const estadisticas = await servicio.estadisticasEntregas(municipioId);
    return responderExito(res, 'Estadísticas de entregas cargadas correctamente', estadisticas);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error al cargar estadísticas';
    return responderError(res, mensaje, 'ERROR_ESTADISTICAS', 500);
  }
});

export default router;
