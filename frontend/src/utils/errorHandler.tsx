import toast from 'react-hot-toast';

export interface FormattedError {
  title: string;
  message: string;
  statusCode?: number;
  codigo?: string;
  detalles?: any;
}

/**
 * Extrae y formatea un mensaje explicativo y amigable para el usuario a partir de cualquier error de Axios / API / JavaScript
 */
export function formatApiError(error: any, fallbackMessage = 'Ocurrió un error al procesar la solicitud'): FormattedError {
  // 1. Error de Red / Conexión
  if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
    return {
      title: 'Error de Conexión',
      message: 'No fue posible comunicarse con el servidor. Verifica tu conexión a internet o que el servicio esté en línea.',
      statusCode: 0,
      codigo: 'ERR_NETWORK',
    };
  }

  // 2. Timeout
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      title: 'Tiempo de Espera Agotado',
      message: 'El servidor tardó demasiado en responder. Por favor intenta nuevamente en unos momentos.',
      statusCode: 408,
      codigo: 'TIMEOUT',
    };
  }

  const response = error?.response;
  const status = response?.status;
  const data = response?.data;

  // Mensaje enviado explícitamente por el backend en su respuesta JSON estándar
  const backendMessage =
    data?.mensaje ||
    data?.error ||
    (typeof data === 'string' ? data : null);

  const backendCode = data?.codigo || data?.code;

  switch (status) {
    case 400:
      return {
        title: 'Datos Inválidos',
        message: backendMessage || 'La información enviada no cumple con el formato requerido. Revisa los campos ingresados.',
        statusCode: 400,
        codigo: backendCode || 'VALIDACION',
        detalles: data?.datos || data?.detalles,
      };

    case 401:
      return {
        title: 'Sesión No Autorizada',
        message: backendMessage || 'Tu sesión ha expirado o no tienes una sesión activa. Por favor inicia sesión nuevamente.',
        statusCode: 401,
        codigo: backendCode || 'NO_AUTENTICADO',
      };

    case 403:
      return {
        title: 'Permisos Insuficientes (403)',
        message:
          backendMessage ||
          'Tu usuario no cuenta con los permisos necesarios para realizar esta acción. Contacta al Administrador de la Gobernación si requieres este acceso.',
        statusCode: 403,
        codigo: backendCode || 'SIN_PERMISO',
      };

    case 404:
      return {
        title: 'Recurso No Encontrado (404)',
        message: backendMessage || 'El registro o servicio solicitado no existe o fue eliminado.',
        statusCode: 404,
        codigo: backendCode || 'NO_ENCONTRADO',
      };

    case 409:
      return {
        title: 'Conflicto de Información (409)',
        message: backendMessage || 'El registro ya existe en el sistema o entra en conflicto con datos existentes (ej. documento, correo o código duplicado).',
        statusCode: 409,
        codigo: backendCode || 'CONFLICTO',
      };

    case 422:
      return {
        title: 'Error de Validación (422)',
        message: backendMessage || 'Los datos suministrados no pudieron ser procesados por las reglas de negocio del sistema.',
        statusCode: 422,
        codigo: backendCode || 'ENTIDAD_NO_PROCESABLE',
      };

    case 429:
      return {
        title: 'Demasiadas Solicitudes (429)',
        message: 'Has realizado demasiadas operaciones en poco tiempo. Por favor espera unos segundos antes de reintentar.',
        statusCode: 429,
        codigo: 'LIMITE_PETICIONES',
      };

    case 500:
      return {
        title: 'Error Interno del Servidor (500)',
        message: backendMessage || 'Ocurrió una falla inesperada en el servidor. El equipo técnico ha sido notificado.',
        statusCode: 500,
        codigo: backendCode || 'ERROR_SERVIDOR',
      };

    case 502:
    case 503:
    case 504:
      return {
        title: 'Servicio Temporalmente No Disponible',
        message: 'El servidor se encuentra en mantenimiento o reiniciando servicios. Intenta en 1 minuto.',
        statusCode: status,
        codigo: 'SERVICIO_NO_DISPONIBLE',
      };

    default:
      if (backendMessage) {
        return {
          title: 'Aviso del Sistema',
          message: backendMessage,
          statusCode: status,
          codigo: backendCode,
        };
      }
      return {
        title: 'Error Inesperado',
        message: error?.message || fallbackMessage,
        statusCode: status,
      };
  }
}

/**
 * Muestra una notificación visual enriquecida (Toast) con el error formateado y su causa raíz
 */
export function handleApiError(error: any, fallbackMessage?: string): FormattedError {
  const formatted = formatApiError(error, fallbackMessage);

  console.warn(`[ChocoTransparente Error] (${formatted.statusCode || 'N/A'}) ${formatted.title}:`, formatted.message, error);

  // Iconos e interactividad según el tipo de error
  let toastIcon = '⚠️';
  let toastBg = '#1e293b';

  if (formatted.statusCode === 403) {
    toastIcon = '⛔';
    toastBg = '#881337'; // Rose 900
  } else if (formatted.statusCode === 401) {
    toastIcon = '🔒';
    toastBg = '#7c2d12'; // Orange 900
  } else if (formatted.statusCode === 404) {
    toastIcon = '🔍';
  } else if (formatted.statusCode && formatted.statusCode >= 500) {
    toastIcon = '💥';
    toastBg = '#7f1d1d'; // Red 900
  }

  toast.error(
    () => (
      <div className="flex flex-col gap-0.5 max-w-sm">
        <span className="font-bold text-xs text-amber-300">{formatted.title}</span>
        <span className="text-xs text-slate-100 leading-snug">{formatted.message}</span>
      </div>
    ),
    {
      icon: toastIcon,
      duration: formatted.statusCode === 403 ? 6000 : 4500,
      style: {
        borderRadius: '14px',
        background: toastBg,
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 16px',
      },
    }
  );

  return formatted;
}
