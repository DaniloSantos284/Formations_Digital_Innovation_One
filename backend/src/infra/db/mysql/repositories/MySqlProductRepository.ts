import { db } from "../connection";
import { Product } from "../../../../domain/entities/Product";
import { ProductRepository } from "../../../../domain/repositories/ProductRepository";
import { ProductCategory } from "../../../../domain/enums/ProductCategory";
import { StockMovementRepository } from "../../../../domain/repositories/StockMovementRepository";

export class MySqlProductRepository implements ProductRepository {
  constructor(
    private stockMovementRepository: StockMovementRepository
  ) {}

  async save(product: Product): Promise<void> {
    await db.execute(
      `
      INSERT INTO products (
        id,
        name,
        price,
        category,
        image_url,
        bar_code
      ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        product.id,
        product.name,
        product.price,
        product.category,
        product.imageUrl ?? null,
        product.barCode ?? null,
      ]
    );
  }

  async findById(id: string): Promise<Product | null> {
    const [rows] = await db.execute<any[]>(
      `
      SELECT *
      FROM products
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    const product = new Product({
      name: row.name,
      price: row.price,
      category: row.category as ProductCategory,
      imageUrl: row.image_url ?? undefined,
      barCode: row.bar_code ?? undefined,
    });

    /**
     *   IMPORTANTE:
     * Como o Product gera UUID no construtor,
     * precisamos sobrescrever o id vindo do banco
     */
    (product as any).id = row.id;

    // Busca os movimentos do produto
    const movements =
      await this.stockMovementRepository.findByProductId(product.id);

    // Reaplica os movimentos para reconstruir o estado
    movements.forEach((movement) => {
      product.addMovement(movement);
    });

    return product;
  }
}
