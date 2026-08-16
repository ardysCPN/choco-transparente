import { z } from 'zod';

export const CrearUsuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  apellido: z.string().min(2, 'El apellido es obligatorio'),
  correo: z.string().email('El correo debe ser válido'),
  telefono: z.string().optional(),
  documento: z.string().min(6, 'El documento es obligatorio'),
  contrasena: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rolId: z.number().int().positive(),
  municipioId: z.number().int().positive().optional(),
  organizacionId: z.coerce.bigint().optional()
});

export const ActualizarUsuarioSchema = CrearUsuarioSchema.partial();

export type CrearUsuarioDto = z.infer<typeof CrearUsuarioSchema>;
export type ActualizarUsuarioDto = z.infer<typeof ActualizarUsuarioSchema>;
