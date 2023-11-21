import "reflect-metadata";
import express, { Application } from "express";
import studentRouter from "./student/routes/student.router";
import lectureRouter from "./lecture/routes/lecture.router";

const app: Application = express();
app.use(express.json());
app.use("/students", studentRouter);
app.use("/lectures", lectureRouter);
export default app;
