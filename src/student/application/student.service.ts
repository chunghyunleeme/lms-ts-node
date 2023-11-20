import { inject, injectable } from "tsyringe";
import IStudentRepository from "../domain/repository/istudent.repository";
import Student from "../domain/student";
import { AlreadyExistingEmail } from "../../error/already-existing-email.error";

@injectable()
export class StudentService {
  constructor(
    @inject("StudentRepository")
    private readonly studentRepository: IStudentRepository
  ) {}

  async join(email: string, nickName: string): Promise<number> {
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
      throw new AlreadyExistingEmail();
    }
  }
}
