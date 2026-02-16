import { Router } from "express";

import { MySqlProductRepository } from "../../infra/db/mysql/repositories/MySqlProductRepository";
import { MySqlStockMovementRepository } from "../../infra/db/mysql/repositories/MySqlStockMovementRepository";

import { ListProductsUseCase } from "../../application/use-cases/ListProductsUseCase";
import { GetProductDetailsUseCase } from "../../application/use-cases/GetProductDetailsUseCase";

import { ListProductsController } from "../controllers/ListProductsController";
import { GetProductDetailsController } from "../controllers/GetProductDetailsController";

const router = Router();

// Repositórios
const stockMovementRepository =
  new MySqlStockMovementRepository();

const productRepository =
  new MySqlProductRepository(stockMovementRepository);

// Use cases
const listProductsUseCase =
  new ListProductsUseCase(productRepository);

const getProductDetailsUseCase =
  new GetProductDetailsUseCase(productRepository);

// Controllers
const listProductsController =
  new ListProductsController(listProductsUseCase);

const getProductDetailsController =
  new GetProductDetailsController(getProductDetailsUseCase);

// Rotas
router.get(
  "/products",
  (req, res) => listProductsController.handle(req, res)
);

router.get(
  "/products/:productId",
  (req, res) => getProductDetailsController.handle(req, res)
);

export default router;
