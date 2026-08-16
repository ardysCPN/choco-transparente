import { z } from 'zod';

export const CrearRolSchema = z.object({
  nombre: z.string().min(2, 'El nombre del rol es obligatorio'),
  descripcion: z.string().optional(),
  activo: z.boolean().optional().default(true)
});

export const AsignarPermisoRolSchema = z.object({
  permisoId: z.number().int().positive()
});

export type CrearRolDto = z.infer<typeof CrearRolSchema>;
export type AsignarPermisoRolDto = z.infer<typeof AsignarPermisoRolSchema>;
