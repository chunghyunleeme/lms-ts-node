import { DependencyContainer, container } from "tsyringe";
import studentConfig from "./student/student.config";
import lectureConfig from "./lecture/lecture.config";

export default function configDI(): DependencyContainer {
  studentConfig(container);
  lectureConfig(container);
  return container;
}
