import { Category } from "../category";
import Lecture from "../lecture";
import { Status } from "../status";

export default interface ILectureRepository {
  save(lecture: Lecture): Promise<void>;

  findById(id: string): Promise<Lecture>;

  findByTitle(title: string): Promise<Lecture>;
}
