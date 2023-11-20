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
    it("실패: 이미 동일한 이메일이 존재하는 경우", async () => {
      // given
      const email = "test";
      const nickName = "test";
      when(studentService.join(email, nickName)).thenReject(
        new Error("이미 존재하는 이메일입니다.")
      );
      const request = {
        body: { email, nickName },
      } as Request;
      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      // when
      await studentController.createStudent(request, response);

      // then;
      expect(response.status).toHaveBeenCalledWith(201);
    });

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
