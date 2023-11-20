import { StudentService } from "../../../src/student/application/student.service";
import IStudentRepository from "../../../src/student/domain/repository/istudent.repository";
import { mock, when, instance } from "ts-mockito";
import Student from "../../../src/student/domain/student";
import { AlreadyExistingEmail } from "../../../src/error/already-existing-email.error";
import { NotFoundError } from "../../../src/http-error/not-found.error";
import { CanNotFindStudent } from "../../../src/error/cannot-find-student.error";

describe("student service test", () => {
  const studentRepository: IStudentRepository = mock<IStudentRepository>();
  const studentService: StudentService = new StudentService(
    instance(studentRepository)
  );
  describe("회원가입 테스트", () => {
    it("실패: 이미 존재하는 이메일인 경우", async () => {
      // given
      const email = "test@test.com";
      when(studentRepository.findByEmail(email)).thenResolve(
        new Student({
          email,
          nickName: "test",
        })
      );

      // when, then
      expect(
        async () => await studentService.join(email, "test")
      ).rejects.toThrow(new AlreadyExistingEmail());
    });
  });

  describe("회원탈퇴 테스트", () => {
    it("실패: 존재하지 않는 학생인 경우", () => {
      // given
      const studentId = 1;
      when(studentRepository.findById(studentId)).thenResolve(null);

      // when, then
      expect(
        async () => await studentService.withdraw(studentId)
      ).rejects.toThrow(new CanNotFindStudent());
    });
  });
});
