import { mock, when } from "ts-mockito";
import { StudentService } from "../../../src/student/application/student.service";
import StudentController from "../../../src/student/interface/student.controller";
import { Request, Response } from "express";

describe("student controller test", () => {
  const studentService: StudentService = mock(StudentService);
  const studentController: StudentController = new StudentController(
    studentService
  );

  describe("createStudent test", () => {
    it("성공", async () => {
      // given
      const email = "test";
      const nickName = "test";
      when(studentService.join(email, nickName)).thenResolve(1);
      const mockRequest = {
        body: { email, nickName },
      } as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      // when
      await studentController.createStudent(mockRequest, mockResponse);

      // then;
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });
});
