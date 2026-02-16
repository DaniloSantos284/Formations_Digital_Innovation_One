import { randomUUID } from "crypto";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { StockMovementRepository } from "../../domain/repositories/StockMovementRepository";
import { StockMovement } from "../../domain/entities/StockMovement";
import { StockMovementType } from "../../domain/enums/StockMovementType";


type AddStockExitInput = {
  productId: string;
  quantity: number;
};

export class AddStockExitUseCase {
  constructor (
    private productRepository: ProductRepository,
    private stockMovementRepository: StockMovementRepository
  ) {}


  async execute(input: AddStockExitInput): Promise<void> {
    if (input.quantity <= 0) {
      throw new Error("A quantidade deve ser maior que zero.")
    }

    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new Error("Produto não encontrado")
    }

    const movements = await this.stockMovementRepository.findByProductId(product.id);

    movements.forEach((movement) => product.addMovement(movement));

    const stockExit = new StockMovement({
      id: randomUUID(),
      productId: product.id,
      type: StockMovementType.EXIT,
      quantity: input.quantity,
    });

    // Aqui pode lançar um erro de estoque insuficiente
    product.addMovement(stockExit);

    await this.stockMovementRepository.save(stockExit);
  }
}