import express from "express";
import CategoryController from "../controllers/categoryController";

const categoryRouter = express.Router();
const controller = new CategoryController();
// Define your routes

// GET api/v1/categories: Get all categories
categoryRouter.get("/", controller.getAllCategories);

// GET api/v1/categories/:id: Get Category by id
categoryRouter.get("/:id", controller.getCategoryById);

// POST api/v1/categories: Create new Category
categoryRouter.post("/", controller.createNewCategory);

// PUT api/v1/categories: Update Category by id
categoryRouter.put("/:id", controller.updateCategoryById);

// DELETE api/v1/categories: Delete Category by id
categoryRouter.delete("/:id", controller.deleteCategory);

export default categoryRouter;
