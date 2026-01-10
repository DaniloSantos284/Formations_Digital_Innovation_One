import { api } from './api';
import { ApiResponse } from '../types/ApiResponse';
import { Product } from '../types/Product';

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<ApiResponse<Product[]>>('/api/products');

  if (!response.data.success) {
    throw new Error(response.data.error);
  }

  return response.data.data ?? [];
}