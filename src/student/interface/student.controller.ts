import { NextFunction, Request, Response } from "express";
import { StudentService } from "../application/student.service";
import CreateStudentDto from "./dto/create-student.dto";
import { autoInjectable, singleton } from "tsyringe";
import { BadRequestError } from "../../common/error/http-error/bad-request.error";
@singleton()
export default class StudentController {
  constructor(private readonly studentService: StudentService) {}

  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, nickName }: CreateStudentDto = req.body;
      if (!email || !nickName) {
        throw new BadRequestError("이메일과 닉네임은 필수값입니다.");
      }
      const result = await this.studentService.join(email, nickName);
      return res.status(201).json({
        id: result,
      });
    } catch (e: any) {
      next(e);
    }
  }

  async withdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id) {
        throw new BadRequestError("id는 필수값입니다.");
      }
      await this.studentService.withdraw(parseInt(id));
      return res.status(200).json();
    } catch (e: any) {
      next(e);
    }
  }
}
