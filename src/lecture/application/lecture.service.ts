import { inject, injectable, singleton } from "tsyringe";
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

  async save({
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
      conn.beginTransaction();
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
      conn.commit();
    } catch (e) {
      conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

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
    const lecture = await this.lectureRepository.findById(lectureId);
    if (!lecture) {
      throw new CanNotFindLecture();
    }

    lecture.update({
      title,
      desc,
      price,
    });

    await this.lectureRepository.update(lecture);
  }

  async open(id: number): Promise<void> {
    const lecture = await this.lectureRepository.findById(id);
    if (!lecture) {
      throw new CanNotFindLecture();
    }
    if (lecture.status == Status.PUBLIC) {
      throw new BadRequestError("이미 공개된 강의 입니다.");
    }

    lecture.open();

    await this.lectureRepository.updateForOpen(lecture);
  }

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
      lectureId
    );
    if (!lecture) {
      throw new CanNotFindLecture();
    }

    const student = await this.studentService.findById(studentId);
    if (!student) {
      throw new CanNotFindStudent();
    }

    return await this.lectureRepository.saveEnrollment(
      lecture.enrollment(student),
      conn
    );
  }

  async delete(id: number): Promise<void> {
    const lecture: Lecture | null =
      await this.lectureRepository.findByIdWithEnrollments(id);
    if (!lecture) {
      throw new CanNotFindLecture();
    }

    lecture.delete();

    await this.lectureRepository.softDelete(lecture);
  }
}
