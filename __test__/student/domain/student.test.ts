import Student from "../../../src/student/domain/student";

describe("student test", () => {
  it("학생 생성 테스트", () => {
    const student = new Student({
      email: "chunghyun.dev@gmail.com",
      nickName: "lee",
    });

    expect(student.email).toBe("chunghyun.dev@gmail.com");
  });

  it("학생 탈퇴 테스트", () => {
    // given
    const student = new Student({
      email: "chunghyun.dev@gmail.com",
      nickName: "lee",
    });

    // when
    student.withdrawal();

    // then
    expect(student.email).toContain("/del/");
  });
});
