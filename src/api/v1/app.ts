#!/usr/bin/env ts-node
require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
import express, { Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import route from "../config";
import mongodbConnection from "./lib/dbConnect";
import cors from "cors";
import corsOptions from "./middlewares/CorsMiddleware";
import limiter from "./middlewares/RateLimitMiddleware";
import redisConnection from "./lib/redisConnect";
import { cloudinaryConfig } from "./lib/imageUpload";

// Create an Express app
const app = express();

// Middleware
app.use(morgan("combined"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);

//MongdoDB Connection
mongodbConnection();

//Redis Connection
redisConnection();

// Upload Image to Cloudinary
cloudinaryConfig();

route(app);

app.get("/", (_req: Request, _res: Response) => {
  _res.send("Product Backend API");
});

export default app;
