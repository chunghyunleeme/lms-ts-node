import { injectable } from "tsyringe";
import { InstructorService as ExternalInstructorService } from "../../../instructor/application/instructor.service";
import { IInstructorService } from "../../application/adapter/iinstructor.service";

@injectable()
export class InstructorService implements IInstructorService {
  constructor(private readonly instructorService: ExternalInstructorService) {}
  async findById(id: string) {
    return this.instructorService.findById(id);
  }
}
