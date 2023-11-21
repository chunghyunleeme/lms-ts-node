import { DependencyContainer, container } from "tsyringe";
import StudentRepository from "./infra/repository/student.repository";

export default function studentConfig(container: DependencyContainer) {
  container.register("StudentRepository", {
    useClass: StudentRepository,
  });
}
