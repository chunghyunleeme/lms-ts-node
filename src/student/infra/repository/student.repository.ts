import { injectable, registry } from "tsyringe";
import IStudentRepository from "../../domain/repository/istudent.repository";
import Student from "../../domain/student";
import db from "../../../db";
import { RowDataPacket } from "mysql2";

@registry([
  { token: "InstructorRepository", useValue: "DBInstructorRepository" },
])
@injectable()
export default class DBStudentRepository implements IStudentRepository {
  async save({
    email,
    nickName,
  }: {
    email: string;
    nickName: string;
  }): Promise<void> {
    const query = "INSERT INTO Student (nickName, email) VALUES (?, ?)";
    await db.query(query, [nickName, email]);
    return;
  }

  async findById(id: string): Promise<Student | null> {
    const result = await db.query("SELECT * FROM Student WHERE id = ?", [id]);
    const studentData: RowDataPacket[0] = result[0];

    const student: Student | null = this.mapToDomainEntity(studentData[0]);

    return student;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const result = await db.query("SELECT * FROM Student WHERE email = ?", [
      email,
    ]);
    const studentData: RowDataPacket[0] = result[0];
    const student: Student | null = this.mapToDomainEntity(studentData);

    return student;
  }

  mapToDomainEntity(data: RowDataPacket) {
    if (data.length === 0) {
      return null;
    }

    data = data[0];
    return new Student({
      id: data.id,
      email: data.email,
      nickName: data.nickName,
    });
  }
}
