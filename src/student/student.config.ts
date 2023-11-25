import "reflect-metadata";
import { container } from "tsyringe";
import StudentRepository from "./infra/repository/student.repository";
import StudentController from "./interface/student.controller";

export default function studentConfig() {
  container.register("StudentRepository", {
    useClass: StudentRepository,
  });
  container.resolve(StudentController);
}
