import Student from "../../../src/student/domain/student";

describe("student test", () => {
  test("학생 생성 테스트", () => {
    const student = new Student({
      id: "1",
      email: "chunghyun.dev@gmail.com",
      nickName: "lee",
    });

    expect(student.email()).toBe("chunghyun.dev@gmail.com");
  });
});
