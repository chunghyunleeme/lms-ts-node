import Enrollment from "../../domain/enrollment";
import Lecture from "../../domain/lecture";
import ILectureRepository from "../../domain/repository/ilecture.repository";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { Status } from "../../domain/status";
import { BadRequestError } from "../../../common/error/http-error/bad-request.error";
import { PoolConnection } from "mysql2/promise";
import {
  EnrolledStudent,
  LectureDetail,
} from "../../domain/repository/dto/lecture.detail";
import LectureSummary from "../../domain/repository/dto/lecture.summary";
import LectureSearchRequest from "../../domain/repository/dto/lecture.search";
import Student from "../../domain/student";
import { pool } from "../../../db";

export default class LectureRepository implements ILectureRepository {
  constructor() {}
  async save(lecture: Lecture, conn?: PoolConnection): Promise<number> {
    const connection = conn ? conn : await this.getConnection();
    const query =
      "INSERT INTO lecture (instructor_id, title, description, price, category, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [result]: [ResultSetHeader, FieldPacket[]] = await connection.query(
      query,
      [
        lecture.instructor?.id,
        lecture.title,
        lecture.desc,
        lecture.price.money,
        lecture.category,
        lecture.status,
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

  async findById(id: number, conn: PoolConnection): Promise<Lecture | null> {
    const result = await conn.query("SELECT * FROM lecture WHERE id = ?", [id]);
    const lectureData: RowDataPacket[0] = result[0];
    const lecture: Lecture | null = this.mapToDomainEntity(lectureData);
    return lecture;
  }

  async findByTitle(title: string): Promise<Lecture | null> {
    const result = await pool.query("SELECT * FROM lecture WHERE title = ?", [
      title,
    ]);
    const lectureData: RowDataPacket[0] = result[0];
    const lecture: Lecture | null = this.mapToDomainEntity(lectureData);
    return lecture;
  }

  async findByIdWithEnrollments(
    id: number,
    conn: PoolConnection
  ): Promise<Lecture | null> {
    const result = await conn.query(
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

  async update(lecture: Lecture, conn: PoolConnection): Promise<void> {
    const query =
      "UPDATE lecture SET title = ?, description = ?, price = ?, updated_at = ? WHERE id = ?";
    await conn.query(query, [
      lecture.title,
      lecture.desc,
      lecture.price.money,
      new Date(),
      lecture.id,
    ]);
  }

  async updateForOpen(lecture: Lecture, conn: PoolConnection): Promise<void> {
    if (lecture.status != Status.PUBLIC) {
      throw new BadRequestError();
    }
    const query = "UPDATE lecture SET status = ?, updated_at = ? WHERE id = ?";
    await conn.query(query, [lecture.status, new Date(), lecture.id]);
  }

  async softDelete(lecture: Lecture, conn: PoolConnection): Promise<void> {
    await conn.query("UPDATE lecture SET deleted_at = ? WHERE id = ?", [
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
    data = data.filter((e: any) => e.enrollment_id);
    if (data.length == 0) {
      return [];
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
          student: new Student(data[i].student_id, data[i].student_nick_name),
          enrollmentDate: new Date(data[i].enrollment_date),
        })
      );
      return enrollments;
    }
  }

  /**
   * 조회용 쿼리
   */
  async findByIdForDetail(id: number): Promise<LectureDetail | null> {
    const conn = await this.getConnection();
    const query =
      "SELECT l.id AS lecture_id, l.title, l.description, l.price, l.category, l.status, l.created_at, l.updated_at, l.deleted_at, " +
      "s.id AS student_id, s.nick_name AS student_nick_name, s.deleted_at AS student_deleted_At, e.enrollment_date " +
      "FROM lecture l " +
      "LEFT JOIN enrollment e ON l.id = e.lecture_id " +
      "LEFT JOIN student s ON e.student_id = s.id AND s.deleted_at IS NULL " +
      "WHERE l.id = ? ";
    const result = await conn.query(query, [id]);
    const lectureData: RowDataPacket[0] = result[0];
    const students: EnrolledStudent[] | null =
      this.mapToEnrolledStudents(lectureData);
    return this.mapToLectureDetail(lectureData, students);
  }

  async findAll(
    param: LectureSearchRequest
  ): Promise<[LectureSummary[], number]> {
    const conn = await this.getConnection();
    let query =
      "SELECT DISTINCT l.id AS lecture_id, l.category, l.title, l.price, l.num_of_students, l.created_at, " +
      "i.name AS instructor_name " +
      "FROM lecture l " +
      "INNER JOIN instructor i ON l.instructor_id = i.id " +
      "LEFT JOIN enrollment e ON l.id = e.lecture_id " +
      "WHERE l.status = ?";

    const params: any[] = [Status.PUBLIC];

    if (param.instructorName) {
      query += " AND i.name LIKE ?";
      params.push(`%${param.instructorName}%`);
    }

    if (param.lectureTitle) {
      query += " AND l.title LIKE ?";
      params.push(`%${param.lectureTitle}%`);
    }

    if (param.category) {
      query += " AND l.category = ?";
      params.push(param.category);
    }

    if (param.studentId) {
      query += " AND e.student_id = ?";
      params.push(param.studentId);
    }

    const countQuery =
      "SELECT COUNT(*) AS count FROM " + query.split("FROM")[1];
    const [countResult]: RowDataPacket[0] = await conn.query(
      countQuery,
      params
    );
    const count = countResult[0].count;

    if (param.sortBy) {
      const order = param.sortBy.startsWith("-") ? "DESC" : "ASC";
      const field = param.sortBy.replace(/^-/, "");
      query += ` ORDER BY ${field} ${order}`;
    }

    if (param.page && param.pageSize) {
      query += " LIMIT ? OFFSET ?";
      params.push(param.limit, param.offset);
    }

    const result = await conn.query(query, params);
    const lectureData: RowDataPacket[0] = result[0];

    let lectures: LectureSummary[] = this.mapToLectureSummaries(lectureData);
    const numOfStudentsResults: RowDataPacket[0] =
      await this.fetchNumOfStudentsForLectures(
        conn,
        lectures.map((lecture) => lecture.id)
      );

    lectures = lectures.map((lecture) => {
      const result = numOfStudentsResults.find(
        (result: any) => result.lecture_id === lecture.id
      );
      if (result) {
        return { ...lecture, numOfStudents: result.num_of_students };
      }
      if (!result) {
        return { ...lecture, numOfStudents: 0 };
      }
      return lecture;
    });

    return [lectures, count];
  }

  private async fetchNumOfStudentsForLectures(
    conn: PoolConnection,
    lectureIds: number[]
  ) {
    if (lectureIds.length == 0) {
      return;
    }
    const numOfStudentQuery =
      "SELECT e.lecture_id, COUNT(e.student_id) as num_of_students " +
      "FROM enrollment e " +
      "INNER JOIN student s ON e.student_id = s.id AND s.deleted_at IS NULL " +
      "WHERE e.lecture_id IN (?) " +
      "GROUP BY e.lecture_id";
    const [result] = await conn.query(numOfStudentQuery, [lectureIds]);
    return result;
  }

  private mapToLectureDetail(
    data: RowDataPacket,
    students: EnrolledStudent[] | null
  ) {
    if (!data || data.length == 0) {
      return null;
    }
    return new LectureDetail({
      id: data[0].lecture_id,
      title: data[0].title,
      category: data[0].category,
      price: data[0].price,
      createdAt: data[0].created_at,
      updatedAt: data[0].updated_at,
      students,
    });
  }

  private mapToEnrolledStudents(data: RowDataPacket): EnrolledStudent[] | null {
    if (!data || data.length == 0) {
      return null;
    }
    return data
      .filter((enrollment: any) => enrollment.student_id != null)
      .map(
        (enrollment: any) =>
          new EnrolledStudent({
            id: enrollment.student_id,
            nickName: enrollment.student_nick_name,
            enrollmentDate: enrollment.enrollment_date,
          })
      );
  }

  private mapToLectureSummaries(data: RowDataPacket): LectureSummary[] {
    if (!data || data.length == 0) {
      return [];
    }
    return data.map((lectureWithInstructor: any) => {
      return new LectureSummary({
        id: lectureWithInstructor.lecture_id,
        category: lectureWithInstructor.category,
        title: lectureWithInstructor.title,
        price: lectureWithInstructor.price,
        instructorName: lectureWithInstructor.instructor_name,
        numOfStudents: lectureWithInstructor.num_of_students,
        createdAt: lectureWithInstructor.created_at,
      });
    });
  }

  async getConnection(): Promise<PoolConnection> {
    return await pool.getConnection();
  }

  async closeConnection() {
    await pool.end();
  }
}
