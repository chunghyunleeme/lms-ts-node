import { injectable } from "tsyringe";
import { StudentService as ExternalStudentService } from "../../../student/application/student.service";
import { IStudentService } from "../../application/adapter/istudent.service";
import { Student } from "../../domain/student";

@injectable()
export default class StudentService implements IStudentService {
  constructor(private readonly studentService: ExternalStudentService) {}
  async findById(id: number): Promise<Student | null> {
    const result = await this.studentService.findById(id);
    if (!result) {
      return null;
    }
    return {
      id: result.id,
      nickName: result.nickName,
    };
  }
}
