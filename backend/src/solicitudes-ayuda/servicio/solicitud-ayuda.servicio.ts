import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearSolicitudAyudaDto, ActualizarSolicitudAyudaDto } from '../dto/solicitud-ayuda.dto.js';

export class SolicitudAyudaServicio {
  async listarSolicitudes() {
    return prisma.solicitudAyuda.findMany({
      include: { beneficiario: true, afectacion: true },
      orderBy: { fechaSolicitud: 'desc' }
    });
  }

  async crearSolicitud(datos: CrearSolicitudAyudaDto) {
    const beneficiario = await prisma.beneficiario.findUnique({ where: { id: datos.beneficiarioId } });
    if (!beneficiario) {
      throw new ErrorNoEncontrado('Beneficiario no encontrado');
    }

    const afectacion = await prisma.afectacion.findUnique({ where: { id: datos.afectacionId } });
    if (!afectacion) {
      throw new ErrorNoEncontrado('Afectación no encontrada');
    }

    return prisma.solicitudAyuda.create({
      data: {
        beneficiarioId: datos.beneficiarioId,
        afectacionId: datos.afectacionId,
        tipoNecesidad: datos.tipoNecesidad,
        prioridad: datos.prioridad ?? 'MEDIA',
        descripcion: datos.descripcion ?? null,
        cantidadSolicitada: Number(datos.cantidadSolicitada),
        evidencia: datos.evidencia ?? null,
        estado: datos.estado ?? 'PENDIENTE'
      },
      include: {
        beneficiario: true,
        afectacion: true
      }
    });
  }

  async obtenerSolicitud(id: bigint) {
    const solicitud = await prisma.solicitudAyuda.findUnique({
      where: { id },
      include: { beneficiario: true, afectacion: true }
    });

    if (!solicitud) {
      throw new ErrorNoEncontrado('Solicitud no encontrada');
    }

    return solicitud;
  }

  async actualizarSolicitud(id: bigint, datos: ActualizarSolicitudAyudaDto) {
    const solicitud = await prisma.solicitudAyuda.findUnique({ where: { id } });
    if (!solicitud) {
      throw new ErrorNoEncontrado('Solicitud no encontrada');
    }

    return prisma.solicitudAyuda.update({
      where: { id },
      data: {
        ...datos,
        cantidadSolicitada: datos.cantidadSolicitada ? Number(datos.cantidadSolicitada) : solicitud.cantidadSolicitada
      },
      include: { beneficiario: true, afectacion: true }
    });
  }
}
