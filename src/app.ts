import "reflect-metadata";
import express, { Application } from "express";
import studentRouter from "./student/routes/student.router";
import lectureRouter from "./lecture/routes/lecture.router";
import ErrorHandlerMiddleware from "./middleware/error.handler.middleware";
import AppConfig from "./app.config";
import { createConnection } from "./db";
export default class App {
  app: Application;

  constructor() {
    this.app = express();
    this.setDatabase();
    this.app.use(express.json());
    this.setRouter();
    this.setMiddleWare();
    AppConfig.init();
  }

  setDatabase() {
    try {
      createConnection();
    } catch (e) {
      throw e;
    }
  }

  setMiddleWare() {
    this.app.use(ErrorHandlerMiddleware);
  }

  setRouter() {
    this.app.use("/students", studentRouter);
    this.app.use("/lectures", lectureRouter);
  }
}
