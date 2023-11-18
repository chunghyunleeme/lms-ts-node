import { inject } from "tsyringe";
import IStudentRepository from "../domain/repository/istudent.repository";

export default class StudentService {
  constructor(
    @inject("StudentRepository")
    private readonly studentRepository: IStudentRepository
  ) {}
  async join(email: string, nickName: string) {
    await this.checkDuplicateEmail(email);
    return this.studentRepository.save({ email, nickName });
  }

  private async checkDuplicateEmail(email: string) {
    const student = await this.studentRepository.findByEmail(email);
    if (student) {
      throw new Error("이미 존재하는 이메일입니다.");
    }
  }
}
