export interface Product {
  id: number;
  name: string;
  barcode: string | null;
  category: string | null;
  quantity: number;
  price: number;
  img_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  type: "in" | "out";
  amount: number;
  created_at: string;
}