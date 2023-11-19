import { instance, mock, when } from "ts-mockito";
import LectureService from "../../../src/lecture/application/lecture.service";
import ILectureRepository from "../../../src/lecture/domain/repository/ilecture.repository";
import LectureRepository from "../../../src/lecture/infra/repository/lecture.repository";
import { IStudentService } from "../../../src/lecture/application/adapter/istudent.service";
import StudentService from "../../../src/lecture/infra/adapter/student.service";
import { IInstructorService } from "../../../src/lecture/application/adapter/iinstructor.service";
import { InstructorService } from "../../../src/lecture/infra/adapter/instructor.service";
import Lecture from "../../../src/lecture/domain/lecture";
import { Category } from "../../../src/lecture/domain/category";
import { Status } from "../../../src/lecture/domain/status";
import Enrollment from "../../../src/lecture/domain/enrollment";

describe("lecture service test", () => {
  const studentService: IStudentService = mock(StudentService);
  const instructorService: IInstructorService = mock(InstructorService);
  const lectureRepository: ILectureRepository = mock(LectureRepository);
  const lectureService: LectureService = new LectureService(
    instance(lectureRepository),
    instance(instructorService),
    instance(studentService)
  );
  describe("강의 등록 테스트", () => {
    it("동일한 강의명 중복 불가하다.", () => {
      // given
      const title = "title";
      when(instructorService.findById("1")).thenResolve({
        id: "id",
        name: "name",
      });
      when(lectureRepository.findByTitle(title)).thenResolve(
        Lecture.from({
          id: "1",
          title,
          desc: "desc",
          price: 1000,
          category: Category.ALGORITHM,
          status: Status.PUBLIC,
          numberOfStudent: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      // when, then
      expect(
        async () =>
          await lectureService.save({
            instructorId: "1",
            title,
            desc: "desc",
            price: 1000,
            category: Category.ALGORITHM,
          })
      ).rejects.toThrow(new Error("이미 존재하는 강의명입니다."));
    });
  });

  describe("수강 신청 테스트", () => {
    it("실패: 가입하지 않은 수강생은 수강신청을 할 수 없다.", () => {
      // given
      when(lectureRepository.findByIdWithEnrollments("1")).thenResolve(
        Lecture.from({
          id: "1",
          title: "title",
          desc: "desc",
          price: 1000,
          category: Category.ALGORITHM,
          status: Status.PUBLIC,
          numberOfStudent: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );
      when(studentService.findById("1")).thenResolve(null);

      // when, then
      expect(
        async () =>
          await lectureService.enroll({ lectureId: "1", studentId: "1" })
      ).rejects.toThrow(new Error("존재하지 않는 학생입니다."));
    });

    it("실패: 삭제된 강의는 수강신청을 할 수 없다.", () => {
      // given
      when(studentService.findById("1")).thenResolve({
        id: "1",
        name: "name",
        email: "email@email.com",
      });
      when(lectureRepository.findByIdWithEnrollments("1")).thenResolve(null);

      // when, then
      expect(
        async () =>
          await lectureService.enroll({ lectureId: "1", studentId: "1" })
      ).rejects.toThrow(new Error("존재하지 않는 강의입니다."));
    });

    it("실패: 비공개 강의는 강의를 신청 할 수 없다.", () => {
      // given
      when(studentService.findById("1")).thenResolve({
        id: "1",
        name: "name",
      });
      when(lectureRepository.findByIdWithEnrollments("1")).thenResolve(
        Lecture.from({
          id: "1",
          title: "title",
          desc: "desc",
          price: 1000,
          category: Category.ALGORITHM,
          status: Status.PRIVATE,
          numberOfStudent: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      // when, then
      expect(
        async () =>
          await lectureService.enroll({ lectureId: "1", studentId: "1" })
      ).rejects.toThrow(new Error("비공개된 강의는 수강 신청할 수 없습니다."));
    });
  });
});
