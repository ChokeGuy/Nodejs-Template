import { Request, Response } from "express";
import Category from "../models/categoryModel";
import GenericResponse from "../dto/GenericResponse";
import { Product } from "../models/productModel";

class CategoryService {
  constructor() {
    this.createNewCategory = this.createNewCategory.bind(this);
    this.getCategoryById = this.getCategoryById.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.updateCategoryById = this.updateCategoryById.bind(this);
  }

  private createResponse(
    success: boolean,
    message: string,
    data: any,
    statusCode: number
  ) {
    return new GenericResponse(success, message, data, statusCode);
  }

  async getAllCategories(_req: Request, res: Response) {
    try {
      const categories = await Category.find().populate("products").exec();
      res
        .status(200)
        .json(
          this.createResponse(
            true,
            "Get all categories successfully",
            categories,
            200
          )
        );
    } catch (error) {
      res
        .status(500)
        .json(
          this.createResponse(false, "Failed to retrieve categories", null, 500)
        );
    }
  }

  async createNewCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name) {
        return res
          .status(400)
          .json(this.createResponse(false, "Invalid request data", null, 400));
      }

      const category = new Category({ name });
      const savedCategory = await category.save();
      res
        .status(200)
        .json(
          this.createResponse(
            true,
            "Created category successfully",
            savedCategory,
            200
          )
        );
    } catch (error) {
      res
        .status(500)
        .json(
          this.createResponse(false, "Failed to create category", null, 500)
        );
    }
  }

  async getCategoryById(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        return res
          .status(400)
          .json(this.createResponse(false, "Invalid request data", null, 400));
      }

      const category = await Category.findById(categoryId);
      if (!category) {
        return res
          .status(404)
          .json(this.createResponse(false, "Category not found", null, 404));
      }
      res
        .status(200)
        .json(
          this.createResponse(
            true,
            `Found category with id ${category._id} successfully`,
            category,
            200
          )
        );
    } catch (error) {
      res
        .status(500)
        .json(this.createResponse(false, "Failed to get category", null, 500));
    }
  }

  async updateCategoryById(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        return res
          .status(400)
          .json(this.createResponse(false, "Invalid request data", null, 400));
      }

      const { name } = req.body;
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        name,
        { new: true }
      );
      if (!updatedCategory)
        return res
          .status(404)
          .json(this.createResponse(false, "Category not found", null, 404));

      return res
        .status(200)
        .json(
          this.createResponse(true, "Category updated", updatedCategory, 200)
        );
    } catch (error) {
      res
        .status(500)
        .json(
          this.createResponse(false, "Failed to update category", null, 500)
        );
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      if (!categoryId) {
        return res
          .status(400)
          .json(this.createResponse(false, "Invalid request data", null, 400));
      }

      const result = await Category.findByIdAndDelete(categoryId);
      if (!result) {
        return res
          .status(404)
          .json(this.createResponse(false, "Category not found", null, 404));
      }
      return res
        .status(200)
        .json(this.createResponse(true, "Category deleted", null, 200));
    } catch (error) {
      res
        .status(500)
        .json(
          this.createResponse(false, "Failed to delete category", null, 500)
        );
    }
  }
}

export default CategoryService;
