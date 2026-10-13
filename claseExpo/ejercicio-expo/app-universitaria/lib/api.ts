const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type Tarea = {
  id: number;
  titulo: string;
  completada: boolean;
  creadoEn: string;
  usuarioId: number;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Opciones = { method?: string; body?: unknown; token?: string };

async function request<T>(path: string, { method = 'GET', body, token }: Opciones = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError('Falta EXPO_PUBLIC_API_URL en el archivo .env', 0);
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu internet.', 0);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    
  }

  if (!res.ok) {
    throw new ApiError(data?.error ?? 'Ocurrió un error inesperado', res.status);
  }
  return data as T;
}

export const login = (email: string, password: string) =>
  request<{ token: string }>('/auth/login', { method: 'POST', body: { email, password } });

export const registro = (datos: { nombre: string; email: string; password: string; rol: string }) =>
  request<{ id: number; nombre: string; rol: string }>('/auth/registro', {
    method: 'POST',
    body: datos,
  });

export const getTareas = (token: string) => request<Tarea[]>('/v2/tareas', { token });