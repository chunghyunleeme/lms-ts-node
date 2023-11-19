import { Instructor } from "../../domain/instructor";

export interface IInstructorService {
  findById(id: string): Promise<Instructor>;
}
