import { injectable } from "tsyringe";
import { InstructorService as ExternalInstructorService } from "../../../instructor/application/instructor.service";
import { IInstructorService } from "../../application/adapter/iinstructor.service";
import { Instructor } from "../../domain/instructor";

@injectable()
export class InstructorService implements IInstructorService {
  constructor(private readonly instructorService: ExternalInstructorService) {}
  async findById(id: string): Promise<Instructor | null> {
    const result = await this.instructorService.findById(id);
    if (!result) {
      return null;
    }
    return {
      id: result.id,
      name: result.name,
    };
  }
}
