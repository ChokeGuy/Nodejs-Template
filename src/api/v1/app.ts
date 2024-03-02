#!/usr/bin/env ts-node
import express, { Request, Response } from "express";
import morgan from "morgan";
import { route } from "./routes";
import "dotenv/config";
import mongodbConnection from "./lib/dbConnect";
mongodbConnection();

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

route(app);

app.get("/", (_req: Request, _res: Response) => {
  _res.send("Product Backend API");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
