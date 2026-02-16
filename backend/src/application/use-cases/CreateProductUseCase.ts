import { Product } from "../../domain/entities/Product";
import { ProductCategory } from "../../domain/enums/ProductCategory";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

type CreateProductInput = {
  name: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  barCode?: string;
};

type CreateProductOutput = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  imageUrl: string | undefined;
  barCode: string | undefined;
};

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) { }

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    if (!input.name || input.name.trim().length === 0) {
      throw new Error("Nome do produto é obrigatório.");
    }

    const product = new Product({
      name: input.name,
      price: input.price,
      category: input.category,
      imageUrl: input.imageUrl,
      barCode: input.barCode
    });

    await this.productRepository.save(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      barCode: product.barCode
    };
  }
}