import { Request, Response } from "express";
import { StudentService } from "../application/student.service";
import CreateStudentDto from "./dto/create-student.dto";
import { HttpError } from "../../http-error/http.error";

export default class StudentController {
  constructor(private readonly studentService: StudentService) {}
  async createStudent(req: Request, res: Response): Promise<Response> {
    let result;
    try {
      const { email, nickName }: CreateStudentDto = req.body;
      result = await this.studentService.join(email, nickName);
    } catch (e: any) {
      if (!(e instanceof HttpError)) {
        return res.status(500).send({
          message: e.message,
        });
      }
      return res.status(e.httpCode).send({
        message: e.message,
      });
    }
    return res.status(201).send({
      id: result,
    });
  }

  async withdrawal(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params["id"];
      await this.studentService.withdraw(parseInt(id));
    } catch (e: any) {
      if (!(e instanceof HttpError)) {
        return res.status(500).send({
          message: e.message,
        });
      }
      return res.status(e.httpCode).send({
        message: e.message,
      });
    }
    return res.status(200).send();
  }
}
