import { Express } from "express";
import productRouter from "../v1/routes/productRoute";
import userRouter from "../v1/routes/userRoute";
import categoryRouter from "../v1/routes/categoryRoute";
const route = (app: Express) => {
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/categories", categoryRouter);
};

export default route;
