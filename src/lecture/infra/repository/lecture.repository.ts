import Enrollment from "../../domain/enrollment";
import Lecture from "../../domain/lecture";
import ILectureRepository from "../../domain/repository/ilecture.repository";
import db from "../../../db";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { Status } from "../../domain/status";
import { BadRequestError } from "../../../http-error/bad-request.error";
import { PoolConnection } from "mysql2/promise";

export default class LectureRepository implements ILectureRepository {
  constructor() {}
  async save(lecture: Lecture, conn?: PoolConnection): Promise<number> {
    const connection = conn ? conn : await this.getConnection();
    const query =
      "INSERT INTO lecture (instructor_id, title, description, price, category, status, num_of_students, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      query,
      [
        lecture.instructor?.id,
        lecture.title,
        lecture.desc,
        lecture.price.money,
        lecture.category,
        lecture.status,
        lecture.numOfStudent,
        lecture.createdAt,
        lecture.updatedAt,
      ]
    );

    return result.insertId;
  }

  async saveEnrollment(
    enrollment: Enrollment,
    conn: PoolConnection
  ): Promise<number> {
    const query =
      "INSERT INTO enrollment (lecture_id, student_id, enrollment_date) VALUES (? ,?, ?)";
    const [result]: [ResultSetHeader, FieldPacket[]] = await conn.query(query, [
      enrollment.lecture.id,
      enrollment.student.id,
      enrollment.enrollmentDate,
    ]);

    return result.insertId;
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

  async findByIdWithEnrollments(id: number): Promise<Lecture | null> {
    const result = await db.query(
      "SELECT " +
        "l.id, l.instructor_id, l.title, l.description, l.price, l.category, l.status, l.num_of_students, l.created_at, l.updated_at, " +
        "e.id AS enrollment_id, e.student_id, e.lecture_id, e.enrollment_date, " +
        "s.nick_name AS student_nick_name " +
        "FROM lecture l " +
        "LEFT JOIN enrollment e ON l.id = e.lecture_id " +
        "LEFT JOIN student s ON e.student_id = s.id " +
        "WHERE l.id = ?",
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

  async update(lecture: Lecture): Promise<void> {
    const query =
      "UPDATE lecture SET title = ?, description = ?, price = ?, updated_at = ? WHERE id = ?";
    await db.query(query, [
      lecture.title,
      lecture.desc,
      lecture.price.money,
      new Date(),
      lecture.id,
    ]);
  }

  async updateForOpen(lecture: Lecture): Promise<void> {
    if (lecture.status != Status.PUBLIC) {
      throw new BadRequestError();
    }
    const query = "UPDATE lecture SET status = ?, updated_at = ? WHERE id = ?";
    await db.query(query, [lecture.status, new Date(), lecture.id]);
  }

  async softDelete(lecture: Lecture): Promise<void> {
    await db.query("UPDATE lecture SET deleted_at = ? WHERE id = ?", [
      new Date(),
      lecture.id,
    ]);
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
    if (!data || !data[0].enrollment_id || data.length == 0) {
      return;
    }
    const enrollments: Enrollment[] = [];
    for (let i = 0; i < data.length; ++i) {
      enrollments.push(
        Enrollment.from({
          id: data[i].enrollment_id,
          lecture: Lecture.from({
            id: data[i].id,
            title: data[i].title,
            desc: data[i].description,
            price: data[i].price,
            category: data[i].category,
            status: data[i].status,
            numberOfStudent: data[i].number_of_student,
            createdAt: data[i].created_at,
            updatedAt: data[i].updated_at,
          }),
          student: {
            id: data[i].student_id,
            nickName: data[i].student_nick_name,
          },
          enrollmentDate: new Date(data[i].enrollment_date),
        })
      );
      return enrollments;
    }
  }
  async getConnection(): Promise<PoolConnection> {
    return await db.getConnection();
  }

  closeConnection() {
    db.end();
  }
}
