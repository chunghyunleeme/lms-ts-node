import { DependencyContainer, container } from "tsyringe";
import studentConfig from "./student/student.config";
import lectureConfig from "./lecture/lecture.config";
import StudentRepository from "./student/infra/repository/student.repository";
import StudentController from "./student/interface/student.controller";
import instructorConfig from "./instructor/instructor.config";

export default class AppConfig {
  static init() {
    instructorConfig();
    studentConfig();
    lectureConfig();
  }
}
