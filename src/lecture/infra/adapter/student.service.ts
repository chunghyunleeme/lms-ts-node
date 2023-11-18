import { injectable } from "tsyringe";
import { StudentService as ExternalStudentService } from "../../../student/application/student.service";
import { IStudentService } from "../../application/adapter/istudent.service";

@injectable()
export default class StudentService implements IStudentService {
  constructor(private readonly studentService: ExternalStudentService) {}
  async findById(id: string) {
    return await this.studentService.findById(id);
  }
}
