import { z } from 'zod';

// ==========================================
// FORMULARIOS PÚBLICOS DE PARTICIPACIÓN
// ==========================================

export const SolicitudAyudaPublicaSchema = z.object({
  municipioId: z.number().int().positive('El municipio es obligatorio'),
  barrio: z.string().min(2, 'El barrio o vereda es obligatorio'),
  direccionAproximada: z.string().min(5, 'La dirección o referencia es obligatoria'),
  cantidadPersonas: z.number().int().min(1, 'Debe registrar al menos 1 persona'),
  tipoNecesidad: z.string().min(2, 'El tipo de necesidad es obligatorio'),
  descripcion: z.string().min(10, 'Por favor describa la situación con al menos 10 caracteres'),
  prioridad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA'),
  contacto: z.string().min(7, 'El teléfono de contacto es obligatorio'),
  nombreResponsable: z.string().min(3, 'El nombre del jefe de hogar o contacto es obligatorio'),
  evidencia: z.string().url().optional().or(z.literal('')),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
});

export const ProponerCentroAcopioSchema = z.object({
  municipioId: z.number().int().positive('El municipio es obligatorio'),
  nombre: z.string().min(5, 'El nombre del centro es obligatorio'),
  barrio: z.string().min(2, 'El barrio o vereda es obligatorio'),
  direccion: z.string().min(5, 'La dirección es obligatoria'),
  responsable: z.string().min(3, 'El nombre del responsable es obligatorio'),
  telefono: z.string().min(7, 'El teléfono de contacto es obligatorio'),
  correo: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
  fotoFachada: z.string().url('La foto de fachada debe ser una URL válida').optional().or(z.literal('')),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
});

export const DonacionPublicaSchema = z.object({
  tipo: z.enum(['DINERO', 'ESPECIE']),
  donante: z.string().min(3, 'Nombre o razón social del donante es obligatorio'),
  correo: z.string().email('Correo inválido').optional().or(z.literal('')),
  telefono: z.string().min(7, 'Teléfono de contacto es obligatorio'),
  municipioId: z.number().int().positive().optional(),
  descripcion: z.string().optional(),
  // Si es Dinero
  monto: z.number().positive().optional(),
  referenciaTransferencia: z.string().optional(),
  // Si es Especie
  tipoAyuda: z.string().optional(),
  cantidad: z.number().positive().optional(),
  unidadMedida: z.string().optional(),
  requiereTransporte: z.boolean().default(false),
});

export const VoluntariadoPublicoSchema = z.object({
  nombre: z.string().min(3, 'El nombre completo es obligatorio'),
  municipioId: z.number().int().positive('El municipio es obligatorio'),
  telefono: z.string().min(7, 'El teléfono es obligatorio'),
  correo: z.string().email('Correo electrónico inválido'),
  tipoApoyo: z.enum([
    'CLASIFICACION_KITS',
    'CARGA_DESCARGA',
    'COCINA_COMUNITARIA',
    'ATENCION_PRIMERA_INFANCIA',
    'TRANSPORTE_LOGISTICA',
    'ADMINISTRATIVO_CENSO',
    'OTRO',
  ]),
  disponibilidad: z.string().min(3, 'La disponibilidad horaria es obligatoria'),
  observaciones: z.string().optional(),
});

export const TransportePublicoSchema = z.object({
  nombrePropietario: z.string().min(3, 'Nombre del propietario o conductor es obligatorio'),
  municipioId: z.number().int().positive('El municipio es obligatorio'),
  telefono: z.string().min(7, 'El teléfono es obligatorio'),
  tipoVehiculo: z.enum(['LANCHA_RAPIDA', 'BOTE_MOTOR', 'CAMION_PESADO', 'CAMIONETA_4X4', 'MOTOCARRO', 'OTRO']),
  capacidadCargaKg: z.number().positive('La capacidad de carga debe ser mayor a 0'),
  zonasCobertura: z.string().min(3, 'Las rutas o ríos de cobertura son obligatorios'),
  disponibilidad: z.string().min(3, 'La disponibilidad es obligatoria'),
  observaciones: z.string().optional(),
});

export const DenunciaPublicaSchema = z.object({
  tipo: z.enum([
    'DISTRIBUCION_DESIGUAL',
    'COBRO_INDEBIDO',
    'ACOPIO_IRREGULAR',
    'AYUDA_VENCIDA',
    'EXCLUSION_CENSO',
    'OTRO',
  ]),
  municipioId: z.number().int().positive('El municipio es obligatorio'),
  barrio: z.string().min(2, 'El barrio o vereda es obligatorio'),
  descripcion: z.string().min(15, 'Por favor detalle los hechos con al menos 15 caracteres'),
  evidencia: z.string().url().optional().or(z.literal('')),
  denuncianteNombre: z.string().optional(),
  denuncianteContacto: z.string().optional(),
  esAnonima: z.boolean().default(false),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
});

export const VinculacionCentroSchema = z.object({
  centroAcopioId: z.number().int().positive('El centro de acopio es obligatorio'),
  nombre: z.string().min(3, 'El nombre es obligatorio'),
  telefono: z.string().min(7, 'El teléfono es obligatorio'),
  correo: z.string().email('Correo inválido'),
  actividad: z.string().min(3, 'La labor a desempeñar es obligatoria'),
  mensaje: z.string().optional(),
});

export type SolicitudAyudaPublicaDto = z.infer<typeof SolicitudAyudaPublicaSchema>;
export type ProponerCentroAcopioDto = z.infer<typeof ProponerCentroAcopioSchema>;
export type DonacionPublicaDto = z.infer<typeof DonacionPublicaSchema>;
export type VoluntariadoPublicoDto = z.infer<typeof VoluntariadoPublicoSchema>;
export type TransportePublicoDto = z.infer<typeof TransportePublicoSchema>;
export type DenunciaPublicaDto = z.infer<typeof DenunciaPublicaSchema>;
export type VinculacionCentroDto = z.infer<typeof VinculacionCentroSchema>;
