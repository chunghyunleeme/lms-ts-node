import { StudentService } from "../../../src/student/application/student.service";
import IStudentRepository from "../../../src/student/domain/repository/istudent.repository";
import { mock, when, instance } from "ts-mockito";
import StudentRepository from "../../../src/student/infra/repository/student.repository";
import Student from "../../../src/student/domain/student";

describe("student service test", () => {
  describe("회원가입 테스트", () => {
    it("이미 존재하는 이메일인 경우", async () => {
      const studentRepository: IStudentRepository = mock(StudentRepository);
      const studentService: StudentService = new StudentService(
        instance(studentRepository)
      );
      const email = "test@test.com";
      when(studentRepository.findByEmail(email)).thenResolve(
        new Student({
          email,
          nickName: "test",
        })
      );

      expect(
        async () => await studentService.join(email, "test")
      ).rejects.toThrow("이미 존재하는 이메일입니다.");
    });
  });
});