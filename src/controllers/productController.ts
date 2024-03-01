import GenericResponse from "../dto/GenericResponse";
import { Product } from "../models/productModel";
import { Request, Response } from "express";

class ProductController {
  constructor() {
    // Do the same for all other methods
    this.createResponse = this.createResponse.bind(this);
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.createNewProduct = this.createNewProduct.bind(this);
    this.deleteProductById = this.deleteProductById.bind(this);
    this.updateProductById = this.updateProductById.bind(this);
    this.restoreProductById = this.restoreProductById.bind(this);
  }

  private createResponse(
    success: boolean,
    message: string,
    data: any,
    statusCode: number
  ) {
    return new GenericResponse(success, message, data, statusCode);
  }

  public async getAllProducts(_req: Request, res: Response) {
    try {
      const products = await Product.find();
      if (!products) {
        return res
          .status(404)
          .json(this.createResponse(false, "No product found", undefined, 404));
      }
      res
        .status(200)
        .json(
          this.createResponse(
            true,
            "Get all products successfully",
            products,
            200
          )
        );
    } catch (error: any) {
      console.log(error);
      res
        .status(500)
        .json(
          this.createResponse(false, "Internal Server Error", undefined, 500)
        );
    }
  }

  public async getProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      if (!productId || productId === "" || isNaN(+productId))
        return res
          .status(400)
          .json(
            this.createResponse(false, "This id is invalid", undefined, 400)
          );

      const product = await Product.findOne({ id: +productId });
      if (!product) {
        return res
          .status(404)
          .json(
            this.createResponse(
              false,
              `Product with id ${productId} is not existed`,
              undefined,
              404
            )
          );
      }
      res.json(
        this.createResponse(
          true,
          `Get product with id ${productId} successfully`,
          product,
          200
        )
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          this.createResponse(false, "Internal Server Error", undefined, 500)
        );
    }
  }

  public async createNewProduct(req: Request, res: Response) {
    try {
      const { image, name, description, price, color } = req.body;
      if (!image || !name || !description || !price || !color) {
        return res
          .status(400)
          .json(
            this.createResponse(false, "Invalid request data", undefined, 400)
          );
      }
      const allProducts = await Product.find();
      const product = new Product({
        id: allProducts[allProducts.length - 1].id + 1,
        name,
        image,
        description,
        price,
        color,
      });
      await product.save();
      res
        .status(201)
        .json(
          this.createResponse(
            true,
            `Create new product successfully`,
            product,
            201
          )
        );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          this.createResponse(false, "Internal Server Error", undefined, 500)
        );
    }
  }

  public async updateProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      if (!productId || productId === "" || isNaN(+productId))
        return res
          .status(400)
          .json(
            this.createResponse(false, "This id is invalid", undefined, 400)
          );

      const { image, name, description, price, color } = req.body;
      if (!image || !name || !description || !price || !color) {
        return res
          .status(400)
          .json(
            this.createResponse(false, "Invalid request data", undefined, 400)
          );
      }
      const newProduct = { id: +productId, ...req.body };
      const product = await Product.findOneAndUpdate(
        { id: +productId },
        newProduct
      );
      if (!product) {
        return res
          .status(404)
          .json(
            this.createResponse(
              false,
              `Product with id ${productId} is not existed`,
              undefined,
              404
            )
          );
      }
      res.json(
        this.createResponse(
          true,
          `Update product with id ${productId} successfully`,
          newProduct,
          200
        )
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          this.createResponse(false, "Internal Server Error", undefined, 500)
        );
    }
  }

  public async restoreProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      if (!productId || productId === "" || isNaN(+productId))
        return res
          .status(400)
          .json(
            this.createResponse(false, "This id is invalid", undefined, 400)
          );

      const product = await Product.findOne({ id: +productId });
      if (!product) {
        return res
          .status(404)
          .json(
            this.createResponse(
              false,
              `Product with id ${productId} is not existed`,
              undefined,
              404
            )
          );
      } else if (!product.deleted) {
        return res
          .status(400)
          .json(
            this.createResponse(
              false,
              `Product with id ${productId} is not deleted yet`,
              undefined,
              400
            )
          );
      }

      await Product.updateOne(
        { id: +productId },
        {
          deletedAt: null,
          deleted: false,
        }
      );
      res.json(
        this.createResponse(
          true,
          `Restore product with id ${productId} successfully`,
          undefined,
          200
        )
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          this.createResponse(false, "Internal Server Error", undefined, 500)
        );
    }
  }

  public async deleteProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      if (!productId || productId === "" || isNaN(+productId))
        return res
          .status(400)
          .json(
            this.createResponse(false, "This id is invalid", undefined, 400)
          );

      const product = await Product.findOne({ id: +productId });
      if (!product) {
        return res
          .status(404)
          .json(
            this.createResponse(
              false,
              `Product with id ${productId} is not existed`,
              undefined,
              404
            )
          );
      }
      await Product.updateOne(
        { id: +productId },
        {
          deletedAt: new Date(),
          deleted: true,
        }
      );
      res.json(
        this.createResponse(
          true,
          `Delete product with id ${productId} successfully`,
          undefined,
          200
        )
      );
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          this.createResponse(false, "Internal Server Error", undefined, 500)
        );
    }
  }
}
export default ProductController;
