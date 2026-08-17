export interface ResultadoConsultaAyuda {
  existe: boolean;
  estado?: string;
  fechaRegistro?: string;
  organizacionEntregante?: string;
  numeroIdentificacion?: string;
}

export interface RegistrarAyudaPayload {
  numeroIdentificacion: string;
  organizacionEntregante: string;
  consentimientoDatos: boolean;
}

export interface ResultadoRegistroAyuda {
  yaRegistrado: boolean;
  estado: string;
  fechaRegistro: string;
  organizacionEntregante: string;
  mensaje: string;
}
