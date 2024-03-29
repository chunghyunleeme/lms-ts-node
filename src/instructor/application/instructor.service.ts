import { inject, injectable, singleton } from "tsyringe";
import Instructor from "../domain/instructor";
import IInstructorRepository from "../domain/repository/Iinstructor.repository";

@singleton()
export class InstructorService {
  constructor(
    @inject("InstructorRepository")
    private readonly instructorRepository: IInstructorRepository
  ) {}

  async create(name: string): Promise<void> {
    return await this.instructorRepository.save(name);
  }

  async findById(id: string): Promise<Instructor> {
    return await this.instructorRepository.findById(id);
  }
}
