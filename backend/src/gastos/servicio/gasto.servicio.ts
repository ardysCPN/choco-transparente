import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearGastoDto, ActualizarGastoDto } from '../dto/gasto.dto.js';

export class GastoServicio {
  async listarGastos() {
    return prisma.gasto.findMany({
      include: { organizacion: true },
      orderBy: { fecha: 'desc' }
    });
  }

  async crearGasto(datos: CrearGastoDto, usuarioId: bigint) {
    const organizacion = await prisma.organizacion.findUnique({
      where: { id: BigInt(datos.organizacionId) }
    });

    if (!organizacion) {
      throw new ErrorNoEncontrado('Organización no encontrada');
    }

    return prisma.gasto.create({
      data: {
        organizacionId: BigInt(datos.organizacionId),
        concepto: datos.concepto,
        monto: datos.monto,
        proveedor: datos.proveedor,
        numeroFactura: datos.numeroFactura,
        fecha: new Date(datos.fecha),
        soporte: datos.soporte,
        estado: 'BORRADOR',
        creadoPor: usuarioId
      },
      include: { organizacion: true }
    });
  }

  async obtenerGasto(id: bigint) {
    const gasto = await prisma.gasto.findUnique({
      where: { id },
      include: { organizacion: true }
    });

    if (!gasto) {
      throw new ErrorNoEncontrado('Gasto no encontrado');
    }

    return gasto;
  }

  async actualizarGasto(id: bigint, datos: ActualizarGastoDto) {
    const gasto = await prisma.gasto.findUnique({ where: { id } });
    if (!gasto) {
      throw new ErrorNoEncontrado('Gasto no encontrado');
    }

    return prisma.gasto.update({
      where: { id },
      data: {
        concepto: datos.concepto ?? gasto.concepto,
        monto: datos.monto ?? gasto.monto,
        proveedor: datos.proveedor ?? gasto.proveedor,
        numeroFactura: datos.numeroFactura ?? gasto.numeroFactura,
        soporte: datos.soporte ?? gasto.soporte
      },
      include: { organizacion: true }
    });
  }

  async aprobarGasto(id: bigint, accion: 'APROBAR' | 'RECHAZAR', usuarioId: bigint) {
    const gasto = await prisma.gasto.findUnique({ where: { id } });
    if (!gasto) {
      throw new ErrorNoEncontrado('Gasto no encontrado');
    }

    const nuevoEstado = accion === 'APROBAR' ? 'APROBADO' : 'RECHAZADO';

    return prisma.gasto.update({
      where: { id },
      data: {
        estado: nuevoEstado,
        aprobadoPor: usuarioId
      },
      include: { organizacion: true }
    });
  }

  async listarPorOrganizacion(organizacionId: bigint) {
    return prisma.gasto.findMany({
      where: { organizacionId },
      include: { organizacion: true },
      orderBy: { fecha: 'desc' }
    });
  }
}
