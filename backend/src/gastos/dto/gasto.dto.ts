import { z } from 'zod';

export const CrearGastoSchema = z.object({
  organizacionId: z.number().int().positive(),
  concepto: z.string().min(5, 'El concepto es obligatorio'),
  monto: z.number().positive('El monto debe ser mayor a 0'),
  proveedor: z.string().min(2, 'El proveedor es obligatorio'),
  numeroFactura: z.string().min(1, 'El número de factura es obligatorio'),
  fecha: z.string().refine((date) => !isNaN(Date.parse(date)), 'Formato de fecha inválido'),
  soporte: z.string().url('El soporte debe ser una URL válida')
});

export const ActualizarGastoSchema = CrearGastoSchema.partial();

export const AprobarGastoSchema = z.object({
  accion: z.enum(['APROBAR', 'RECHAZAR']),
  observaciones: z.string().optional()
});

export type CrearGastoDto = z.infer<typeof CrearGastoSchema>;
export type ActualizarGastoDto = z.infer<typeof ActualizarGastoSchema>;
export type AprobarGastoDto = z.infer<typeof AprobarGastoSchema>;
