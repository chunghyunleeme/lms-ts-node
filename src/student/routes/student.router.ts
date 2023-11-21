import "reflect-metadata";
import { Router } from "express";
import StudentController from "../interface/student.controller";
import configDI from "../../app.config";
import AppConfig from "../../app.config";
const studentRouter = Router();

const container = AppConfig.container();

const studentController: StudentController =
  container.resolve(StudentController);

studentRouter.post("/", (req, res) =>
  studentController.createStudent(req, res)
);

studentRouter.delete("/:id", (req, res) => {
  studentController.withdrawal(req, res);
});

export default studentRouter;
