import Instructor from "../../../../src/instructor/domain/instructor";

describe("Instructor", () => {
  test("교사 생성 테스트", () => {
    const instructor = new Instructor("1", "인프랩");
    expect(instructor.name).toBe("인프랩");
  });
});
