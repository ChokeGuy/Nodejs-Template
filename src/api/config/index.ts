import { Express } from "express";
import productRouter from "../v1/routes/productRoute";
import userRouter from "../v1/routes/userRoute";
const route = (app: Express) => {
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
};

export default route;
