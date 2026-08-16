import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { formatApiError } from '../../utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud: agrega el token JWT si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta: enriquecimiento de errores y manejo de 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Adjuntar mensaje interpretado y formateado directamente al objeto de error
    const formatted = formatApiError(error);
    error.userMessage = formatted.message;
    error.userTitle = formatted.title;

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      // Solo redirigir si está en el panel administrativo privado
      const path = window.location.pathname;
      const isAdminRoute =
        path.startsWith('/admin') ||
        path === '/territorial' ||
        path === '/inventario' ||
        path === '/beneficiarios' ||
        path === '/albergues-denuncias' ||
        path === '/financiero' ||
        path === '/reportes' ||
        path === '/usuarios';

      if (isAdminRoute && path !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
