import { Express } from "express";
import productRouter from "../v1/routes/productRoute";
const route = (app: Express) => {
  app.use("/api/v1/products", productRouter);
};

export default route;
