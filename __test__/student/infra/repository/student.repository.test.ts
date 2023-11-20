import db from "../../../../src/db";
import Student from "../../../../src/student/domain/student";
import StudentRepository from "../../../../src/student/infra/repository/student.repository";

describe("student repository test", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM enrollment");
    await db.query("DELETE FROM student");
  });

  afterAll(async () => {
    await db.releaseConnection;
    await db.end();
  });
  const studentRepository: StudentRepository = new StudentRepository();

  it("save test", async () => {
    // given
    const student = new Student({
      email: "test@email.com",
      nickName: "test",
    });

    // when
    const result = await studentRepository.save(student);

    // then
    expect(typeof result).toBe("number");
  });

  it("updateForWithdrawal test", async () => {
    // given
    const student = new Student({
      email: "test@email.com",
      nickName: "test",
    });
    const result = await studentRepository.save(student);

    const findStudent: Student | null = await studentRepository.findById(
      result
    );
    findStudent?.withdraw();

    // when
    if (findStudent) await studentRepository.updateForWithdrawal(findStudent);

    // then
    const findStudentWithdrawal: Student | null =
      await studentRepository.findById(result);

    expect(findStudentWithdrawal?.email).toContain("/");
    expect(findStudentWithdrawal?.deletedAt).not.toBeNull();
  });

  it("findById test", async () => {
    // given
    const student = new Student({
      email: "test@email.com",
      nickName: "test",
    });
    const result = await studentRepository.save(student);

    // when
    const findStudent = await studentRepository.findById(result);

    // then
    expect(findStudent).not.toBeNull();
    expect(findStudent?.id).toBe(result);
  });

  it("findByEmail test", async () => {
    // given
    const student = new Student({
      email: "test@email.com",
      nickName: "test",
    });
    const result = await studentRepository.save(student);

    // when
    const findStudent = await studentRepository.findById(result);

    // then
    expect(findStudent).not.toBeNull();
    expect(findStudent?.email).toBe("test@email.com");
  });
});
