import "reflect-metadata";
import { Router } from "express";
import StudentController from "../student/interface/student.controller";
import { container } from "tsyringe";
import StudentRepository from "../student/infra/repository/student.repository";
const studentRouter = Router();

container.register("StudentRepository", {
  useClass: StudentRepository,
});

const studentController: StudentController =
  container.resolve(StudentController);

studentRouter.post("/", (req, res) =>
  studentController.createStudent(req, res)
);

studentRouter.delete("/:id", (req, res) => {
  studentController.withdrawal(req, res);
});

export default studentRouter;
