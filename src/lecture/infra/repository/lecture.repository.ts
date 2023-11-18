import { injectable, registry } from "tsyringe";
import Enrollment from "../../domain/enrollment";
import Lecture from "../../domain/lecture";
import ILectureRepository from "../../domain/repository/ilecture.repository";
import db from "../../../db";
@registry([{ token: "LectureRepository", useValue: "LectureRepository" }])
@injectable()
export default class LectureRepository implements ILectureRepository {
  async saveEnrollment(enrollment: Enrollment): Promise<void> {
    const query =
      "INSERT INTO Enrollment (lecture_id, student_id, enrollment_date) VALUES (? ,?)";
    await db.query(query, [
      enrollment.lecture.id,
      enrollment.student.id,
      enrollment.enrollmentDate,
    ]);
    return;
  }
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
