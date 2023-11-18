import Lecture from "../../domain/lecture";
import ILectureRepository from "../../domain/repository/ilecture.repository";

export default class LectureRepository implements ILectureRepository {
  save(lecture: Lecture): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Lecture> {
    throw new Error("Method not implemented.");
  }
  findByTitle(title: string): Promise<Lecture> {
    throw new Error("Method not implemented.");
  }
}
