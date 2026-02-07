import axios from 'axios'

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message || 
      "Erro na conecção com o servidor"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado";
}