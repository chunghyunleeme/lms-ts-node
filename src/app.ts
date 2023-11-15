import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();

app.use("/", (req: Request, res: Response, next: NextFunction): void => {
  res.json({ message: "hello inflab." });
});

export default app;
