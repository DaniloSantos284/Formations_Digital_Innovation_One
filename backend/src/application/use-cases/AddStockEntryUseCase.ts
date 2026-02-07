// Use case responsável por registrar entrada de estoque

import { randomUUID } from "crypto";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { StockMovementRepository } from "../../domain/repositories/StockMovementRepository";
import { StockMovement } from "../../domain/entities/StockMovement";
import { StockMovementType } from "../../domain/enums/StockMovementType";


type addStockEntryInput = {
  productId: string;
  quantity: number;
}

export class addStockEntryUseCase {
  constructor (
    private productRepository: ProductRepository,
    private stockMovementRepository: StockMovementRepository
  ) {}

  async execute(input: addStockEntryInput): Promise<void> {
    if (input.quantity <= 0) {
      throw new Error("A quantidade deve ser maior que zero.");
    }

    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new Error("Product not found")
    }

    const movements = await this.stockMovementRepository.findByProductId(product.id);

    // Reconstroi o agregado corretamente
    movements.forEach((movement) => product.addMovement(movement));

    const stockEntry = new StockMovement({
      id: randomUUID(),
      productId: product.id,
      type: StockMovementType.ENTRY,
      quantity: input.quantity
    });

    product.addMovement(stockEntry);

    await this.stockMovementRepository.save(stockEntry);
  }
}