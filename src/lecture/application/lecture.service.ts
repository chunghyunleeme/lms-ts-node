import { inject, singleton } from "tsyringe";
import { Category } from "../domain/category";
import Instructor from "../domain/instructor";
import Lecture from "../domain/lecture";
import ILectureRepository from "../domain/repository/ilecture.repository";
import { Status } from "../domain/status";
import { IInstructorService } from "./adapter/iinstructor.service";
import { IStudentService } from "./adapter/istudent.service";
import { BadRequestError } from "../../common/error/http-error/bad-request.error";
import { CanNotFindLecture } from "../../common/error/cannot-find-lecture.error";
import { CanNotFindStudent } from "../../common/error/cannot-find-student.error";
import { PoolConnection } from "mysql2/promise";
import ArrayUtil from "../../common/util/array.util";

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

  async saveLectures(
    lectures: Array<{
      instructorId: string;
      title: string;
      desc: string;
      price: number;
      category: Category;
    }>
  ) {
    const start = performance.now();
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
    const end = performance.now();
    console.log(`save 직렬처리 속도: ${end - start} milliseconds.`);
  }

  // 병렬 처리
  // 1. 이터레이터에서 커넥션 각각 가져옴 + 트랜잭션 시작
  // 2. 배열에 가져온 커넥션 push
  // 3. Promise.allsettled에 reject 체크
  // 4. 커넥션 배열 전부 rollback
  /**
   * 강의 N개를 등록한다.
   * 한개의 강의는 길이 1 배열
   * @param lectures
   */
  async saveLecturesInParallel(
    lectures: Array<{
      instructorId: string;
      title: string;
      desc: string;
      price: number;
      category: Category;
    }>
  ) {
    const start = performance.now();
    const connList: PoolConnection[] = [];
    const result = await Promise.allSettled(
      lectures.map(async (lecture) => {
        const conn = await this.lectureRepository.getConnection();
        connList.push(conn);
        conn.beginTransaction();
        return await this.save({
          instructorId: lecture.instructorId,
          title: lecture.title,
          desc: lecture.desc,
          price: lecture.price,
          category: lecture.category,
          conn,
        });
      })
    );

    if (result.some((r) => r.status == "rejected")) {
      Promise.all(
        connList.map(async (c) => {
          await c.rollback();
          c.release();
        })
      );

      throw new BadRequestError("입력값을 확인해주세요.");
    }

    Promise.all(
      connList.map(async (c) => {
        await c.commit();
        c.release();
      })
    );
    const end = performance.now();
    console.log(`save 병렬처리 속도: ${end - start} milliseconds.`);
  }

  /**
   * 병렬 처리 갯수 제한 5개
   */
  async saveLecturesInParallelWith5(
    lectures: Array<{
      instructorId: string;
      title: string;
      desc: string;
      price: number;
      category: Category;
    }>
  ) {
    const start = performance.now();
    const NUM_OF_CONN = 5;

    const connList: PoolConnection[] = [];
    Array.from({ length: NUM_OF_CONN }, async () => {
      const conn = await this.lectureRepository.getConnection();
      conn.beginTransaction();
      connList.push(conn);
      return conn;
    });

    const chunkAll = ArrayUtil.chunk(lectures, NUM_OF_CONN);

    const promiseSettledResult: PromiseSettledResult<void>[] = [];
    for (let i = 0; i < lectures.length / NUM_OF_CONN; i++) {
      const lectureChunk = chunkAll[i];
      const result = await Promise.allSettled(
        lectureChunk.map(async (lecture, index) => {
          const conn = connList[index];
          return await this.save({
            instructorId: lecture.instructorId,
            title: lecture.title,
            desc: lecture.desc,
            price: lecture.price,
            category: lecture.category,
            conn,
          });
        })
      );
      promiseSettledResult.push(...result);
    }

    if (promiseSettledResult.some((r) => r.status == "rejected")) {
      Promise.all(
        connList.map(async (c) => {
          await c.rollback();
          c.release();
        })
      );

      throw new BadRequestError("입력값을 확인해주세요.");
    }

    Promise.all(
      connList.map(async (c) => {
        await c.commit();
        c.release();
      })
    );
    const end = performance.now();
    console.log(`save 5개 병렬처리 속도: ${end - start} milliseconds.`);
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
    return;
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

  async enrollLecturesInParallelWith5({
    lectureIds,
    studentId,
  }: {
    lectureIds: number[];
    studentId: number;
  }) {
    const NUM_OF_CONN = 5;
    const connList: PoolConnection[] = [];
    Array.from({ length: NUM_OF_CONN }, async () => {
      const conn = await this.lectureRepository.getConnection();
      conn.beginTransaction();
      connList.push(conn);
      return conn;
    });

    const chunkAll = ArrayUtil.chunk(lectureIds, NUM_OF_CONN);

    const promiseSettledResult: PromiseSettledResult<number>[] = [];
    for (let i = 0; i < chunkAll.length; i++) {
      const lectureIdsChunk = chunkAll[i];
      const result = await Promise.allSettled(
        lectureIdsChunk.map(async (lectureId, index) => {
          const conn = connList[index];
          return await this.enroll({
            lectureId,
            studentId,
            conn,
          });
        })
      );
      promiseSettledResult.push(...result);
    }
    if (promiseSettledResult.some((r) => r.status == "rejected")) {
      Promise.all(
        connList.map(async (c) => {
          await c.rollback();
          c.release();
        })
      );

      throw new BadRequestError("입력값을 확인해주세요.");
    }

    Promise.all(
      connList.map(async (c) => {
        await c.commit();
        c.release();
      })
    );
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
