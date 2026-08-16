import { z } from 'zod';

export const CrearDonacionDineroSchema = z.object({
  donante: z.string().min(2, 'El nombre del donante es obligatorio'),
  monto: z.number().positive('El monto debe ser mayor a 0'),
  cuentaDestino: z.string().min(5, 'La cuenta destino es obligatoria'),
  referencia: z.string().min(2, 'La referencia es obligatoria'),
  municipioId: z.number().int().positive().optional(),
  organizacionId: z.number().int().positive().optional(),
  descripcion: z.string().optional()
});

export const CrearDonacionEspecieSchema = z.object({
  donante: z.string().min(2, 'El nombre del donante es obligatorio'),
  tipoAyuda: z.string().min(2, 'El tipo de ayuda es obligatorio'),
  cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
  peso: z.number().positive().optional(),
  unidadMedida: z.string().min(1, 'La unidad de medida es obligatoria'),
  municipioId: z.number().int().positive().optional(),
  organizacionId: z.number().int().positive().optional(),
  descripcion: z.string().optional()
});

export const ActualizarDonacionSchema = z.object({
  estado: z.enum(['PENDIENTE', 'RECIBIDO', 'RECHAZADO']).optional()
});

export type CrearDonacionDineroDto = z.infer<typeof CrearDonacionDineroSchema>;
export type CrearDonacionEspecieDto = z.infer<typeof CrearDonacionEspecieSchema>;
export type ActualizarDonacionDto = z.infer<typeof ActualizarDonacionSchema>;
