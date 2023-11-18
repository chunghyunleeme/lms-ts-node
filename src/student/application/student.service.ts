import { inject } from "tsyringe";
import IStudentRepository from "../domain/repository/istudent.repository";
import Student from "../domain/student";

export default class StudentService {
  constructor(
    @inject("StudentRepository")
    private readonly studentRepository: IStudentRepository
  ) {}
  async join(email: string, nickName: string) {
    await this.checkDuplicateEmail(email);

    return await this.studentRepository.save(
      new Student({
        email,
        nickName,
      })
    );
  }

  private async checkDuplicateEmail(email: string) {
    const student = await this.studentRepository.findByEmail(email);
    if (student) {
      throw new Error("이미 존재하는 이메일입니다.");
    }
  }
}
