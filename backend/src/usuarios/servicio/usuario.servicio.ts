import bcrypt from 'bcryptjs';
import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearUsuarioDto, ActualizarUsuarioDto } from '../dto/usuario.dto.js';

export class UsuarioServicio {
  async crearUsuario(datos: CrearUsuarioDto) {
    const existeCorreo = await prisma.usuario.findUnique({
      where: { correo: datos.correo }
    });

    if (existeCorreo) {
      throw new Error('EL_USUARIO_YA_EXISTE');
    }

    const existeDocumento = await prisma.usuario.findUnique({
      where: { documento: datos.documento }
    });

    if (existeDocumento) {
      throw new Error('EL_DOCUMENTO_YA_EXISTE');
    }

    const contrasenaHash = await bcrypt.hash(datos.contrasena, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        apellido: datos.apellido,
        correo: datos.correo,
        telefono: datos.telefono,
        documento: datos.documento,
        contrasenaHash,
        rolId: datos.rolId,
        municipioId: datos.municipioId,
        organizacionId: datos.organizacionId ? Number(datos.organizacionId) : null
      },
      include: {
        rol: true
      }
    });

    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: usuario.rol.nombre,
      activo: usuario.activo
    };
  }

  async listarUsuarios() {
    return prisma.usuario.findMany({
      include: {
        rol: true,
        municipio: true,
        organizacion: true
      }
    });
  }

  async obtenerUsuarioPorId(id: bigint) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: {
        rol: true,
        municipio: true,
        organizacion: true
      }
    });

    if (!usuario) {
      throw new ErrorNoEncontrado('Usuario no encontrado');
    }

    return usuario;
  }

  async actualizarUsuario(id: bigint, datos: ActualizarUsuarioDto) {
    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      throw new ErrorNoEncontrado('Usuario no encontrado');
    }

    const datosActualizacion: any = { ...datos };

    if (datos.contrasena) {
      datosActualizacion.contrasenaHash = await bcrypt.hash(datos.contrasena, 10);
      delete datosActualizacion.contrasena;
    }

    if (datos.organizacionId) {
      datosActualizacion.organizacionId = Number(datos.organizacionId);
    }

    return prisma.usuario.update({
      where: { id },
      data: datosActualizacion,
      include: {
        rol: true
      }
    });
  }

  async cambiarEstado(id: bigint, activo: boolean) {
    return prisma.usuario.update({
      where: { id },
      data: { activo },
      include: { rol: true }
    });
  }
}
