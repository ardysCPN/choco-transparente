import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';

export class OrganizacionServicio {
  async listarOrganizaciones() {
    return prisma.organizacion.findMany({
      orderBy: { fechaActualizacion: 'desc' }
    });
  }

  async obtenerOrganizacion(id: bigint) {
    const org = await prisma.organizacion.findUnique({ where: { id } });
    if (!org) {
      throw new ErrorNoEncontrado('Organización no encontrada');
    }
    return org;
  }

  async crearOrganizacion(datos: any) {
    return prisma.organizacion.create({ data: datos });
  }
}
