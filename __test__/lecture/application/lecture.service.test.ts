import { mock } from "ts-mockito";
import { IInstructorService } from "../../../src/lecture/application/adapter/iinstructor.service";
import LectureService from "../../../src/lecture/application/lecture.service";
import ILectureRepository from "../../../src/lecture/domain/repository/ilecture.repository";
import { InstructorService } from "../../../src/lecture/infra/adapter/instructor.service";
import LectureRepository from "../../../src/lecture/infra/repository/lecture.repository";
import { number, string } from "yargs";

describe("lecture service test", () => {
  const lectureRepository: ILectureRepository = mock(LectureRepository);
  const instructorService: IInstructorService = mock(InstructorService);
  const lectureService: LectureService = new LectureService(
    lectureRepository,
    instructorService
  );
  describe("수강 신청 테스트", () => {
    it("실패: 가입하지 않은 수강생인 경우", () => {});
    it("실패: 삭제된 강의인 경우", () => {});
    it("실패: 비공개된 강의인 경우", () => {});
  });
});
