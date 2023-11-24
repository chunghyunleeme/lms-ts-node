import { inject, singleton } from "tsyringe";
import { Category } from "../domain/category";
import { Instructor } from "../domain/instructor";
import Lecture from "../domain/lecture";
import ILectureRepository from "../domain/repository/ilecture.repository";
import { Status } from "../domain/status";
import { IInstructorService } from "./adapter/iinstructor.service";
import { IStudentService } from "./adapter/istudent.service";
import { BadRequestError } from "../../http-error/bad-request.error";
import { CanNotFindLecture } from "../../error/cannot-find-lecture.error";
import { CanNotFindStudent } from "../../error/cannot-find-student.error";
import { PoolConnection } from "mysql2/promise";

@singleton()
export default class LectureService {
  constructor(
    @inject("LectureRepository")
    private readonly lectureRepository: ILectureRepository,
    @inject("InstructorService")
    private readonly instructorService: IInstructorService,
    @inject("StudentService")
    private readonly studentService: IStudentService
  ) {}

  // TODO. 병렬처리
  // 1. 이터레이터에서 커넥션 각각 가져옴
  // 2. 배열에 가져온 커넥션 push
  // 3. Promise.allsettled에 reject 체크
  // 4. 커넥션 배열 전부 rollback
  /**
   * 강의 N개를 등록한다.
   * 한개의 강의는 길이 1 배열
   * @param lectures
   */
  async saveLectures(
    lectures: Array<{
      instructorId: string;
      title: string;
      desc: string;
      price: number;
      category: Category;
    }>
  ) {
    const conn = await this.lectureRepository.getConnection();
    try {
      await conn.beginTransaction();
      for (const lecture of lectures) {
        await this.save({
          instructorId: lecture.instructorId,
          title: lecture.title,
          desc: lecture.desc,
          price: lecture.price,
          category: lecture.category,
          conn,
        });
      }
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  /**
   * 강의를 등록한다.
   */
  private async save({
    instructorId,
    title,
    desc,
    price,
    category,
    conn,
  }: {
    instructorId: string;
    title: string;
    desc: string;
    price: number;
    category: Category;
    conn?: PoolConnection;
  }): Promise<void> {
    const instructor: Instructor | null = await this.instructorService.findById(
      instructorId
    );
    if (!instructor) {
      throw new Error("존재하지 않는 강사입니다.");
    }

    const lecture = await this.lectureRepository.findByTitle(title);
    if (lecture) {
      throw new Error("이미 존재하는 강의명입니다.");
    }

    await this.lectureRepository.save(
      new Lecture({
        instructor,
        title,
        desc,
        price,
        category,
      }),
      conn
    );
  }

  /**
   * 강의의 기본 정보를 수정한다.
   */
  async update({
    lectureId,
    title,
    desc,
    price,
  }: {
    lectureId: number;
    title?: string;
    desc?: string;
    price?: number;
  }): Promise<void> {
    const conn = await this.lectureRepository.getConnection();
    try {
      conn.beginTransaction();
      const lecture = await this.lectureRepository.findById(lectureId, conn);
      if (!lecture) {
        throw new CanNotFindLecture();
      }

      lecture.update({
        title,
        desc,
        price,
      });

      await this.lectureRepository.update(lecture, conn);
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  /**
   * 강의의 상태를 공개로 변경한다.
   * @param id
   */
  async open(id: number): Promise<void> {
    const conn = await this.lectureRepository.getConnection();
    try {
      conn.beginTransaction();
      const lecture = await this.lectureRepository.findById(id, conn);

      if (!lecture) {
        throw new CanNotFindLecture();
      }
      if (lecture.status == Status.PUBLIC) {
        throw new BadRequestError("이미 공개된 강의 입니다.");
      }

      lecture.open();

      await this.lectureRepository.updateForOpen(lecture, conn);
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  /**
   * 학생이 N개의 강의에 등록한다.
   */
  async enrollLectures({
    lectureIds,
    studentId,
  }: {
    lectureIds: number[];
    studentId: number;
  }) {
    const conn = await this.lectureRepository.getConnection();
    try {
      await conn.beginTransaction();
      for (const lectureId of lectureIds) {
        await this.enroll({ lectureId, studentId, conn });
      }
      await conn.commit();
    } catch (e) {
      conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  /**
   * 학생이 강의에 등록한다.
   */
  private async enroll({
    lectureId,
    studentId,
    conn,
  }: {
    lectureId: number;
    studentId: number;
    conn: PoolConnection;
  }): Promise<number> {
    const lecture = await this.lectureRepository.findByIdWithEnrollments(
      lectureId,
      conn
    );
    if (!lecture) {
      throw new CanNotFindLecture();
    }
    console.log("lecture.enrollments = ", lecture.enrollments);

    const student = await this.studentService.findById(studentId);
    if (!student) {
      throw new CanNotFindStudent();
    }

    return await this.lectureRepository.saveEnrollment(
      lecture.enrollment(student),
      conn
    );
  }

  /**
   * 강의를 삭제한다.
   */
  async delete(id: number): Promise<void> {
    const conn = await this.lectureRepository.getConnection();
    try {
      conn.beginTransaction();
      const lecture: Lecture | null =
        await this.lectureRepository.findByIdWithEnrollments(id, conn);
      if (!lecture) {
        throw new CanNotFindLecture();
      }

      lecture.delete();

      await this.lectureRepository.softDelete(lecture, conn);
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }
}
