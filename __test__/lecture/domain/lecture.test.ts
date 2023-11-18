import { Category } from "../../../src/lecture/domain/category";
import { Instructor } from "../../../src/lecture/domain/instructor";
import Enrollment from "../../../src/lecture/domain/enrollment";
import Lecture from "../../../src/lecture/domain/lecture";
import { Status } from "../../../src/lecture/domain/status";
import Student from "../../../src/student/domain/student";

describe("lecture test", () => {
  beforeEach(() => {});

  test("강의 생성 테스트", () => {
    const instructor: Instructor = {
      _id: "1",
      _name: "테스트",
    };
    const lecture = new Lecture({
      instructor,
      title: "테스트 강의",
      desc: "테스트 설명",
      price: 1000,
      category: Category.APP,
    });

    expect(lecture.title()).toBe("테스트 강의");
    expect(lecture.numOfStudent()).toBe(0);
    expect(lecture.category()).toBe(Category.APP);
    expect(lecture.instructor()).toBe(instructor);
    expect(lecture.status()).toBe(Status.PRIVATE);
  });

  test("강의 수강 테스트", () => {
    // given
    const instructor: Instructor = {
      _id: "1",
      _name: "테스트 교사",
    };

    const lecture = new Lecture({
      instructor,
      title: "테스트 강의",
      desc: "테스트 설명",
      price: 1000,
      category: Category.APP,
    });

    const student = new Student({
      email: "test@gmail.com",
      nickName: "test",
    });

    // when
    const enrollment: Enrollment = lecture.enrollment(student);

    // then
    expect(enrollment.student).toBe(student);
  });
});
