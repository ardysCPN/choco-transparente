import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearRolDto, AsignarPermisoRolDto } from '../dto/rol.dto.js';

export class RolServicio {
  async listarRoles() {
    return prisma.rol.findMany({
      include: {
        permisos: {
          include: {
            permiso: true
          }
        }
      }
    });
  }

  async crearRol(datos: CrearRolDto) {
    return prisma.rol.create({
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        activo: datos.activo ?? true
      },
      include: {
        permisos: {
          include: {
            permiso: true
          }
        }
      }
    });
  }

  async obtenerRol(id: number) {
    const rol = await prisma.rol.findUnique({
      where: { id },
      include: {
        permisos: {
          include: {
            permiso: true
          }
        }
      }
    });

    if (!rol) {
      throw new ErrorNoEncontrado('Rol no encontrado');
    }

    return rol;
  }

  async asignarPermisoRol(id: number, datos: AsignarPermisoRolDto) {
    const rol = await prisma.rol.findUnique({ where: { id } });
    if (!rol) {
      throw new ErrorNoEncontrado('Rol no encontrado');
    }

    const permiso = await prisma.permiso.findUnique({ where: { id: datos.permisoId } });
    if (!permiso) {
      throw new ErrorNoEncontrado('Permiso no encontrado');
    }

    return prisma.rolPermiso.create({
      data: {
        rolId: id,
        permisoId: datos.permisoId
      },
      include: {
        permiso: true,
        rol: true
      }
    });
  }
}
