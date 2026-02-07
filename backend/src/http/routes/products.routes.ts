import { Router } from "express";
import { GetProductDetailsController } from "../controllers/GetProductDetailsController";
import { GetProductDetailsUseCase } from "../../application/use-cases/GetProductDetailsUseCase";
import { MySqlProductRepository } from "../../infra/db/mysql/repositories/MySqlProductRepository";
import { MySqlStockMovementRepository } from "../../infra/db/mysql/repositories/MySqlStockMovementRepository";

const router = Router();

// Repositórios
const stockMovementRepository = new MySqlStockMovementRepository();
const productRepository = new MySqlProductRepository(
  stockMovementRepository
);

// Use case
const getProductDetailsUseCase = new GetProductDetailsUseCase(
  productRepository
);

// Controller
const getProductDetailsController = new GetProductDetailsController(
  getProductDetailsUseCase
);

router.get(
  "/products/:productId",
  (req, res) => getProductDetailsController.handle(req, res)
);

export default router;
