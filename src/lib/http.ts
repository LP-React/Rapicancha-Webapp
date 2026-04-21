const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function http<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
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
