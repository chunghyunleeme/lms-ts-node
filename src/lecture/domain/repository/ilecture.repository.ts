import { LectureDetail } from "../../interface/dto/lecture.detail";
import Enrollment from "../enrollment";
import Lecture from "../lecture";
import { PoolConnection } from "mysql2/promise";

export default interface ILectureRepository {
  save(lecture: Lecture, conn?: PoolConnection): Promise<number>;

  saveEnrollment(enrollment: Enrollment, conn: PoolConnection): Promise<number>;

  findById(id: number, conn: PoolConnection): Promise<Lecture | null>;

  findByIdWithEnrollments(
    id: number,
    conn: PoolConnection
  ): Promise<Lecture | null>;

  findByTitle(title: string): Promise<Lecture | null>;

  update(lecture: Lecture, conn: PoolConnection): Promise<void>;

  updateForOpen(lecture: Lecture, conn: PoolConnection): Promise<void>;

  softDelete(lecture: Lecture, conn: PoolConnection): Promise<void>;

  getConnection(): Promise<PoolConnection>;

  /**
   * 조회용 레포지토리 메서드
   * @param id
   */

  findByIdForDetail(id: number): Promise<LectureDetail | null>;
}
