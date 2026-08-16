import { prisma } from '../../comun/biblioteca/prisma.js';

export class DashboardServicio {
  async dashboardAdministrativo() {
    const [
      totalBeneficiarios,
      totalDonaciones,
      totalGastos,
      totalAfectaciones,
      donacionesPendientes,
      gastosPendientes,
      solicitudesActivas,
      alberguesDisponibles
    ] = await Promise.all([
      prisma.beneficiario.count(),
      prisma.donacion.count(),
      prisma.gasto.count(),
      prisma.afectacion.count(),
      prisma.donacion.count({ where: { estado: 'PENDIENTE' } }),
      prisma.gasto.count({ where: { estado: 'BORRADOR' } }),
      prisma.solicitudAyuda.count({ where: { estado: 'PENDIENTE' } }),
      prisma.albergue.count({ where: { estado: 'DISPONIBLE' } })
    ]);

    const totalMonetario = await this.calcularTotalMonetario();
    const totalEntregado = await this.calcularTotalEntregado();

    return {
      resumen: {
        totalBeneficiarios,
        totalDonaciones,
        totalGastos,
        totalAfectaciones,
        totalMonetario,
        totalEntregado
      },
      pendientes: {
        donacionesPendientes,
        gastosPendientes,
        solicitudesActivas
      },
      capacidad: {
        alberguesDisponibles
      },
      timestamp: new Date()
    };
  }

  async dashboardPublico() {
    const [
      totalBeneficiarios,
      totalAfectaciones,
      alberguesDisponibles,
      denunciasRecientes,
      totalDonacionesDinero,
      gastos
    ] = await Promise.all([
      prisma.beneficiario.count(),
      prisma.afectacion.count({ where: { estado: 'ACTIVA' } }),
      prisma.albergue.count({ where: { estado: 'DISPONIBLE' } }),
      prisma.denuncia.count({ where: { estado: 'RECIBIDA' } }),
      this.calcularTotalMonetario(),
      prisma.gasto.findMany({ where: { estado: 'APROBADO' } })
    ]);

    const totalGastosAprobados = gastos.reduce((sum, g) => sum + Number(g.monto), 0);

    const municipios = await prisma.municipio.findMany({
      select: {
        id: true,
        nombre: true,
        _count: {
          select: {
            afectaciones: true,
            beneficiarios: true
          }
        }
      }
    });

    return {
      impacto: {
        personasAsistidas: totalBeneficiarios,
        zonasAfectadas: totalAfectaciones,
        alberguesActivos: alberguesDisponibles
      },
      resumen: {
        total_donaciones_dinero: totalDonacionesDinero,
        total_gastos_aprobados: totalGastosAprobados
      },
      denuncias: {
        reportesPendientes: denunciasRecientes
      },
      cobertura_territorial: municipios,
      timestamp: new Date()
    };
  }

  private async calcularTotalMonetario(): Promise<number> {
    const donaciones = await prisma.donacion.findMany({
      where: { tipo: 'DINERO' },
      include: { dinero: true }
    });

    return donaciones.reduce((sum, d) => sum + Number(d.dinero?.monto || 0), 0);
  }

  private async calcularTotalEntregado(): Promise<number> {
    const entregas = await prisma.entregaAyuda.findMany();
    return entregas.reduce((sum, e) => sum + Number(e.cantidad), 0);
  }

  async estadisticasInventario() {
    const inventarios = await prisma.inventario.findMany({
      include: { lotes: true }
    });

    const tiposAyuda = new Map<string, { cantidad: number; peso: number }>();

    inventarios.forEach(inv => {
      const actual = tiposAyuda.get(inv.tipoAyuda) || { cantidad: 0, peso: 0 };
      actual.cantidad += Number(inv.cantidadActual);
      actual.peso += Number(inv.pesoActual);
      tiposAyuda.set(inv.tipoAyuda, actual);
    });

    return {
      inventario_total: Object.fromEntries(tiposAyuda),
      centros_activos: inventarios.length,
      timestamp: new Date()
    };
  }

  async estadisticasEntregas(municipioId?: number) {
    const where: any = municipioId ? { municipioId } : {};
    const entregas = await prisma.entregaAyuda.findMany({
      where,
      include: { beneficiario: true, lote: true }
    });

    const totalCantidad = entregas.reduce((sum, e) => sum + Number(e.cantidad), 0);
    const porBeneficiario = entregas.length;

    return {
      total_entregas: entregas.length,
      cantidad_distribuida: totalCantidad,
      beneficiarios_atendidos: porBeneficiario,
      timestamp: new Date()
    };
  }
}
