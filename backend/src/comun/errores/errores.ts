export class ErrorAplicacion extends Error {
  constructor(
    public readonly codigo: string,
    mensaje: string,
    public readonly estadoHttp = 400
  ) {
    super(mensaje);
  }
}

export class ErrorNoAutorizado extends ErrorAplicacion {
  constructor(mensaje = 'No tiene permisos para realizar esta operación') {
    super('SIN_PERMISO', mensaje, 403);
  }
}

export class ErrorAutenticacion extends ErrorAplicacion {
  constructor(mensaje = 'Credenciales inválidas') {
    super('AUTENTICACION_INVALIDA', mensaje, 401);
  }
}

export class ErrorNoEncontrado extends ErrorAplicacion {
  constructor(mensaje = 'Recurso no encontrado') {
    super('NO_ENCONTRADO', mensaje, 404);
  }
}
