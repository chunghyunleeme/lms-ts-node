import { Category } from "../category";
import Enrollment from "../enrollment";
import Lecture from "../lecture";
import { Status } from "../status";

export default interface ILectureRepository {
  save(lecture: Lecture): Promise<string>;

  findById(id: string): Promise<Lecture | null>;

  findByIdWithEnrollments(id: string): Promise<Lecture | null>;

  findByTitle(title: string): Promise<Lecture | null>;

  saveEnrollment(enrollment: Enrollment): Promise<void>;
}
