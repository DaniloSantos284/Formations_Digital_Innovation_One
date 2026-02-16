import { randomUUID } from "crypto";
import { StockMovement } from "./StockMovement";
import { ProductCategory } from "../enums/ProductCategory";

type ProductProps = {
  name: string;
  price: number;
  category: ProductCategory;
  imageUrl: string | undefined;
  barCode: string | undefined;
  stockMovements?: StockMovement[];
};

export class Product {
  public readonly id: string;
  public readonly name: string;
  public price: number;
  public category: ProductCategory;
  public imageUrl: string | undefined;
  public barCode: string | undefined;

  private stockMovements: StockMovement[];

  constructor(props: ProductProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Product name is required");
    }

    if (props.price < 0) {
      throw new Error("Product price cannot be negative");
    }

    this.id = randomUUID();
    this.name = props.name;
    this.price = props.price;
    this.category = props.category;
    this.imageUrl = props.imageUrl;
    this.barCode = props.barCode;
    this.stockMovements = props.stockMovements ?? [];
  }

  /**
   * Quantidade atual em estoque calculada
   * com base nos movimentos
   */
  get quantity(): number {
    return this.stockMovements.reduce(
      (total, movement) => total + movement.getSignedQuantity(),
      0
    );
  }

  /**
   * Registra um novo movimento de estoque
   */
  addMovement(movement: StockMovement): void {
    if (movement.isExit() && this.quantity < movement.quantity) {
      throw new Error("Insufficient stock");
    }

    this.stockMovements.push(movement);
  }

  /**
   * Retorna cópia imutável dos movimentos
   */
  get movements(): StockMovement[] {
    return [...this.stockMovements];
  }
}