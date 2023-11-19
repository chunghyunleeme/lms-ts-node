import { Category } from "../../../src/lecture/domain/category";
import Enrollment from "../../../src/lecture/domain/enrollment";
import { Instructor } from "../../../src/lecture/domain/instructor";
import Lecture from "../../../src/lecture/domain/lecture";
import { Status } from "../../../src/lecture/domain/status";
import { Student } from "../../../src/lecture/domain/student";

describe("lecture test", () => {
  beforeEach(() => {});

  it("강의 생성 테스트", () => {
    const instructor: Instructor = {
      id: "1",
      name: "테스트",
    };
    const lecture = new Lecture({
      instructor,
      title: "테스트 강의",
      desc: "테스트 설명",
      price: 1000,
      category: Category.APP,
    });

    expect(lecture.title).toBe("테스트 강의");
    expect(lecture.numOfStudent).toBe(0);
    expect(lecture.category).toBe(Category.APP);
    expect(lecture.instructor).toBe(instructor);
    expect(lecture.status).toBe(Status.PRIVATE);
  });

  it("강의 공개 테스트", () => {
    const instructor: Instructor = {
      id: "1",
      name: "테스트",
    };
    const lecture = new Lecture({
      instructor,
      title: "테스트 강의",
      desc: "테스트 설명",
      price: 1000,
      category: Category.APP,
    });

    lecture.open();

    expect(lecture.status).toBe(Status.PUBLIC);
  });

  describe("수강 신청 테스트", () => {
    it("실패: 비공개된 강의인 경우", () => {
      // given
      const instructor: Instructor = {
        id: "1",
        name: "테스트 교사",
      };

      const lecture = new Lecture({
        instructor,
        title: "테스트 강의",
        desc: "테스트 설명",
        price: 1000,
        category: Category.APP,
      });

      const student: Student = {
        id: "1",
        nickName: "test",
      };

      // when, then
      expect(() => lecture.enrollment(student)).toThrow(Error);
    });

    it("실패: 이미 수강 중인 경우", () => {
      // given
      const instructor: Instructor = {
        id: "1",
        name: "테스트 교사",
      };

      const student: Student = {
        id: "1",
        nickName: "test",
      };

      const lecture: Lecture = Lecture.from({
        id: "1",
        title: "title",
        desc: "desc",
        category: Category.ALGORITHM,
        price: 1000,
        status: Status.PUBLIC,
        numberOfStudent: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        enrollments: [
          new Enrollment({
            lecture: Lecture.from({
              id: "1",
              title: "title",
              desc: "desc",
              category: Category.ALGORITHM,
              price: 1000,
              status: Status.PUBLIC,
              numberOfStudent: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
            student: student,
            enrollmentDate: new Date(),
          }),
        ],
      });

      // when, then
      expect(() => lecture.enrollment(student)).toThrow(
        new Error("이미 수강 중인 강의는 신청할 수 없습니다.")
      );
    });

    it("성공", () => {
      // given
      const instructor: Instructor = {
        id: "1",
        name: "테스트 교사",
      };

      const lecture = new Lecture({
        instructor,
        title: "테스트 강의",
        desc: "테스트 설명",
        price: 1000,
        category: Category.APP,
      });
      lecture.open();

      const student: Student = {
        id: "1",
        nickName: "test",
      };

      // when
      const enrollment: Enrollment = lecture.enrollment(student);

      // then
      expect(enrollment.student).toBe(student);
      expect(enrollment.lecture).toBe(lecture);
      expect(lecture.numOfStudent).toBe(1);
    });
  });
});
