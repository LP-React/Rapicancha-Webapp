import { http } from "@/lib/http";
import { SignupRequest, SignupResponse } from "@/types/api/auth/auth";

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
};
