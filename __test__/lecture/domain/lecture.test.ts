import Instructor from "../../../src/instructor/domain/instructor";
import { Category } from "../../../src/lecture/domain/category";
import Lecture from "../../../src/lecture/domain/lecture";
import Student from "../../../src/student/domain/student";

describe("lecture test", () => {
  beforeEach(() => {});

  test("강의 생성 테스트", () => {
    const instructor = new Instructor("1", "테스트 교사");
    const lecture = new Lecture({
      instructor,
      id: "1",
      title: "테스트 강의",
      desc: "테스트 설명",
      price: 1000,
      category: Category.APP,
    });

    expect(lecture.title()).toBe("테스트 강의");
    expect(lecture.numOfStudent()).toBe(0);
    expect(lecture.category()).toBe(Category.APP);
    expect(lecture.instructor()).toBe(instructor);
  });

  test("강의 수강 테스트", () => {
    // given
    const instructor = new Instructor("1", "테스트 교사");
    const lecture = new Lecture({
      instructor,
      id: "1",
      title: "테스트 강의",
      desc: "테스트 설명",
      price: 1000,
      category: Category.APP,
    });

    const student = new Student({
      id: "1",
      email: "test@gmail.com",
      nickName: "test",
    });

    // when
    lecture.enrollStudent(student);

    // then
    expect(lecture.students()[0].student).toBe(student);
  });
});
