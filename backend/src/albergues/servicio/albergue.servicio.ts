import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearAlbergueDto, ActualizarAlbergueDto } from '../dto/albergue.dto.js';

export class AlbergueServicio {
  async listarAlbergues() {
    return prisma.albergue.findMany({
      include: { municipio: true },
      orderBy: { fechaActualizacion: 'desc' }
    });
  }

  async crearAlbergue(datos: CrearAlbergueDto) {
    const municipio = await prisma.municipio.findUnique({ where: { id: datos.municipioId } });
    if (!municipio) {
      throw new ErrorNoEncontrado('Municipio no encontrado');
    }

    return prisma.albergue.create({
      data: {
        municipioId: datos.municipioId,
        nombre: datos.nombre,
        direccion: datos.direccion,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        capacidad: datos.capacidad,
        ocupacion: datos.ocupacion ?? 0,
        responsable: datos.responsable,
        telefono: datos.telefono,
        servicios: datos.servicios ?? null,
        estado: datos.estado ?? 'DISPONIBLE'
      },
      include: { municipio: true }
    });
  }

  async obtenerAlbergue(id: bigint) {
    const albergue = await prisma.albergue.findUnique({
      where: { id },
      include: { municipio: true }
    });

    if (!albergue) {
      throw new ErrorNoEncontrado('Albergue no encontrado');
    }

    return albergue;
  }

  async actualizarAlbergue(id: bigint, datos: ActualizarAlbergueDto) {
    const albergue = await prisma.albergue.findUnique({ where: { id } });
    if (!albergue) {
      throw new ErrorNoEncontrado('Albergue no encontrado');
    }

    return prisma.albergue.update({
      where: { id },
      data: {
        ...datos,
        latitud: datos.latitud ?? albergue.latitud,
        longitud: datos.longitud ?? albergue.longitud,
        ocupacion: datos.ocupacion ?? albergue.ocupacion ?? 0
      },
      include: { municipio: true }
    });
  }
}
