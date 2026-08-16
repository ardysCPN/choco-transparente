import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { Usuario, TokenPayload } from '../types/auth.types';

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: () => boolean;
  login: (token: string, usuario: Usuario) => void;
  setUsuario: (usuario: Usuario) => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,

      isAuthenticated: () => {
        const token = get().token;
        if (!token) return false;
        try {
          const decoded = jwtDecode<TokenPayload>(token);
          if (!decoded.exp) return true;
          // Validar tiempo de expiración (exp está en segundos)
          return decoded.exp * 1000 > Date.now();
        } catch {
          return false;
        }
      },

      login: (token: string, usuario: Usuario) => {
        set({ token, usuario });
      },

      setUsuario: (usuario: Usuario) => {
        set({ usuario });
      },

      logout: () => {
        set({ token: null, usuario: null });
      },

      hasRole: (roles: string[]) => {
        const usuario = get().usuario;
        if (!usuario || !usuario.rol) return false;
        if (usuario.rol === 'SUPERADMIN') return true;
        return roles.includes(usuario.rol);
      },
    }),
    {
      name: 'choco-auth-storage',
    }
  )
);
