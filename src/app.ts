import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import studentRouter from "./routes/student.router";
import StudentRepository from "./student/infra/repository/student.repository";

const app: Application = express();
app.use(express.json());
app.use("/students", studentRouter);
export default app;
