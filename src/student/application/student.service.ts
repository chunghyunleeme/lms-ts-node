import { inject, singleton } from "tsyringe";
import IStudentRepository from "../domain/repository/istudent.repository";
import Student from "../domain/student";
import { AlreadyExistingEmail } from "../../common/error/already-existing-email.error";
import { CanNotFindStudent } from "../../common/error/cannot-find-student.error";

@singleton()
export class StudentService {
  constructor(
    @inject("StudentRepository")
    private readonly studentRepository: IStudentRepository
  ) {}

  async join(email: string, nickName: string): Promise<number> {
    await this.validateDuplicateEmail(email);

    const result = await this.studentRepository.save(
      new Student({
        email,
        nickName,
      })
    );
    return result;
  }

  async withdraw(id: number): Promise<void> {
    const student: Student | null = await this.findById(id);
    if (!student) {
      throw new CanNotFindStudent();
    }

    student.withdraw();
    await this.studentRepository.updateForWithdrawal(student);
  }

  async findById(id: number): Promise<Student | null> {
    return await this.studentRepository.findById(id);
  }

  private async validateDuplicateEmail(email: string) {
    const student = await this.studentRepository.findByEmail(email);
    if (student) {
      throw new AlreadyExistingEmail();
    }
  }
}
