import Instructor from "../../domain/instructor";
import { RowDataPacket } from "mysql2";
import IInstructorRepository from "../../domain/repository/Iinstructor.repository";
import { pool } from "../../../db";

export default class InstructorRepository implements IInstructorRepository {
  async save(name: string): Promise<void> {
    await pool.query("INSERT INTO Instructor (name) VALUES (?)", [name]);
  }

  async findById(id: string): Promise<Instructor> {
    const result = await pool.query("SELECT * FROM instructor WHERE id = ?", [
      id,
    ]);
    const instructorData: RowDataPacket[0] = result[0];

    const instructor: Instructor = this.mapToDomainEntity(instructorData[0]);

    return instructor;
  }

  private mapToDomainEntity(data: RowDataPacket): Instructor {
    return new Instructor(data.id, data.name);
  }
}
