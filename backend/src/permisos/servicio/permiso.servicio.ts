import { prisma } from '../../comun/biblioteca/prisma.js';

export class PermisoServicio {
  async listarPermisos() {
    return prisma.permiso.findMany();
  }
}
