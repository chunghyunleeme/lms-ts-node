import { Request, Response } from "express";
import { StudentService } from "../application/student.service";
import CreateStudentDto from "./dto/create-student.dto";
import { HttpError } from "../../http-error/http.error";

export default class StudentController {
  constructor(private readonly studentService: StudentService) {}
  async createStudent(req: Request, res: Response): Promise<Response> {
    try {
      const { email, nickName }: CreateStudentDto = req.body;
      const result = await this.studentService.join(email, nickName);

      return res.status(201).send({
        id: result,
      });
    } catch (e: any) {
      return res.status(e.httpCode).send({
        message: e.message,
      });
    }
  }
}
