import { injectable, registry } from "tsyringe";
import Enrollment from "../../domain/enrollment";
import Lecture from "../../domain/lecture";
import ILectureRepository from "../../domain/repository/ilecture.repository";
import db from "../../../db";
import { RowDataPacket } from "mysql2";
@registry([{ token: "LectureRepository", useValue: "LectureRepository" }])
@injectable()
export default class LectureRepository implements ILectureRepository {
  async save(lecture: Lecture): Promise<number> {
    const query =
      "INSERT INTO lecture (instructor_id, title, description, price, category, status, num_of_students, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const result: any = await db.query(query, [
      lecture.instructor?.id,
      lecture.title,
      lecture.desc,
      lecture.price.money,
      lecture.category,
      lecture.status,
      lecture.numOfStudent,
      lecture.createdAt,
      lecture.updatedAt,
    ]);

    return result[0].insertId;
  }

  async findById(id: number): Promise<Lecture | null> {
    const result = await db.query("SELECT * FROM lecture WHERE id = ?", [id]);
    const lectureData: RowDataPacket[0] = result[0];
    const lecture: Lecture | null = this.mapToDomainEntity(lectureData);
    return lecture;
  }
  async findByTitle(title: string): Promise<Lecture | null> {
    const result = await db.query("SELECT * FROM lecture WHERE title = ?", [
      title,
    ]);
    const lectureData: RowDataPacket[0] = result[0];
    const lecture: Lecture | null = this.mapToDomainEntity(lectureData);
    return lecture;
  }

  update(lecture: Lecture): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async saveEnrollment(enrollment: Enrollment): Promise<void> {
    const query =
      "INSERT INTO enrollment (lecture_id, student_id, enrollment_date) VALUES (? ,?)";
    await db.query(query, [
      enrollment.lecture.id,
      enrollment.student.id,
      enrollment.enrollmentDate,
    ]);
    return;
  }

  async findByIdWithEnrollments(id: string): Promise<Lecture | null> {
    const result = await db.query(
      "SELECT * FROM lecture l LEFT JOIN enrollment e ON l.id = e.lecture_id WHERE l.id = ?",
      [id]
    );
    const enrollmentsData: RowDataPacket[0] = result[0];
    const enrollments: Enrollment[] | undefined =
      this.mapToEnrollments(enrollmentsData);
    const lectureData: RowDataPacket[0] = result[0];
    const lecture: Lecture | null = this.mapToDomainEntity(
      lectureData,
      enrollments
    );
    return lecture;
  }

  private mapToDomainEntity(data: RowDataPacket, enrollments?: Enrollment[]) {
    if (data.length == 0) {
      return null;
    }

    data = data[0];
    return Lecture.from({
      id: data.id,
      title: data.title,
      desc: data.description,
      price: data.price,
      category: data.category,
      status: data.status,
      numberOfStudent: data.number_of_student,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      enrollments: enrollments,
    });
  }

  private mapToEnrollments(data: RowDataPacket) {
    if (data.length == 0) {
      return;
    }
    const enrollments: Enrollment[] = [];
    for (let i = 0; i < data.length; ++i) {
      enrollments.push(
        new Enrollment({
          lecture: Lecture.from({
            id: data.id,
            title: data.title,
            desc: data.description,
            price: data.price,
            category: data.category,
            status: data.status,
            numberOfStudent: data.number_of_student,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          }),
          student: {
            id: data.student_id,
            nickName: "nickName",
          },
          enrollmentDate: new Date(data[i].enrollment_date),
        })
      );
      return enrollments;
    }
  }

  public closeConnection() {
    db.end();
  }
}
