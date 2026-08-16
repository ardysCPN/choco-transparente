import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearMunicipioDto, ActualizarMunicipioDto } from '../dto/municipio.dto.js';

export class MunicipioServicio {
  async listarMunicipios() {
    return prisma.municipio.findMany({
      orderBy: { nombre: 'asc' }
    });
  }

  async crearMunicipio(datos: CrearMunicipioDto) {
    const existe = await prisma.municipio.findFirst({
      where: {
        OR: [
          { codigoDane: datos.codigoDane },
          { nombre: { equals: datos.nombre.trim(), mode: 'insensitive' } }
        ]
      }
    });

    if (existe) {
      return existe;
    }

    return prisma.municipio.create({
      data: {
        departamentoId: datos.departamentoId,
        codigoDane: datos.codigoDane,
        nombre: datos.nombre.trim().toUpperCase(),
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        estado: datos.estado ?? true
      }
    });
  }

  async obtenerMunicipio(id: number) {
    const municipio = await prisma.municipio.findUnique({ where: { id } });

    if (!municipio) {
      throw new ErrorNoEncontrado('Municipio no encontrado');
    }

    return municipio;
  }

  async actualizarMunicipio(id: number, datos: ActualizarMunicipioDto) {
    const municipio = await prisma.municipio.findUnique({ where: { id } });
    if (!municipio) {
      throw new ErrorNoEncontrado('Municipio no encontrado');
    }

    return prisma.municipio.update({
      where: { id },
      data: {
        ...datos,
        latitud: datos.latitud ?? municipio.latitud,
        longitud: datos.longitud ?? municipio.longitud,
        estado: datos.estado ?? municipio.estado
      }
    });
  }
}
