import "reflect-metadata";
import { NextFunction, Request, Response, Router } from "express";
import StudentController from "../interface/student.controller";
import AppConfig from "../../app.config";
const studentRouter = Router();

const container = AppConfig.container();

const studentController: StudentController =
  container.resolve(StudentController);

studentRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  studentController.createStudent(req, res, next);
});

studentRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    studentController.withdrawal(req, res, next);
  }
);

export default studentRouter;
