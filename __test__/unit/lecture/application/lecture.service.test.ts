import { deepEqual, instance, mock, verify, when, anything } from "ts-mockito";
import LectureService from "../../../src/lecture/application/lecture.service";
import ILectureRepository from "../../../src/lecture/domain/repository/ilecture.repository";
import { IStudentService } from "../../../src/lecture/application/adapter/istudent.service";
import { IInstructorService } from "../../../src/lecture/application/adapter/iinstructor.service";
import Lecture from "../../../src/lecture/domain/lecture";
import { Category } from "../../../src/lecture/domain/category";
import { Status } from "../../../src/lecture/domain/status";
import { BadRequestError } from "../../../src/http-error/bad-request.error";
import { CanNotFindLecture } from "../../../src/error/cannot-find-lecture.error";
import { PoolConnection } from "mysql2/promise";

describe("lecture service test", () => {
  const studentService: IStudentService = mock<IStudentService>();
  const instructorService: IInstructorService = mock<IInstructorService>();
  const lectureRepository: ILectureRepository = mock<ILectureRepository>();
  const lectureService: LectureService = new LectureService(
    instance(lectureRepository),
    instance(instructorService),
    instance(studentService)
  );
  // describe("강의 등록 테스트", () => {
  //   it("동일한 강의명 중복 불가하다.", async () => {
  //     // given
  //     const title = "title";
  //     when(instructorService.findById("1")).thenResolve({
  //       id: "id",
  //       name: "name",
  //     });
  //     when(lectureRepository.findByTitle(title)).thenResolve(
  //       Lecture.from({
  //         id: 1,
  //         title,
  //         desc: "desc",
  //         price: 1000,
  //         category: Category.ALGORITHM,
  //         status: Status.PUBLIC,
  //         numberOfStudent: 0,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       })
  //     );

  //     // when, then
  //     await expect(
  //       lectureService.saveLectures([
  //         {
  //           instructorId: "1",
  //           title,
  //           desc: "desc",
  //           price: 1000,
  //           category: Category.ALGORITHM,
  //         },
  //       ])
  //     ).rejects.toThrow(new Error("이미 존재하는 강의명입니다."));
  //   });
  // });

  // describe("강의 수정 테스트", () => {
  //   it("실패: 존재하지 않는 강의인 경우 수정할 수 없다.", async () => {
  //     // given
  //     when(lectureRepository.findById(1)).thenResolve(null);
  //     when(lectureRepository.getConnection()).thenResolve(null);
  //     when(lectureRepository.findByTitle(anything()).thenResolve(null);
  //     when(lectureRepository.findById(anything())).thenResolve(null);

  //     // when, then
  //     await expect(
  //       lectureService.update({
  //         lectureId: 1,
  //         title: "title",
  //         desc: "desc",
  //         price: 1000,
  //       })
  //     ).rejects.toThrow(new CanNotFindLecture());
  //   });
  // });

  // describe("수강 신청 테스트", () => {
  //   it("실패: 가입하지 않은 수강생은 수강신청을 할 수 없다.", async () => {
  //     // given
  //     when(lectureRepository.findByIdWithEnrollments(1)).thenResolve(
  //       Lecture.from({
  //         id: 1,
  //         title: "title",
  //         desc: "desc",
  //         price: 1000,
  //         category: Category.ALGORITHM,
  //         status: Status.PUBLIC,
  //         numberOfStudent: 0,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       })
  //     );
  //     when(studentService.findById(1)).thenResolve(null);

  //     // when, then
  //     await expect(
  //       lectureService.enroll({ lectureId: 1, studentId: 1 })
  //     ).rejects.toThrow(new Error("존재하지 않는 학생입니다."));
  //   });

  //   it("실패: 삭제된 강의는 수강신청을 할 수 없다.", async () => {
  //     // given
  //     when(studentService.findById(1)).thenResolve({
  //       id: "1",
  //       name: "name",
  //       email: "email@email.com",
  //     });
  //     when(lectureRepository.findByIdWithEnrollments(1)).thenResolve(null);

  //     // when, then
  //     await expect(
  //       lectureService.enroll({ lectureId: 1, studentId: 1 })
  //     ).rejects.toThrow(new CanNotFindLecture());
  //   });
  // });

  // describe("강의 오픈 테스트", () => {
  //   it("성공", async () => {
  //     // given
  //     const lecture: Lecture = Lecture.from({
  //       id: 1,
  //       title: "title",
  //       desc: "desc",
  //       price: 1000,
  //       category: Category.ALGORITHM,
  //       status: Status.PRIVATE,
  //       numberOfStudent: 0,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     });

  //     when(lectureRepository.findById(lecture.id)).thenResolve(lecture);

  //     // when
  //     await lectureService.open(lecture.id);

  //     // then
  //     verify(
  //       lectureRepository.updateForOpen(
  //         deepEqual({
  //           ...lecture,
  //           status: Status.PUBLIC,
  //         } as Lecture)
  //       )
  //     ).never();
  //   });

  //   it("실패: 강의가 존재하지 않는 경우", async () => {
  //     // given
  //     const lectureId = 1;

  //     when(lectureRepository.findById(lectureId)).thenResolve(null);

  //     // when, then
  //     await expect(lectureService.open(lectureId)).rejects.toThrow(
  //       new CanNotFindLecture()
  //     );
  //   });

  //   it("실패: 이미 공개한 강의인 경우", async () => {
  //     // given
  //     const lecture: Lecture = Lecture.from({
  //       id: 1,
  //       title: "title",
  //       desc: "desc",
  //       price: 1000,
  //       category: Category.ALGORITHM,
  //       status: Status.PUBLIC,
  //       numberOfStudent: 0,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     });

  //     when(lectureRepository.findById(lecture.id)).thenResolve(lecture);

  //     // when, then
  //     await expect(lectureService.open(lecture.id)).rejects.toThrow(
  //       new BadRequestError("이미 공개된 강의 입니다.")
  //     );

  //     verify(
  //       lectureRepository.updateForOpen(
  //         deepEqual({
  //           ...lecture,
  //           status: Status.PUBLIC,
  //         } as Lecture)
  //       )
  //     ).never();
  //   });
  // });
});
