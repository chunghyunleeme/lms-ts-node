import db from "../../../db";
import { injectable, registry } from "tsyringe";
import Instructor from "../../domain/instructor";
import IInstructorRepository from "../../domain/repository/iinstructor.repository";
import { RowDataPacket } from "mysql2";

@registry([
  { token: "InstructorRepository", useValue: "DBInstructorRepository" },
])
@injectable()
export default class DBInstructorRepository implements IInstructorRepository {
  async save(name: string): Promise<void> {
    await db.query("INSERT INTO Instructor (name) VALUES (?)", [name]);
  }

  async findById(id: string): Promise<Instructor> {
    const result = await db.query("SELECT * FROM Instructor WHERE id = ?", [
      id,
    ]);
    const instructorData: RowDataPacket[0] = result[0];

    console.log("instructorData = ", instructorData);
    const instructor: Instructor = this.mapToDomainEntity(instructorData[0]);

    return instructor;
  }

  private mapToDomainEntity(data: RowDataPacket): Instructor {
    return new Instructor(data.id, data.name);
  }
}