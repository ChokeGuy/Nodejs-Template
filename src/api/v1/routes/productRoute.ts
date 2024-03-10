import express from "express";
import ProductController from "../controllers/productController";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import corsOptions from "../middlewares/CorsMiddleware";
import cors from "cors";
const productRouter = express.Router();
const controller = new ProductController();
// Define your routes

// GET api/v1/products: Get all products
productRouter.get("/", controller.getAllProducts);

// GET api/v1/products/:id: Get product by id
productRouter.get("/:id", controller.getProductById);

// POST api/v1/products: Create new product
productRouter.post("/", controller.createNewProduct);

// PUT api/v1/products: Update product by id
productRouter.put("/:id", controller.updateProductById);

// PATCH api/v1/products/:id/restore Restore softdelete product by id

productRouter.patch("/:id/restore", controller.restoreProductById);

// DELETE api/v1/products: Delete product by id
productRouter.delete("/:id", controller.deleteProductById);

export default productRouter;
