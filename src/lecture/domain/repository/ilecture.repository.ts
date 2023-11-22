import { Pool } from "mysql2";
import Enrollment from "../enrollment";
import Lecture from "../lecture";
import { PoolConnection } from "mysql2/promise";

export default interface ILectureRepository {
  save(lecture: Lecture): Promise<number>;

  saveEnrollment(enrollment: Enrollment, conn: PoolConnection): Promise<number>;

  findById(id: number): Promise<Lecture | null>;

  findByIdWithEnrollments(id: number): Promise<Lecture | null>;

  findByTitle(title: string): Promise<Lecture | null>;

  update(lecture: Lecture): Promise<void>;

  updateForOpen(lecture: Lecture): Promise<void>;

  softDelete(lecture: Lecture): Promise<void>;

  getConnection(): Promise<PoolConnection>;
}
