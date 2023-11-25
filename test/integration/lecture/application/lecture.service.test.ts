import AppConfig from "../../../../src/app.config";
import ILectureRepository from "../../../../src/lecture/domain/repository/ilecture.repository";
import { IInstructorService } from "../../../../src/lecture/application/adapter/iinstructor.service";
import { IStudentService } from "../../../../src/lecture/application/adapter/istudent.service";
import { container } from "tsyringe";
import LectureService from "../../../../src/lecture/application/lecture.service";
import { Pool, PoolConnection } from "mysql2/promise";
import { Category } from "../../../../src/lecture/domain/category";
import { createConnection } from "../../../../src/db";

describe("LectureService", () => {
  let lectureRepository: ILectureRepository;
  let instructorService: IInstructorService;
  let studentService: IStudentService;
  let lectureService: LectureService;
  let testConnectionPool: Pool;
  let connArr: PoolConnection[] = [];
  beforeAll(async () => {
    AppConfig.init();
    testConnectionPool = createConnection();
  });

  beforeEach(async () => {
    lectureRepository = await container.resolve("LectureRepository");
    instructorService = await container.resolve("InstructorService");
    studentService = await container.resolve("StudentService");
    lectureService = new LectureService(
      lectureRepository,
      instructorService,
      studentService
    );
    Promise.all(
      Array.from({ length: 30 }, async () => {
        const conn = await testConnectionPool.getConnection();
        connArr.push(conn);
        conn.release();
        conn.beginTransaction();
      })
    );
  });

  afterEach(async () => {
    Promise.all(
      connArr.map(async (conn) => {
        await conn.rollback();
        conn.release();
      })
    );
  });

  afterAll(async () => {});

  describe("강의 등록 테스트", () => {
    it("강의 등록 테스트", async () => {
      try {
        await lectureService.saveLectures([
          {
            instructorId: "1",
            title: "test5",
            desc: "desc",
            price: 1000,
            category: Category.ALGORITHM,
          },
        ]);
      } catch (e) {
        console.error(e);
      }
    });
  });
  describe("강의 수정 테스트", () => {});
  describe("강의 공개 테스트", () => {});
  describe("수강 신청 테스트", () => {});
  describe("강의 삭제 테스트", () => {});
});
