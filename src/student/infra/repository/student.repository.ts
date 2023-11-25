import { pool } from "../../../db";
import IStudentRepository from "../../domain/repository/istudent.repository";
import Student from "../../domain/student";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";

export default class StudentRepository implements IStudentRepository {
  constructor() {}
  async save(student: Student): Promise<number> {
    const query = "INSERT INTO student (nick_name, email) VALUES (?, ?)";
    const [result]: [ResultSetHeader, FieldPacket[]] = await pool.query(query, [
      student.nickName,
      student.email,
    ]);

    return result.insertId;
  }

  async updateForWithdrawal(student: Student): Promise<void> {
    await pool.query(
      "UPDATE student SET email = ?, deleted_at = ? WHERE id = ?",
      [student.email, new Date(), student.id]
    );
    return;
  }

  async findById(id: number): Promise<Student | null> {
    const result = await pool.query("SELECT * FROM student WHERE id = ?", [id]);

    const studentData: RowDataPacket[0] = result[0];

    const student: Student | null = this.mapToDomainEntity(studentData[0]);

    return student;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const result = await pool.query("SELECT * FROM student WHERE email = ?", [
      email,
    ]);
    const studentData: RowDataPacket[0] = result[0];
    const student: Student | null = this.mapToDomainEntity(studentData);

    return student;
  }

  mapToDomainEntity(data: RowDataPacket) {
    if (!data || data.length == 0) {
      return null;
    }

    return Student.from({
      id: data.id,
      email: data.email,
      nickName: data.nickName,
      deletedAt: data.deleted_at,
    });
  }
}
