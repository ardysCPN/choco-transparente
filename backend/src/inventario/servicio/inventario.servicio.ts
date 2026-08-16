import { prisma } from '../../comun/biblioteca/prisma.js';
import { ErrorNoEncontrado } from '../../comun/errores/errores.js';
import type { RegistrarEntradaDto, RegistrarSalidaDto } from '../dto/inventario.dto.js';

export class InventarioServicio {
  async listarInventarioPorCentro(centroAcopioId: bigint) {
    return prisma.inventario.findMany({
      where: { centroAcopioId },
      orderBy: { fechaActualizacion: 'desc' }
    });
  }

  async registrarEntrada(datos: RegistrarEntradaDto) {
    const centro = await prisma.centroAcopio.findUnique({ where: { id: datos.centroAcopioId } });
    if (!centro) {
      throw new ErrorNoEncontrado('Centro de acopio no encontrado');
    }

    const inventario = await prisma.inventario.upsert({
      where: {
        centroAcopioId_tipoAyuda: {
          centroAcopioId: datos.centroAcopioId,
          tipoAyuda: datos.tipoAyuda
        }
      },
      update: {
        cantidadActual: { increment: Number(datos.cantidad) },
        pesoActual: { increment: Number(datos.peso ?? 0) },
        fechaActualizacion: new Date()
      },
      create: {
        centroAcopioId: datos.centroAcopioId,
        municipioId: centro.municipioId,
        tipoAyuda: datos.tipoAyuda,
        unidadMedida: 'UNIDAD',
        cantidadActual: Number(datos.cantidad),
        pesoActual: Number(datos.peso ?? 0)
      }
    });

    return prisma.entradaInventario.create({
      data: {
        centroAcopioId: datos.centroAcopioId,
        loteId: datos.loteId ?? null,
        tipoAyuda: datos.tipoAyuda,
        cantidad: Number(datos.cantidad),
        peso: Number(datos.peso ?? 0),
        origen: datos.origen,
        numeroDocumento: datos.numeroDocumento ?? null,
        fotoCamion: datos.fotoCamion ?? null,
        usuarioId: Number(datos.usuarioId),
        identificadorOffline: datos.identificadorOffline ?? null
      },
      include: {
        centroAcopio: true
      }
    });
  }

  async registrarSalida(datos: RegistrarSalidaDto) {
    const centro = await prisma.centroAcopio.findUnique({ where: { id: datos.centroAcopioId } });
    if (!centro) {
      throw new ErrorNoEncontrado('Centro de acopio no encontrado');
    }

    const inventario = await prisma.inventario.findUnique({
      where: {
        centroAcopioId_tipoAyuda: {
          centroAcopioId: datos.centroAcopioId,
          tipoAyuda: datos.tipoAyuda
        }
      }
    });

    if (!inventario) {
      throw new ErrorNoEncontrado('No existe inventario para este tipo de ayuda');
    }

    const cantidadSalida = Number(datos.cantidad);
    if (Number(inventario.cantidadActual) < cantidadSalida) {
      throw new Error('Inventario insuficiente para la salida solicitada');
    }

    await prisma.inventario.update({
      where: { id: inventario.id },
      data: {
        cantidadActual: { decrement: cantidadSalida },
        pesoActual: { decrement: Number(datos.peso ?? 0) },
        fechaActualizacion: new Date()
      }
    });

    return prisma.salidaInventario.create({
      data: {
        centroAcopioId: datos.centroAcopioId,
        loteId: datos.loteId ?? null,
        cantidad: Number(datos.cantidad),
        peso: Number(datos.peso ?? 0),
        beneficiarioId: datos.beneficiarioId ? Number(datos.beneficiarioId) : null,
        municipioId: datos.municipioId,
        barrio: datos.barrio ?? null,
        fotoEntrega: datos.fotoEntrega,
        usuarioId: Number(datos.usuarioId),
        identificadorOffline: datos.identificadorOffline ?? null
      },
      include: {
        centroAcopio: true,
        beneficiario: true
      }
    });
  }
}
