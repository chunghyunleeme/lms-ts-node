import "reflect-metadata";
import { container } from "tsyringe";
import InstructorRepository from "./infra/repository/instructor.repository";

export default function instructorConfig() {
  container.register("InstructorRepository", {
    useClass: InstructorRepository,
  });

  return container;
}
