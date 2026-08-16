import { z } from 'zod';

export const FiltroReporteSchema = z.object({
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  municipioId: z.number().int().positive().optional(),
  estado: z.string().optional(),
  tipo: z.string().optional()
});

export const ExportarReporteSchema = z.object({
  formato: z.enum(['CSV', 'JSON']).default('CSV'),
  filtros: FiltroReporteSchema.optional()
});

export type FiltroReporte = z.infer<typeof FiltroReporteSchema>;
export type ExportarReporte = z.infer<typeof ExportarReporteSchema>;
