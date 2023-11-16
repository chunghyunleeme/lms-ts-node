import express, { Application, Request, Response, NextFunction } from "express";
import { createConnection } from "mysql2";
import db from "./db";

const app: Application = express();

app.use("/", (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: "hello inflab." });
});

export default app;
