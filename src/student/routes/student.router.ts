// import "reflect-metadata";
import { NextFunction, Request, Response, Router } from "express";
import StudentController from "../interface/student.controller";
import { container } from "tsyringe";
const studentRouter = Router();
// const container = AppConfig.container();

// const studentController: StudentController =
//   container.resolve(StudentController);

// const studentController: StudentController = new StudentController();

studentRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  container.resolve(StudentController).createStudent(req, res, next);
});

studentRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    container.resolve(StudentController).withdrawal(req, res, next);
  }
);

export default studentRouter;
