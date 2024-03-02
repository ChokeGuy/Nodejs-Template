import { Request, Response } from "express";
import ProductService from "../services/productService";

const service = new ProductService();

class ProductController {
  public getAllProducts(req: Request, res: Response) {
    service.getAllProducts(req, res);
  }

  public getProductById(req: Request, res: Response) {
    service.getProductById(req, res);
  }

  public createNewProduct(req: Request, res: Response) {
    service.createNewProduct(req, res);
  }

  public updateProductById(req: Request, res: Response) {
    service.updateProductById(req, res);
  }

  public restoreProductById(req: Request, res: Response) {
    service.restoreProductById(req, res);
  }

  public deleteProductById(req: Request, res: Response) {
    service.deleteProductById(req, res);
  }
}
export default ProductController;
