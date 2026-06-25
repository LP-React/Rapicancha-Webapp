const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { getCookie } from "cookies-next";

export async function http<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  let token: string | undefined;

  if (typeof window === "undefined") {
    const { cookies } = require("next/headers");
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  } else {
    token = getCookie("token") as string | undefined;
  }

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData.message || "Error en la petición",
      ...errorData,
    };
  }

  return response.json();
}