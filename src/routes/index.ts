import { Express } from "express";
import productRouter from "./product";
const route = (app: Express) => {
  app.use("/api/v1/products", productRouter);
};

export { route };