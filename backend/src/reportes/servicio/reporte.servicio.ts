import { prisma } from '../../comun/biblioteca/prisma.js';
import type { FiltroReporte } from '../dto/reporte.dto.js';

export class ReportesServicio {
  async reporteDonaciones(filtros?: FiltroReporte) {
    const where: any = {};

    if (filtros?.fechaInicio && filtros?.fechaFin) {
      where.fecha = {
        gte: new Date(filtros.fechaInicio),
        lte: new Date(filtros.fechaFin)
      };
    }

    if (filtros?.municipioId) {
      where.municipioId = filtros.municipioId;
    }

    if (filtros?.estado) {
      where.estado = filtros.estado;
    }

    const donaciones = await prisma.donacion.findMany({
      where,
      include: {
        dinero: true,
        especie: true,
        organizacion: true
      },
      orderBy: { fecha: 'desc' }
    });

    const totalDinero = donaciones
      .filter(d => d.dinero)
      .reduce((sum, d) => sum + Number(d.dinero?.monto || 0), 0);

    return {
      total: donaciones.length,
      totalDinero,
      por_estado: this.agruparPor(donaciones, 'estado'),
      por_tipo: this.agruparPor(donaciones, 'tipo'),
      donaciones
    };
  }

  async reporteGastos(filtros?: FiltroReporte) {
    const where: any = {};

    if (filtros?.fechaInicio && filtros?.fechaFin) {
      where.fecha = {
        gte: new Date(filtros.fechaInicio),
        lte: new Date(filtros.fechaFin)
      };
    }

    if (filtros?.estado) {
      where.estado = filtros.estado;
    }

    const gastos = await prisma.gasto.findMany({
      where,
      include: { organizacion: true },
      orderBy: { fecha: 'desc' }
    });

    const totalGastos = gastos.reduce((sum, g) => sum + Number(g.monto), 0);

    return {
      total: gastos.length,
      totalGastos,
      por_estado: this.agruparPor(gastos, 'estado'),
      gastos
    };
  }

  async reporteBeneficiarios(filtros?: FiltroReporte) {
    const where: any = {};

    if (filtros?.municipioId) {
      where.municipioId = filtros.municipioId;
    }

    if (filtros?.estado) {
      where.estado = filtros.estado;
    }

    const beneficiarios = await prisma.beneficiario.findMany({
      where,
      include: { municipio: true },
      orderBy: { fechaRegistro: 'desc' }
    });

    const totalPersonas = beneficiarios.reduce((sum, b) => sum + (b.cantidadPersonas || 0), 0);

    return {
      total: beneficiarios.length,
      totalPersonas,
      por_estado: this.agruparPor(beneficiarios, 'estado'),
      beneficiarios
    };
  }

  async reporteAfectaciones(filtros?: FiltroReporte) {
    const where: any = {};

    if (filtros?.municipioId) {
      where.municipioId = filtros.municipioId;
    }

    if (filtros?.estado) {
      where.estado = filtros.estado;
    }

    const afectaciones = await prisma.afectacion.findMany({
      where,
      include: {
        municipio: true,
        usuarioCreador: true,
        solicitudes: true
      },
      orderBy: { fechaRegistro: 'desc' }
    });

    const porSeveridad = this.agruparPor(afectaciones, 'severidad');

    return {
      total: afectaciones.length,
      por_severidad: porSeveridad,
      por_estado: this.agruparPor(afectaciones, 'estado'),
      afectaciones
    };
  }

  async reporteInventario(filtros?: FiltroReporte) {
    const inventarios = await prisma.inventario.findMany({
      include: {
        centroAcopio: true,
        lotes: true
      },
      orderBy: { fechaActualizacion: 'desc' }
    });

    const totalCantidad = inventarios.reduce((sum, inv) => sum + Number(inv.cantidadActual), 0);
    const totalPeso = inventarios.reduce((sum, inv) => sum + Number(inv.pesoActual), 0);

    return {
      total: inventarios.length,
      totalCantidad,
      totalPeso,
      por_tipo: this.agruparPor(inventarios, 'tipoAyuda'),
      inventarios
    };
  }

  private agruparPor(items: any[], campo: string): Record<string, number> {
    const agrupado: Record<string, number> = {};
    items.forEach(item => {
      const valor = item[campo];
      agrupado[valor] = (agrupado[valor] || 0) + 1;
    });
    return agrupado;
  }
}
