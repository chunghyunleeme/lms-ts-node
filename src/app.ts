import "reflect-metadata";
import express, { Application } from "express";
import studentRouter from "./student/routes/student.router";
import lectureRouter from "./lecture/routes/lecture.router";
import ErrorHandlerMiddleware from "./middleware/error.handler.middleware";
import AppConfig from "./app.config";
const app: Application = express();
AppConfig.init();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("hello inflab.");
});
app.use("/students", studentRouter);
app.use("/lectures", lectureRouter);
app.use(ErrorHandlerMiddleware);
export default app;
