import { AxiosError } from "axios";
import { ApiError } from "@/types/api";

export function normalizeError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: 
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erro ao comunicar com o servidor.",
      status: error.response?.status,
    };
  }

  return {
    message: "Ocorreu um erro inesperado.",
  };
}