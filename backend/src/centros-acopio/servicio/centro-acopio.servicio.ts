import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearCentroAcopioDto, ActualizarCentroAcopioDto, AuditarCentroAcopioDto } from '../dto/centro-acopio.dto.js';

export class CentroAcopioServicio {
  async listarCentros() {
    return prisma.centroAcopio.findMany({
      include: {
        municipio: true,
        organizacion: true
      },
      orderBy: { fechaSolicitud: 'desc' }
    });
  }

  async crearCentro(datos: CrearCentroAcopioDto) {
    return prisma.centroAcopio.create({
      data: {
        municipioId: datos.municipioId,
        organizacionId: Number(datos.organizacionId),
        nombre: datos.nombre,
        direccion: datos.direccion,
        barrio: datos.barrio,
        responsable: datos.responsable,
        telefono: datos.telefono,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        fotoFachada: datos.fotoFachada,
        estado: datos.estado ?? 'PENDIENTE'
      },
      include: {
        municipio: true,
        organizacion: true
      }
    });
  }

  async obtenerCentro(id: bigint) {
    const centro = await prisma.centroAcopio.findUnique({
      where: { id },
      include: {
        municipio: true,
        organizacion: true,
        auditorias: true
      }
    });

    if (!centro) {
      throw new ErrorNoEncontrado('Centro de acopio no encontrado');
    }

    return centro;
  }

  async actualizarCentro(id: bigint, datos: ActualizarCentroAcopioDto) {
    const centro = await prisma.centroAcopio.findUnique({ where: { id } });
    if (!centro) {
      throw new ErrorNoEncontrado('Centro de acopio no encontrado');
    }

    return prisma.centroAcopio.update({
      where: { id },
      data: {
        ...datos,
        organizacionId: datos.organizacionId ? Number(datos.organizacionId) : centro.organizacionId,
        latitud: datos.latitud ?? centro.latitud,
        longitud: datos.longitud ?? centro.longitud
      },
      include: {
        municipio: true,
        organizacion: true
      }
    });
  }

  async auditarCentro(id: bigint, datos: AuditarCentroAcopioDto) {
    const centro = await prisma.centroAcopio.findUnique({ where: { id } });
    if (!centro) {
      throw new ErrorNoEncontrado('Centro de acopio no encontrado');
    }

    const centroAuditado = await prisma.centroAcopio.update({
      where: { id },
      data: {
        estado: datos.decision,
        fechaAprobacion: new Date(),
        aprobadoPor: Number(datos.auditorId)
      }
    });

    await prisma.auditoriaCentro.create({
      data: {
        centroAcopioId: id,
        auditorId: Number(datos.auditorId),
        decision: datos.decision,
        comentario: datos.comentario,
        fotoEvidencia: datos.fotoEvidencia,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null
      }
    });

    return centroAuditado;
  }
}
