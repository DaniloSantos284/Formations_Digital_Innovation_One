import { useState } from "react";
import {
  fetchProducts,
  fetchProductById,
  createProduct as apiCreateProduct,
  addStock,
  removeStock,
  fetchHistory
} from "@/api/products.api";
import { Product, StockMovement } from "@/types/Product";
import { useLoading } from "./useLoading";

export function useProducts() {
  const { loading, widthLoading } = useLoading();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [history, setHistory] = useState<StockMovement[]>([]);

  async function loadProducts() {
    return widthLoading(async () => {
      const data = await fetchProducts();
      setProducts(data);
    });
  }

  async function loadProductById(id: number) {
    return widthLoading(async () => {
      const data = await fetchProductById(id);
      setSelectedProduct(data);
    });
  }

  async function createProduct(data: Partial<Product>) {
    return widthLoading(async () => {
      await apiCreateProduct(data);
      await loadProducts();
    });
  }

  async function stockIn(id: number, amount: number) {
    return widthLoading(async () => {
      await addStock(id, amount);
      await loadProductById(id);
    });
  }

  async function stockOut(id: number, amount: number) {
    return widthLoading(async () => {
      await removeStock(id, amount);
      await loadProductById(id);
    });
  }

  async function loadHistory(id: number) {
    return widthLoading(async () => {
      const data = await fetchHistory(id);
      setHistory(data);
    });
  }


  return {
    loading,
    products,
    selectedProduct,
    history,
    loadProducts,
    loadProductById,
    createProduct,
    stockIn,
    stockOut,
    loadHistory
  };
}