import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearAfectacionDto, ActualizarAfectacionDto } from '../dto/afectacion.dto.js';

export class AfectacionServicio {
  async listarAfectaciones() {
    return prisma.afectacion.findMany({
      include: {
        municipio: true,
        usuarioCreador: true
      },
      orderBy: { fechaRegistro: 'desc' }
    });
  }

  async crearAfectacion(datos: CrearAfectacionDto) {
    return prisma.afectacion.create({
      data: {
        municipioId: datos.municipioId,
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        tipo: datos.tipo,
        severidad: datos.severidad ?? 'MEDIA',
        estado: datos.estado ?? 'ACTIVA',
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        direccion: datos.direccion,
        fechaInicio: new Date(datos.fechaInicio),
        creadoPor: Number(datos.creadoPor)
      },
      include: {
        municipio: true,
        usuarioCreador: true
      }
    });
  }

  async obtenerAfectacion(id: bigint) {
    const afectacion = await prisma.afectacion.findUnique({
      where: { id },
      include: {
        municipio: true,
        usuarioCreador: true
      }
    });

    if (!afectacion) {
      throw new ErrorNoEncontrado('Afectación no encontrada');
    }

    return afectacion;
  }

  async actualizarAfectacion(id: bigint, datos: ActualizarAfectacionDto) {
    const afectacion = await prisma.afectacion.findUnique({ where: { id } });
    if (!afectacion) {
      throw new ErrorNoEncontrado('Afectación no encontrada');
    }

    return prisma.afectacion.update({
      where: { id },
      data: {
        ...datos,
        fechaInicio: datos.fechaInicio ? new Date(datos.fechaInicio) : afectacion.fechaInicio
      },
      include: {
        municipio: true,
        usuarioCreador: true
      }
    });
  }
}
