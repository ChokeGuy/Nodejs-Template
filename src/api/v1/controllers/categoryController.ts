import { Request, Response } from "express";
import CategoryService from "../services/categoryService";

const service = new CategoryService();

class ProductController {
  public getAllCategories(req: Request, res: Response) {
    service.getAllCategories(req, res);
  }

  public getCategoryById(req: Request, res: Response) {
    service.getCategoryById(req, res);
  }

  public createNewCategory(req: Request, res: Response) {
    service.createNewCategory(req, res);
  }

  public updateCategoryById(req: Request, res: Response) {
    service.updateCategoryById(req, res);
  }

  public deleteCategory(req: Request, res: Response) {
    service.deleteCategory(req, res);
  }
}
export default ProductController;
