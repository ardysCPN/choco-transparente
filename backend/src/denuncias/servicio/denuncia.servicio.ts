import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearDenunciaDto, ActualizarDenunciaDto } from '../dto/denuncia.dto.js';

export class DenunciaServicio {
  async listarDenuncias() {
    return prisma.denuncia.findMany({
      include: { municipio: true },
      orderBy: { fecha: 'desc' }
    });
  }

  async crearDenuncia(datos: CrearDenunciaDto) {
    const municipio = await prisma.municipio.findUnique({ where: { id: datos.municipioId } });
    if (!municipio) {
      throw new ErrorNoEncontrado('Municipio no encontrado');
    }

    return prisma.denuncia.create({
      data: {
        tipo: datos.tipo,
        descripcion: datos.descripcion,
        municipioId: datos.municipioId,
        barrio: datos.barrio ?? null,
        latitud: datos.latitud ?? null,
        longitud: datos.longitud ?? null,
        evidencia: datos.evidencia ?? null,
        estado: datos.estado ?? 'RECIBIDA',
        respuesta: datos.respuesta ?? null,
        identificadorOffline: datos.identificadorOffline ?? null
      },
      include: { municipio: true }
    });
  }

  async obtenerDenuncia(id: bigint) {
    const denuncia = await prisma.denuncia.findUnique({
      where: { id },
      include: { municipio: true }
    });

    if (!denuncia) {
      throw new ErrorNoEncontrado('Denuncia no encontrada');
    }

    return denuncia;
  }

  async actualizarDenuncia(id: bigint, datos: ActualizarDenunciaDto) {
    const denuncia = await prisma.denuncia.findUnique({ where: { id } });
    if (!denuncia) {
      throw new ErrorNoEncontrado('Denuncia no encontrada');
    }

    return prisma.denuncia.update({
      where: { id },
      data: {
        ...datos,
        latitud: datos.latitud ?? denuncia.latitud,
        longitud: datos.longitud ?? denuncia.longitud,
        respuesta: datos.respuesta ?? denuncia.respuesta
      },
      include: { municipio: true }
    });
  }
}
