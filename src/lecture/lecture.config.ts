import "reflect-metadata";
import { container } from "tsyringe";
import LectureRepository from "./infra/repository/lecture.repository";
import LectureController from "./interface/lecture.controller";
import StudentService from "./infra/adapter/student.service";
import { InstructorService } from "./infra/adapter/instructor.service";

export default function lectureConfig() {
  container.register("LectureRepository", {
    useClass: LectureRepository,
  });
  container.register("InstructorService", {
    useClass: InstructorService,
  });
  container.register("StudentService", {
    useClass: StudentService,
  });

  container.resolve(LectureController);

  return container;
}
