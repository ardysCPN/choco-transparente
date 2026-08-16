import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearEntregaAyudaDto, ActualizarEntregaAyudaDto } from '../dto/entrega-ayuda.dto.js';

export class EntregaAyudaServicio {
  async listarEntregas() {
    return prisma.entregaAyuda.findMany({
      include: { beneficiario: true, solicitud: true },
      orderBy: { fecha: 'desc' }
    });
  }

  async crearEntrega(datos: CrearEntregaAyudaDto) {
    const beneficiario = await prisma.beneficiario.findUnique({ where: { id: datos.beneficiarioId } });
    if (!beneficiario) {
      throw new ErrorNoEncontrado('Beneficiario no encontrado');
    }

    return prisma.entregaAyuda.create({
      data: {
        solicitudId: datos.solicitudId ?? null,
        beneficiarioId: datos.beneficiarioId,
        loteId: datos.loteId ?? null,
        cantidad: Number(datos.cantidad),
        responsableEntrega: Number(datos.responsableEntrega),
        evidencia: datos.evidencia,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        observaciones: datos.observaciones ?? null
      },
      include: {
        beneficiario: true,
        solicitud: true
      }
    });
  }

  async obtenerEntrega(id: bigint) {
    const entrega = await prisma.entregaAyuda.findUnique({
      where: { id },
      include: { beneficiario: true, solicitud: true }
    });

    if (!entrega) {
      throw new ErrorNoEncontrado('Entrega de ayuda no encontrada');
    }

    return entrega;
  }

  async actualizarEntrega(id: bigint, datos: ActualizarEntregaAyudaDto) {
    const entrega = await prisma.entregaAyuda.findUnique({ where: { id } });
    if (!entrega) {
      throw new ErrorNoEncontrado('Entrega de ayuda no encontrada');
    }

    return prisma.entregaAyuda.update({
      where: { id },
      data: {
        ...datos,
        cantidad: datos.cantidad ? Number(datos.cantidad) : entrega.cantidad,
        latitud: datos.latitud ?? entrega.latitud,
        longitud: datos.longitud ?? entrega.longitud,
        responsableEntrega: datos.responsableEntrega ? Number(datos.responsableEntrega) : entrega.responsableEntrega
      },
      include: { beneficiario: true, solicitud: true }
    });
  }
}
