import { Category } from "../category";
import Enrollment from "../enrollment";
import Lecture from "../lecture";
import { Status } from "../status";

export default interface ILectureRepository {
  save(lecture: Lecture): Promise<number>;

  findById(id: number): Promise<Lecture | null>;

  findByIdWithEnrollments(id: string): Promise<Lecture | null>;

  findByTitle(title: string): Promise<Lecture | null>;

  update(lecture: Lecture): Promise<void>;

  saveEnrollment(enrollment: Enrollment): Promise<void>;
}
