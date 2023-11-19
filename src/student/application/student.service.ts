import { inject } from "tsyringe";
import IStudentRepository from "../domain/repository/istudent.repository";
import Student from "../domain/student";
import db from "../../db";

export class StudentService {
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

  public async findById(id: number) {
    return await this.studentRepository.findById(id);
  }

  private async checkDuplicateEmail(email: string) {
    const student = await this.studentRepository.findByEmail(email);
    if (student) {
      throw new Error("이미 존재하는 이메일입니다.");
    }
  }
}
