import { http } from "@/lib/http";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/api/auth/auth";

export const AuthService = {
  register: async (payload: SignupRequest): Promise<SignupResponse> => {
    try {
      return await http<SignupResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error: any) {
      if (error.status === 409) {
        throw new Error(
          "El correo electrónico o identificación ya están registrados.",
        );
      }

      if (error.status === 400) {
        throw new Error(
          "Los datos proporcionados no son válidos. Revisa el formato.",
        );
      }

      throw new Error(error.message || "Error inesperado durante el registro.");
    }
  },

  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    try {
      return await http<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error(
          "Credenciales incorrectas. Verifica tu correo y contraseña.",
        );
      }
      throw new Error(error.message || "Error al iniciar sesión.");
    }
  },
};
