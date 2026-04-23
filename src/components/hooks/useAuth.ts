import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { LoginResponse } from "@/types/api/auth/auth";

export function useAuth() {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getCookie("auth_user");
    if (userData) {
      try {
        const parsed =
          typeof userData === "string" ? JSON.parse(userData) : userData;
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user cookie", e);
      }
    }
    setLoading(false);
  }, []);

  return { user, loading };
}
