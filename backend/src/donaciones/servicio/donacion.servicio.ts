import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { CrearDonacionDineroDto, CrearDonacionEspecieDto, ActualizarDonacionDto } from '../dto/donacion.dto.js';

export class DonacionServicio {
  async listarDonaciones() {
    return prisma.donacion.findMany({
      include: {
        dinero: true,
        especie: true,
        organizacion: true
      },
      orderBy: { fecha: 'desc' }
    });
  }

  async crearDonacionDinero(datos: CrearDonacionDineroDto) {
    const donacion = await prisma.donacion.create({
      data: {
        tipo: 'DINERO',
        donante: datos.donante,
        monto: datos.monto,
        municipioId: datos.municipioId,
        organizacionId: datos.organizacionId,
        descripcion: datos.descripcion,
        estado: 'PENDIENTE',
        dinero: {
          create: {
            cuentaDestino: datos.cuentaDestino,
            referencia: datos.referencia,
            monto: datos.monto,
            soporteArchivo: 'soporte_pendiente.pdf'
          }
        }
      },
      include: {
        dinero: true,
        organizacion: true
      }
    });

    return donacion;
  }

  async crearDonacionEspecie(datos: CrearDonacionEspecieDto) {
    const donacion = await prisma.donacion.create({
      data: {
        tipo: 'ESPECIE',
        donante: datos.donante,
        municipioId: datos.municipioId,
        organizacionId: datos.organizacionId,
        descripcion: datos.descripcion,
        estado: 'PENDIENTE',
        especie: {
          create: {
            tipoAyuda: datos.tipoAyuda,
            cantidad: datos.cantidad,
            peso: datos.peso,
            unidadMedida: datos.unidadMedida
          }
        }
      },
      include: {
        especie: true,
        organizacion: true
      }
    });

    return donacion;
  }

  async obtenerDonacion(id: bigint) {
    const donacion = await prisma.donacion.findUnique({
      where: { id },
      include: {
        dinero: true,
        especie: true,
        organizacion: true
      }
    });

    if (!donacion) {
      throw new ErrorNoEncontrado('Donación no encontrada');
    }

    return donacion;
  }

  async actualizarEstadoDonacion(id: bigint, datos: ActualizarDonacionDto) {
    const donacion = await prisma.donacion.findUnique({ where: { id } });
    if (!donacion) {
      throw new ErrorNoEncontrado('Donación no encontrada');
    }

    return prisma.donacion.update({
      where: { id },
      data: { estado: datos.estado },
      include: {
        dinero: true,
        especie: true,
        organizacion: true
      }
    });
  }
}
