import { describe, it, expect } from 'vitest';
import { ReportesServicio } from '../src/reportes/servicio/reporte.servicio.js';
import { DashboardServicio } from '../src/dashboards/servicio/dashboard.servicio.js';
import { SincronizacionServicio } from '../src/sincronizacion/servicio/sincronizacion.servicio.js';

describe('Fase 7: dashboards, reportes y sincronización', () => {
  it('debe generar reporte de donaciones', async () => {
    const servicio = new ReportesServicio();
    const reporte = await servicio.reporteDonaciones();

    expect(reporte.total).toBeGreaterThanOrEqual(0);
    expect(reporte.totalDinero).toBeGreaterThanOrEqual(0);
    expect(reporte.por_estado).toBeDefined();
    expect(reporte.donaciones).toBeInstanceOf(Array);
  });

  it('debe generar reporte de gastos', async () => {
    const servicio = new ReportesServicio();
    const reporte = await servicio.reporteGastos();

    expect(reporte.total).toBeGreaterThanOrEqual(0);
    expect(reporte.totalGastos).toBeGreaterThanOrEqual(0);
    expect(reporte.por_estado).toBeDefined();
    expect(reporte.gastos).toBeInstanceOf(Array);
  });

  it('debe generar reporte de beneficiarios', async () => {
    const servicio = new ReportesServicio();
    const reporte = await servicio.reporteBeneficiarios();

    expect(reporte.total).toBeGreaterThanOrEqual(0);
    expect(reporte.totalPersonas).toBeGreaterThanOrEqual(0);
    expect(reporte.por_estado).toBeDefined();
    expect(reporte.beneficiarios).toBeInstanceOf(Array);
  });

  it('debe generar reporte de afectaciones', async () => {
    const servicio = new ReportesServicio();
    const reporte = await servicio.reporteAfectaciones();

    expect(reporte.total).toBeGreaterThanOrEqual(0);
    expect(reporte.por_severidad).toBeDefined();
    expect(reporte.afectaciones).toBeInstanceOf(Array);
  });

  it('debe generar reporte de inventario', async () => {
    const servicio = new ReportesServicio();
    const reporte = await servicio.reporteInventario();

    expect(reporte.total).toBeGreaterThanOrEqual(0);
    expect(reporte.totalCantidad).toBeGreaterThanOrEqual(0);
    expect(reporte.totalPeso).toBeGreaterThanOrEqual(0);
    expect(reporte.por_tipo).toBeDefined();
  });

  it('debe cargar dashboard administrativo', async () => {
    const servicio = new DashboardServicio();
    const dashboard = await servicio.dashboardAdministrativo();

    expect(dashboard.resumen).toBeDefined();
    expect(dashboard.resumen.totalBeneficiarios).toBeGreaterThanOrEqual(0);
    expect(dashboard.resumen.totalDonaciones).toBeGreaterThanOrEqual(0);
    expect(dashboard.pendientes).toBeDefined();
    expect(dashboard.timestamp).toBeInstanceOf(Date);
  });

  it('debe cargar dashboard público', async () => {
    const servicio = new DashboardServicio();
    const dashboard = await servicio.dashboardPublico();

    expect(dashboard.impacto).toBeDefined();
    expect(dashboard.impacto.personasAsistidas).toBeGreaterThanOrEqual(0);
    expect(dashboard.denuncias).toBeDefined();
    expect(dashboard.cobertura_territorial).toBeInstanceOf(Array);
  });

  it('debe cargar estadísticas de inventario', async () => {
    const servicio = new DashboardServicio();
    const estadisticas = await servicio.estadisticasInventario();

    expect(estadisticas.inventario_total).toBeDefined();
    expect(estadisticas.centros_activos).toBeGreaterThanOrEqual(0);
    expect(estadisticas.timestamp).toBeInstanceOf(Date);
  });

  it('debe cargar estadísticas de entregas', async () => {
    const servicio = new DashboardServicio();
    const estadisticas = await servicio.estadisticasEntregas();

    expect(estadisticas.total_entregas).toBeGreaterThanOrEqual(0);
    expect(estadisticas.cantidad_distribuida).toBeGreaterThanOrEqual(0);
    expect(estadisticas.timestamp).toBeInstanceOf(Date);
  });

  it('debe registrar y sincronizar cambios offline', async () => {
    const servicio = new SincronizacionServicio();

    const cambio = await servicio.registrarCambio(
      'CREATE',
      'beneficiario',
      '123',
      { nombre: 'Familia Test' }
    );

    expect(cambio.id).toBeDefined();
    expect(cambio.sincronizado).toBe(false);

    const pendientes = await servicio.obtenerCambiosPendientes();
    expect(pendientes.length).toBeGreaterThan(0);

    const resultado = await servicio.sincronizar();
    expect(resultado.exitosos).toBeGreaterThanOrEqual(0);
  });

  it('debe resolver conflictos offline', async () => {
    const servicio = new SincronizacionServicio();

    const cambioLocal = await servicio.registrarCambio(
      'UPDATE',
      'beneficiario',
      '456',
      { nombre: 'Familia Actualizada Localmente' }
    );

    const cambioRemoto = {
      nombre: 'Familia Actualizada en Servidor',
      timestamp: new Date(Date.now() - 1000)
    };

    const resuelto = await servicio.resolverConflicto(cambioLocal, cambioRemoto);
    expect(resuelto).toBeDefined();
    expect(resuelto.datos).toBeDefined();
  });
});
