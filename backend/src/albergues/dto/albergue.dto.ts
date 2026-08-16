import { z } from 'zod';

export const CrearAlbergueSchema = z.object({
  municipioId: z.number().int().positive(),
  nombre: z.string().min(2, 'El nombre del albergue es obligatorio'),
  direccion: z.string().min(2, 'La dirección es obligatoria'),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
  capacidad: z.number().int().positive(),
  ocupacion: z.number().int().nonnegative().optional().default(0),
  responsable: z.string().min(2, 'El responsable es obligatorio'),
  telefono: z.string().min(5, 'El teléfono es obligatorio'),
  servicios: z.string().optional(),
  estado: z.enum(['DISPONIBLE', 'LLENO', 'CERRADO']).optional().default('DISPONIBLE')
});

export const ActualizarAlbergueSchema = CrearAlbergueSchema.partial();

export type CrearAlbergueDto = z.infer<typeof CrearAlbergueSchema>;
export type ActualizarAlbergueDto = z.infer<typeof ActualizarAlbergueSchema>;
