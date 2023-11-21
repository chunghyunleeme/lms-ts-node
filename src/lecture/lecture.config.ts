import { DependencyContainer, container } from "tsyringe";
import LectureRepository from "./infra/repository/lecture.repository";
import InstructorRepository from "../instructor/infra/repository/instructor.repository";
import { InstructorService } from "../instructor/application/instructor.service";
import { StudentService } from "../student/application/student.service";

export default function lectureConfig(container: DependencyContainer) {
  container.register("LectureRepository", {
    useClass: LectureRepository,
  });
  container.register("InstructorRepository", {
    useClass: InstructorRepository,
  });
  container.register("InstructorService", {
    useClass: InstructorService,
  });
  container.register("StudentService", {
    useClass: StudentService,
  });

  return container;
}
