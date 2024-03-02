import { Express } from "express";
import productRouter from "./productRoute";
const route = (app: Express) => {
  app.use("/api/v1/products", productRouter);
};

export { route };